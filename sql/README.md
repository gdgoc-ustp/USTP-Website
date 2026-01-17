# Database Schema Setup

This directory contains SQL files needed to set up the database schema for the GDG Website.

## Instructions for Schema Setup/Fix

If you're encountering errors related to missing columns in the database tables (e.g., "Could not find the 'address' column of 'users' in the schema cache"), follow these steps:

### Option 1: Apply Schema via Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Upload and run these files in order:
   - `users.sql` - Sets up the users table with all required columns
   - `blog_posts.sql` - Sets up the blog posts table
   - `storage_policy.sql` - Sets up storage policies

Alternatively, you can upload and run the `apply_schema.sql` file, which will apply all the SQL files in the correct order.

### Option 2: Apply Schema via Command Line

If you have access to the PostgreSQL command line:

```bash
psql -h <your-supabase-db-host> -d postgres -U postgres -f apply_schema.sql
```

Replace `<your-supabase-db-host>` with your actual database host.

## Schema Files

- `users.sql`: Creates the users table with columns for id, email, name, position, address, permission, etc.
- `blog_posts.sql`: Creates the blog posts table with columns for posts, including updated_at
- `fix_blog_posts_table.sql`: Fixes issues with the blog_posts table if columns are missing from schema cache
- `storage_policy.sql`: Sets up storage policies
- `apply_schema.sql`: Master file that applies all the above files in the correct order
- `schema.sql`: Legacy schema definition (reference only)

## Common Issues

### Missing Columns

If you encounter errors like:
```
Failed to create account: Could not find the 'address' column of 'users' in the schema cache
```
or
```
Could not find the 'updated_at' column of 'blog_posts' in the schema cache
```

This means your database schema is out of sync with the application code or the Supabase schema cache needs refreshing. 

**To fix users table issues:**
Run the SQL setup file: `users.sql`

**To fix blog_posts table issues:**
Run the SQL setup file: `fix_blog_posts_table.sql` which will:
1. Check if the column exists and create it if missing
2. Set up a trigger to auto-update the timestamp
3. Force a schema cache refresh

### Row-Level Security (RLS) Policy Violations

If you encounter errors like:
```
Failed to create account: new row violates row-level security policy for table "users"
```

You have two options:

1. **Fix the RLS policies** by running the updated `users.sql` file which includes the corrected policy for first-time setup
2. **Use the Supabase service key** instead of the anon key for admin operations (see below)

### Using the Service Key for Admin Operations

An alternative to complex RLS policies is to use the Supabase service key for admin operations:

1. In your Supabase dashboard, go to Settings > API and find your service_role key
2. Add the key to your .env file as REACT_APP_SUPABASE_SERVICE_KEY
3. For admin operations, create a special client using this key:

```javascript
// Create a special admin client that bypasses RLS
const supabaseAdmin = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_KEY
);

// Use this client for admin operations
const { data, error } = await supabaseAdmin.from('users').insert([...]);
```

**IMPORTANT CONSIDERATIONS:**
- The service key has full access to your database, bypassing RLS
- It should NEVER be exposed to the client or browser
- For production applications, admin operations should be performed through secure server-side functions or API endpoints
- This approach is suitable for development or single-user admin applications

### Permission Issues

If you cannot run the SQL files due to permission issues, make sure you're using a Supabase account with admin privileges. 