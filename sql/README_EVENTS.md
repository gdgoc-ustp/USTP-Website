# Events Table Schema Fix

## Issue
The application encounters a 400 error when creating or updating events with the following message:
```
{
    "code": "PGRST204",
    "details": null,
    "hint": null,
    "message": "Could not find the 'event_date' column of 'events' in the schema cache"
}
```

This error occurs when the Supabase PostgREST schema cache does not recognize the `event_date` column in the `events` table, even though it's needed for the application to function correctly.

## How to Fix

1. Execute the `fix_events.sql` script in the Supabase SQL Editor to:
   - Add the `event_date` column if it doesn't exist
   - Add the `updated_at` column if it doesn't exist
   - Refresh the PostgREST schema cache
   - Add a trigger to automatically update `updated_at` on row updates
   - Add validation for event status based on dates
   - Recreate the RLS policies for the table

## Alternative Solutions

If the above solution doesn't work, try these alternatives:

1. **Drop and recreate the table**: Run the `events.sql` file, which includes all the necessary columns and triggers.

2. **Manually refresh the schema cache**:
   ```sql
   SELECT pg_notify('pgrst', 'reload schema cache');
   ```

3. **Restart the PostgREST service** through the Supabase dashboard.

## Schema Information

The `events` table should have the following columns:
- `id` (UUID, Primary Key)
- `heading` (VARCHAR, Not Null)
- `tagline` (TEXT)
- `description` (TEXT, Not Null)
- `image_url` (TEXT)
- `status` (event_status ENUM: 'Upcoming', 'Completed', 'Cancelled')
- `event_date` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, Default: NOW())
- `updated_at` (TIMESTAMPTZ, Default: NOW())

## Event Status Management

The events table includes smart status management with the following features:

1. **Status Validation**: 
   - An event cannot be marked as "Upcoming" if its date is in the past
   - If an event's date is in the past, its status is automatically set to "Completed" (unless manually set to "Cancelled")

2. **Automatic Status Updates**:
   - A trigger validates and updates event status on insert and update operations
   - The `event_status_management.sql` script sets up a daily job to automatically update statuses

3. **Manual Status Updates**:
   - You can run a manual update of all event statuses by executing:
     ```sql
     SELECT auto_update_event_status();
     ```

4. **Status Rules**:
   - Past events: Can be either "Completed" or "Cancelled" (not "Upcoming")
   - Future events: Can be "Upcoming" or "Cancelled"
   - Only "Cancelled" status overrides the date-based automatic status determination

## Verification

After applying the fix, you can verify that the schema cache is updated by:
1. Creating a new event through the UI
2. Making an API request to `/rest/v1/events`

If the operation completes successfully, the issue has been resolved. 