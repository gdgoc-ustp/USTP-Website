-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_permission AS ENUM ('SYSTEM', 'ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE event_status AS ENUM ('Upcoming', 'Completed', 'Cancelled');

-- Create users table
CREATE TABLE users (
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
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    status event_status NOT NULL DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blog posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "System users can manage all users" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission = 'SYSTEM'
        )
    );

-- Events policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users with proper permissions can manage events" ON events
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
        )
    );

-- Blog posts policies
CREATE POLICY "Anyone can view blog posts" ON blog_posts
    FOR SELECT
    USING (true);

CREATE POLICY "Authors can manage their own posts" ON blog_posts
    FOR ALL
    USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON blog_posts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN')
        )
    );

-- Create indexes for better performance
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX blog_posts_author_idx ON blog_posts(author_id);
CREATE INDEX events_created_at_idx ON events(created_at DESC);
CREATE INDEX blog_posts_created_at_idx ON blog_posts(created_at DESC); 