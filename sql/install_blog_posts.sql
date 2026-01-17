-- INSTALLATION SCRIPT FOR BLOG POSTS SCHEMA
-- This script sets up the blog_posts table with all required configurations
-- including the fix for nullable author_id

-- ======= CLEANUP EXISTING OBJECTS =======
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to update their blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete their blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role can manage blog posts" ON blog_posts;

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_updated_at ON blog_posts;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_modified_column();

-- Drop the existing table if it exists
DROP TABLE IF EXISTS blog_posts;

-- ======= CREATE SCHEMA OBJECTS =======
-- Create blog_posts table with nullable author_id
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    heading TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for service role operations
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======= SET UP ROW LEVEL SECURITY =======
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- ======= CREATE UTILITY FUNCTIONS =======
-- Create function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set up trigger for automatic updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ======= CREATE RLS POLICIES =======
-- Allow authenticated users to read blog posts
CREATE POLICY "Allow authenticated users to read blog posts" ON blog_posts
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to create blog posts (user ID must match author_id)
-- Or service role can create posts with null author_id
CREATE POLICY "Allow authenticated users to create blog posts" ON blog_posts
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = author_id 
        OR 
        (author_id IS NULL AND auth.role() = 'service_role'::text)
    );

-- Allow authenticated users to update their blog posts
CREATE POLICY "Allow authenticated users to update their blog posts" ON blog_posts
    FOR UPDATE TO authenticated USING (
        auth.uid() = author_id
        OR
        (author_id IS NULL AND auth.role() = 'service_role'::text)
    );

-- Allow authenticated users to delete their blog posts
CREATE POLICY "Allow authenticated users to delete their blog posts" ON blog_posts
    FOR DELETE TO authenticated USING (
        auth.uid() = author_id
        OR
        (author_id IS NULL AND auth.role() = 'service_role'::text)
    );

-- Allow public read access to blog posts
CREATE POLICY "Public can view blog posts" 
ON blog_posts
FOR SELECT 
USING (true);

-- Allow service role to manage all blog posts
CREATE POLICY "Service role can manage blog posts" 
ON blog_posts
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- ======= VERIFICATION =======
-- Display schema information for confirmation
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts';

-- List all policies for the blog_posts table
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename = 'blog_posts';

-- ======= REFRESH SCHEMA CACHE =======
-- Notify clients about the schema change
SELECT pg_notify('pgrst', 'reload schema cache');

-- ======= COMPLETION MESSAGE =======
DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'BLOG POSTS INSTALLATION COMPLETE';
    RAISE NOTICE 'The blog_posts table has been created with the following features:';
    RAISE NOTICE '- Nullable author_id for service role operations';
    RAISE NOTICE '- Automatic updated_at timestamp via trigger';
    RAISE NOTICE '- Row level security policies for all operations';
    RAISE NOTICE '- Schema cache refreshed';
    RAISE NOTICE '=================================================';
END $$; 