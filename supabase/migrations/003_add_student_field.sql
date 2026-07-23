-- ============================================================
-- Add student_field to submissions table
-- ============================================================

-- Add the optional student_field column to store the field of study
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS student_field TEXT CHECK (char_length(student_field) <= 100);

-- Update the public_voices view to include student_field
DROP VIEW IF EXISTS public_voices;
CREATE OR REPLACE VIEW public_voices AS
SELECT 
  id,
  city,
  state,
  participation_status,
  support_reason,
  desired_outcome,
  student_field,
  created_at
FROM submissions
WHERE status = 'approved'
  AND (support_reason IS NOT NULL OR desired_outcome IS NOT NULL)
ORDER BY created_at DESC;
