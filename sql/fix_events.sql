-- This script fixes the events table schema and refreshes the schema cache

-- First, check if the event_date column exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name = 'event_date'
    ) INTO column_exists;

    -- If the column doesn't exist, add it
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE events ADD COLUMN event_date TIMESTAMPTZ';
        RAISE NOTICE 'Added event_date column to events table';
    ELSE
        RAISE NOTICE 'event_date column already exists in events table';
    END IF;
    
    -- Check if updated_at column exists
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name = 'updated_at'
    ) INTO column_exists;
    
    -- If the column doesn't exist, add it
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE events ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()';
        RAISE NOTICE 'Added updated_at column to events table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in events table';
    END IF;
END
$$;

-- Refresh the schema cache
SELECT pg_notify('pgrst', 'reload schema cache');

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events';

-- Add a trigger to automatically update the updated_at timestamp
DROP TRIGGER IF EXISTS set_updated_at_events ON events;

CREATE OR REPLACE FUNCTION update_events_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_events
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_events_modified_column();

-- If needed, recreate the RLS policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view events" ON events;
    DROP POLICY IF EXISTS "Authenticated users with proper permissions can manage events" ON events;

    -- Recreate policies
    CREATE POLICY "Anyone can view events" ON events
        FOR SELECT USING (true);

    CREATE POLICY "Authenticated users with proper permissions can manage events" ON events
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM users
                WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
            )
        );

    RAISE NOTICE 'Successfully recreated RLS policies for events table';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error recreating policies: %', SQLERRM;
END
$$;

-- Add validation for event status based on event date
DROP TRIGGER IF EXISTS validate_event_status_trigger ON events;

CREATE OR REPLACE FUNCTION validate_event_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If event_date is in the past and status is being set to 'Upcoming', raise an error
    IF NEW.event_date < NOW() AND NEW.status = 'Upcoming' THEN
        RAISE EXCEPTION 'Cannot set status to Upcoming for past dates';
    END IF;
    
    -- If event_date is in the past and status is not explicitly set to 'Cancelled', set it to 'Completed'
    IF NEW.event_date < NOW() AND NEW.status != 'Cancelled' THEN
        NEW.status := 'Completed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_event_status_trigger
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION validate_event_status();

-- Run a one-time update of existing event statuses based on dates
UPDATE events
SET status = 'Completed', updated_at = NOW()
WHERE event_date < NOW() 
AND status = 'Upcoming'; 