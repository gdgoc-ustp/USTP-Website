-- Drop the existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'images' AND 
    (LOWER(storage.extension(name)) = 'jpg' OR 
     LOWER(storage.extension(name)) = 'jpeg' OR 
     LOWER(storage.extension(name)) = 'png' OR 
     LOWER(storage.extension(name)) = 'gif' OR 
     LOWER(storage.extension(name)) = 'webp')
);

-- Create policy to allow public to view images
CREATE POLICY "Allow public to view images" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');