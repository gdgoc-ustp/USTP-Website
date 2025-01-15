-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read blog posts" ON blog_posts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to create blog posts" ON blog_posts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their blog posts" ON blog_posts
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete their blog posts" ON blog_posts
    FOR DELETE TO authenticated USING (true);