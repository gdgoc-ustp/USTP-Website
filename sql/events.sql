-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users with proper permissions can manage events" ON events;

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_updated_at_events ON events;
DROP TRIGGER IF EXISTS validate_event_status_trigger ON events;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_events_modified_column();
DROP FUNCTION IF EXISTS validate_event_status();

-- Drop the existing table if it exists
DROP TABLE IF EXISTS events;

-- Create enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('Upcoming', 'Completed', 'Cancelled');
    END IF;
END
$$;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    status event_status NOT NULL DEFAULT 'Upcoming',
    event_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create function and trigger for automatic updated_at timestamp
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

-- Create function and trigger for event status validation
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

-- Create policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users with proper permissions can manage events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
        )
    ); 