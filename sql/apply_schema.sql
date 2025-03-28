-- Master SQL file to apply the entire schema
-- Run this file to set up/fix the database schema

-- First, apply the updated users table schema
\i users.sql

-- Next, apply the blog_posts schema
\i blog_posts.sql

-- Apply fixes for blog_posts table if needed
\i fix_blog_posts_table.sql

-- Finally, apply any storage policies
\i storage_policy.sql

-- Display confirmation
SELECT 'Database schema successfully updated.' AS message; 