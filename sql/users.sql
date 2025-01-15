-- First, drop all policies
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON users;
DROP POLICY IF EXISTS "Allow system users to manage all users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update access for users based on id" ON users;
DROP POLICY IF EXISTS "Enable delete access for users based on id" ON users;

-- Drop policies on events table that depend on users
DROP POLICY IF EXISTS "Authenticated users with proper permissions can manage events" ON events;
DROP POLICY IF EXISTS "Anyone can view published events" ON events;

-- Drop policies on blog_posts table that depend on users
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;

-- Now we can safely drop and recreate the users table
DROP TABLE IF EXISTS users CASCADE;

-- Recreate the users table
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    name TEXT,
    permission TEXT DEFAULT 'VIEWER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Recreate the original policies for users
CREATE POLICY "Enable read access for all users"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access for users based on id"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Enable delete access for users based on id"
    ON users FOR DELETE
    USING (auth.uid() = id);

-- Recreate policies for events
CREATE POLICY "Anyone can view published events"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users with proper permissions can manage events"
    ON events FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM users
            WHERE permission IN ('EDITOR', 'ADMIN', 'SYSTEM')
        )
    );

-- Recreate policies for blog_posts
CREATE POLICY "Anyone can view blog posts"
    ON blog_posts FOR SELECT
    USING (true);

CREATE POLICY "Authors can manage their own posts"
    ON blog_posts FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM users
            WHERE permission IN ('EDITOR', 'ADMIN', 'SYSTEM')
        )
    );