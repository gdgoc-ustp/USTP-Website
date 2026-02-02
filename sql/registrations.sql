-- registrations table
-- stores member and core team registration submissions

-- drop existing if needed (careful in production)
DROP TABLE IF EXISTS registrations;

-- create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_type VARCHAR(20) NOT NULL CHECK (registration_type IN ('member', 'core_team')),
    
    -- common fields
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    year_level VARCHAR(20) NOT NULL,
    
    -- core team specific fields (nullable for members)
    primary_department VARCHAR(50),
    secondary_department VARCHAR(50),
    cv_link TEXT,
    github_link TEXT,
    about_yourself TEXT,
    
    -- metadata
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- validate core team has required fields
    CONSTRAINT core_team_requires_cv CHECK (
        registration_type != 'core_team' OR cv_link IS NOT NULL
    ),
    CONSTRAINT core_team_requires_departments CHECK (
        registration_type != 'core_team' OR (primary_department IS NOT NULL AND secondary_department IS NOT NULL)
    ),
    CONSTRAINT core_team_requires_about CHECK (
        registration_type != 'core_team' OR about_yourself IS NOT NULL
    )
);

-- create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(registration_type);
CREATE INDEX IF NOT EXISTS idx_registrations_created ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- enable row level security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- anyone can insert (public registration)
CREATE POLICY "Anyone can submit registration" ON registrations
    FOR INSERT WITH CHECK (true);

-- only admins can view registrations
CREATE POLICY "Admins can view registrations" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN', 'EDITOR')
        )
    );

-- admins can delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND permission IN ('SYSTEM', 'ADMIN')
        )
    );
