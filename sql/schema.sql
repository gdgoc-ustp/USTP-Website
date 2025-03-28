-- Drop existing policies
DROP POLICY IF EXISTS "Allow first system admin creation" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users with proper permissions can manage events" ON events;
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;

-- Drop existing tables (in correct order due to dependencies)
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Drop existing types
DROP TYPE IF EXISTS user_permission;
DROP TYPE IF EXISTS event_status;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_permission AS ENUM ('SYSTEM', 'ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE event_status AS ENUM ('Upcoming', 'Completed', 'Cancelled');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    position VARCHAR(255),
    permission user_permission NOT NULL DEFAULT 'VIEWER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    status event_status NOT NULL DEFAULT 'Upcoming',
    event_date TIMESTAMPTZ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow first system admin creation" ON users
    FOR INSERT WITH CHECK (
        NOT EXISTS (SELECT 1 FROM users) -- Allow insert if table is empty
        OR (auth.uid() IS NOT NULL AND permission = 'SYSTEM') -- Or if authenticated as system admin
    );

CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for events table
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users with proper permissions can manage events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
        )
    );

-- Create policies for blog posts table
CREATE POLICY "Anyone can view blog posts" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Authors can manage their own posts" ON blog_posts
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN')
        )
    ); 