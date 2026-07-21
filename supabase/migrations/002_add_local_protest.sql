-- Add local_protest to the attendance check constraint

ALTER TABLE submissions DROP CONSTRAINT submissions_attendance_check;

ALTER TABLE submissions ADD CONSTRAINT submissions_attendance_check 
  CHECK (attendance IN ('already_attended', 'planning_to_attend', 'supporting_online', 'local_protest'));

-- Drop the old views
DROP VIEW IF EXISTS state_aggregates;
DROP VIEW IF EXISTS city_aggregates;

-- Recreate city_aggregates view with local_protest_count
CREATE OR REPLACE VIEW city_aggregates AS
SELECT 
  city,
  state,
  country,
  ROUND(AVG(latitude)::numeric, 4) as latitude,
  ROUND(AVG(longitude)::numeric, 4) as longitude,
  COUNT(*) as total_voices,
  COUNT(*) FILTER (WHERE participation_status = 'supporting') as supporting_count,
  COUNT(*) FILTER (WHERE participation_status = 'participating') as participating_count,
  COUNT(*) FILTER (WHERE participation_status = 'undecided') as undecided_count,
  COUNT(*) FILTER (WHERE attendance = 'already_attended') as already_attended_count,
  COUNT(*) FILTER (WHERE attendance = 'planning_to_attend') as planning_count,
  COUNT(*) FILTER (WHERE attendance = 'supporting_online') as online_count,
  COUNT(*) FILTER (WHERE attendance = 'local_protest') as local_protest_count
FROM submissions
WHERE status = 'approved'
GROUP BY city, state, country;

-- Recreate state_aggregates
CREATE OR REPLACE VIEW state_aggregates AS
SELECT 
  state,
  country,
  COUNT(*) as total_voices,
  COUNT(*) FILTER (WHERE participation_status = 'supporting') as supporting_count,
  COUNT(*) FILTER (WHERE participation_status = 'participating') as participating_count,
  COUNT(*) FILTER (WHERE participation_status = 'undecided') as undecided_count
FROM submissions
WHERE status = 'approved'
GROUP BY state, country
ORDER BY total_voices DESC;
