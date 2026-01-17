-- Make author_id column nullable in blog_posts table
-- This script addresses the "null value in column 'author_id' of relation 'blog_posts' violates not-null constraint" error

-- Alter the table to make author_id nullable
ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;

-- Notify clients about the schema change
SELECT pg_notify('pgrst', 'reload schema cache');

-- Output the updated schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'author_id';

-- Update any existing rows with NULL author_id that are causing issues
-- For example, you can set a default author ID for existing rows if needed
/*
UPDATE blog_posts
SET author_id = 'your-default-author-id-uuid'
WHERE author_id IS NULL;
*/

-- Refresh the RLS policies if needed
DO $$
BEGIN
    -- Drop existing create blog posts policy
    DROP POLICY IF EXISTS "Allow authenticated users to create blog posts" ON blog_posts;
    
    -- Create updated policy that allows null author_id for service role
    CREATE POLICY "Allow authenticated users to create blog posts" ON blog_posts
        FOR INSERT TO authenticated WITH CHECK (
            auth.uid() = author_id 
            OR 
            (author_id IS NULL AND auth.role() = 'service_role'::text)
        );
        
    RAISE NOTICE 'Successfully updated RLS policy for blog_posts table';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating policy: %', SQLERRM;
END
$$;

-- Now the blog_posts table will accept NULL values for author_id
-- This allows the admin interface to create posts without setting an author_id 