-- site_settings table
-- simple key-value store for site-wide configuration

-- drop existing if needed (careful in production)
DROP TABLE IF EXISTS site_settings;

-- create the site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- enable row level security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- anyone can read settings (needed for frontend to check registration status)
CREATE POLICY "Anyone can read settings" ON site_settings
    FOR SELECT USING (true);

-- only admins can modify settings
CREATE POLICY "Admins can modify settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN')
        )
    );

-- insert default settings
INSERT INTO site_settings (key, value) VALUES 
    ('registration_open', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
