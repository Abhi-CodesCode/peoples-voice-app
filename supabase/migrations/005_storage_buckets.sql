-- Create a public bucket for timeline images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('timeline_images', 'timeline_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to timeline_images
CREATE POLICY "Public Read Access for timeline_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'timeline_images');

-- Policy to allow authenticated admin write access
CREATE POLICY "Admin Write Access for timeline_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'timeline_images');

CREATE POLICY "Admin Update Access for timeline_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'timeline_images');

CREATE POLICY "Admin Delete Access for timeline_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'timeline_images');
