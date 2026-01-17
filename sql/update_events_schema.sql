-- Script to add rsvp_link column to events table if it doesn't exist

-- Check if the column exists before adding it
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name = 'rsvp_link'
    ) INTO column_exists;

    -- If the column doesn't exist, add it
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE events ADD COLUMN rsvp_link TEXT';
        RAISE NOTICE 'Added rsvp_link column to events table';
    ELSE
        RAISE NOTICE 'rsvp_link column already exists in events table';
    END IF;
END
$$;

-- Refresh the schema cache
SELECT pg_notify('pgrst', 'reload schema cache');

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events'; 