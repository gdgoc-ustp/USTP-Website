-- This script adds event status validation and automatic status updates

-- 1. Create a function to validate event status based on date
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

-- 2. Create a trigger to run the validation function before insert/update
DROP TRIGGER IF EXISTS validate_event_status_trigger ON events;

CREATE TRIGGER validate_event_status_trigger
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION validate_event_status();

-- 3. Create a function to automatically update event statuses daily
CREATE OR REPLACE FUNCTION auto_update_event_status()
RETURNS void AS $$
BEGIN
    -- Update events with dates in the past to 'Completed' unless they're 'Cancelled'
    UPDATE events
    SET status = 'Completed', updated_at = NOW()
    WHERE event_date < NOW() 
    AND status = 'Upcoming';
    
    RAISE NOTICE 'Updated % events from Upcoming to Completed', FOUND;
END;
$$ LANGUAGE plpgsql;

-- 4. Create or replace a function to schedule the status update job
CREATE OR REPLACE FUNCTION schedule_event_status_updates()
RETURNS void AS $$
BEGIN
    -- Extension must be installed by superuser
    -- This must be run by someone with appropriate permissions
    PERFORM cron.schedule(
        'auto-update-event-status', -- job name
        '0 0 * * *',  -- run at midnight every day (cron expression)
        $$SELECT auto_update_event_status()$$ -- SQL to execute
    );
    RAISE NOTICE 'Scheduled daily event status update job';
EXCEPTION
    WHEN undefined_function THEN
        RAISE NOTICE 'cron extension not available. You will need to set up an external scheduler to run auto_update_event_status() daily.';
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to schedule cron job. You will need to set up an external scheduler to run auto_update_event_status() daily.';
    WHEN others THEN
        RAISE NOTICE 'Error scheduling cron job: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 5. Run the auto-update function once to fix existing events
SELECT auto_update_event_status();

-- 6. Try to schedule automated updates if possible
SELECT schedule_event_status_updates();

-- 7. Explain in the output
DO $$
BEGIN
    RAISE NOTICE E'\nEvent status management configured with the following rules:';
    RAISE NOTICE '1. Events with past dates cannot be set to "Upcoming"';
    RAISE NOTICE '2. Events with past dates are automatically set to "Completed" unless manually set to "Cancelled"';
    RAISE NOTICE '3. A daily job will update the statuses of events that have passed';
    RAISE NOTICE E'\nTo run the status update manually, execute: SELECT auto_update_event_status();';
END $$; 