# Blog Posts Table Schema Fix

## Issue
The application encounters a 400 error when creating or updating blog posts with the following message:
```
{
    "code": "PGRST204",
    "details": null,
    "hint": null,
    "message": "Could not find the 'updated_at' column of 'blog_posts' in the schema cache"
}
```

This error occurs when the Supabase PostgREST schema cache does not recognize the `updated_at` column in the `blog_posts` table, even though the column exists in the database.

## How to Fix

1. Execute the `fix_blog_posts.sql` script in the Supabase SQL Editor to:
   - Check if the `updated_at` column exists, and add it if not
   - Refresh the PostgREST schema cache
   - Add a trigger to automatically update `updated_at` on row updates
   - Recreate the RLS policies for the table

## Alternative Solutions

If the above solution doesn't work, try these alternatives:

1. **Drop and recreate the table**: Run the original `blog_posts.sql` file, which now includes the trigger for `updated_at`.

2. **Manually refresh the schema cache**:
   ```sql
   SELECT pg_notify('pgrst', 'reload schema cache');
   ```

3. **Restart the PostgREST service** through the Supabase dashboard.

## Prevention

To prevent similar issues in the future:
- Always include trigger functions for timestamp columns like `updated_at`
- After creating or modifying tables, refresh the schema cache

## Verification

After applying the fix, you can verify that the schema cache is updated by:
1. Creating a new blog post through the UI
2. Making an API request to `/rest/v1/blog_posts`

If the operation completes successfully, the issue has been resolved. 