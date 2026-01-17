-- This script fixes the blog_posts table schema and refreshes the schema cache

-- First, check if the updated_at column exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'updated_at'
    ) INTO column_exists;

    -- If the column doesn't exist, add it
    IF NOT column_exists THEN
        EXECUTE 'ALTER TABLE blog_posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()';
        RAISE NOTICE 'Added updated_at column to blog_posts table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in blog_posts table';
    END IF;
END
$$;

-- Refresh the schema cache
SELECT pg_notify('pgrst', 'reload schema cache');

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts';

-- Add a trigger to automatically update the updated_at timestamp
DROP TRIGGER IF EXISTS set_updated_at ON blog_posts;

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- If needed, recreate the RLS policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Allow authenticated users to read blog posts" ON blog_posts;
    DROP POLICY IF EXISTS "Allow authenticated users to create blog posts" ON blog_posts;
    DROP POLICY IF EXISTS "Allow authenticated users to update their blog posts" ON blog_posts;
    DROP POLICY IF EXISTS "Allow authenticated users to delete their blog posts" ON blog_posts;
    DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
    DROP POLICY IF EXISTS "Service role can manage blog posts" ON blog_posts;

    -- Recreate policies
    CREATE POLICY "Allow authenticated users to read blog posts" ON blog_posts
        FOR SELECT TO authenticated USING (true);

    CREATE POLICY "Allow authenticated users to create blog posts" ON blog_posts
        FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

    CREATE POLICY "Allow authenticated users to update their blog posts" ON blog_posts
        FOR UPDATE TO authenticated USING (auth.uid() = author_id);

    CREATE POLICY "Allow authenticated users to delete their blog posts" ON blog_posts
        FOR DELETE TO authenticated USING (auth.uid() = author_id); 

    -- Allow public read access to blog posts
    CREATE POLICY "Public can view blog posts" 
    ON blog_posts
    FOR SELECT 
    USING (true);

    -- Allow service role to manage blog posts
    CREATE POLICY "Service role can manage blog posts" 
    ON blog_posts
    USING (auth.role() = 'service_role'::text)
    WITH CHECK (auth.role() = 'service_role'::text);

    RAISE NOTICE 'Successfully recreated RLS policies for blog_posts table';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error recreating policies: %', SQLERRM;
END
$$; 