-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to update their blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete their blog posts" ON blog_posts;

-- Drop the existing table if it exists
DROP TABLE IF EXISTS blog_posts;

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    heading TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create function and trigger for automatic updated_at timestamp
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

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role can manage blog posts" ON blog_posts;

-- Create policies
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