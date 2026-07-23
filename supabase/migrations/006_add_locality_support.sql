-- Add locality column to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS locality TEXT;

-- Create location_aggregates for map rendering (locality + city precision)
CREATE OR REPLACE VIEW location_aggregates AS
SELECT 
  locality,
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
GROUP BY locality, city, state, country;

-- Update city_aggregates view to strictly aggregate at the city level
CREATE OR REPLACE VIEW city_aggregates AS
SELECT 
  city,
  state,
  country,
  -- For city center, we average all latitudes and longitudes in that city
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
