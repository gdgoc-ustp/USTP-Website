-- url shortener table
-- stores shortened urls and their destinations

-- drop existing if needed (be careful in production)
DROP TABLE IF EXISTS short_urls;

-- create the short_urls table
CREATE TABLE IF NOT EXISTS short_urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    title VARCHAR(255),
    clicks INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT short_code_format CHECK (short_code ~ '^[a-zA-Z0-9_-]+$')
);

-- create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_active ON short_urls(is_active);

-- enable row level security
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- anyone can read active urls (needed for redirect)
CREATE POLICY "Anyone can view active short urls" ON short_urls
    FOR SELECT USING (is_active = true);

-- authenticated admins can manage all urls
CREATE POLICY "Admins can manage all short urls" ON short_urls
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
        )
    );

-- function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count(url_code VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE short_urls 
    SET clicks = clicks + 1, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE short_code = url_code AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
