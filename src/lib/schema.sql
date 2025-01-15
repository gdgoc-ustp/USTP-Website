-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role can manage blog posts" ON blog_posts;

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

