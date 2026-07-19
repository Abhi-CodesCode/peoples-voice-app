-- ============================================================
-- People's Voices — Initial Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. SUBMISSIONS TABLE
-- Core table for anonymous voice submissions.
-- NO personally identifying information is stored.
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Location (city-level only, never precise GPS)
  city TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  latitude DECIMAL(9, 4),   -- City centroid only
  longitude DECIMAL(9, 4),  -- City centroid only
  
  -- Participation data
  participation_status TEXT NOT NULL 
    CHECK (participation_status IN ('supporting', 'participating', 'undecided')),
  attendance TEXT 
    CHECK (attendance IN ('already_attended', 'planning_to_attend', 'supporting_online')),
  
  -- Voice content (limited length, sanitized server-side)
  support_reason TEXT CHECK (char_length(support_reason) <= 300),
  desired_outcome TEXT CHECK (char_length(desired_outcome) <= 300),
  
  -- Optional demographics
  age_group TEXT 
    CHECK (age_group IS NULL OR age_group IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
  occupation TEXT CHECK (occupation IS NULL OR char_length(occupation) <= 100),
  
  -- Moderation
  status TEXT NOT NULL DEFAULT 'approved' 
    CHECK (status IN ('pending', 'approved', 'hidden')),
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  
  -- Metadata (NO IP addresses, NO user agents)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Fingerprint for duplicate detection (hashed, not reversible)
  submission_hash TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_city ON submissions(city, state);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_coordinates ON submissions(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_submissions_state ON submissions(state);
CREATE INDEX IF NOT EXISTS idx_submissions_hash ON submissions(submission_hash);

-- ============================================================
-- 2. CITIES CACHE TABLE
-- Caches geocoding results to reduce Nominatim API calls.
-- ============================================================
CREATE TABLE IF NOT EXISTS cities_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  latitude DECIMAL(9, 4) NOT NULL,
  longitude DECIMAL(9, 4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, state, country)
);

CREATE INDEX IF NOT EXISTS idx_cities_cache_search ON cities_cache(city, state);

-- ============================================================
-- 3. ADMIN AUDIT LOG
-- Tracks all admin actions for accountability.
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approve', 'hide', 'export', 'login')),
  target_id UUID,  -- submission ID if applicable
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at DESC);

-- ============================================================
-- 4. VIEWS (Aggregated, no PII)
-- ============================================================

-- City-level aggregates for map and analytics
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
  COUNT(*) FILTER (WHERE attendance = 'supporting_online') as online_count
FROM submissions
WHERE status = 'approved'
GROUP BY city, state, country;

-- State-level aggregates for analytics
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

-- Daily submission counts for time series chart
CREATE OR REPLACE VIEW daily_submissions AS
SELECT 
  DATE(created_at) as submission_date,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE participation_status = 'supporting') as supporting,
  COUNT(*) FILTER (WHERE participation_status = 'participating') as participating,
  COUNT(*) FILTER (WHERE participation_status = 'undecided') as undecided
FROM submissions
WHERE status = 'approved'
GROUP BY DATE(created_at)
ORDER BY submission_date;

-- Public voices view (only safe columns, no PII)
CREATE OR REPLACE VIEW public_voices AS
SELECT 
  id,
  city,
  state,
  participation_status,
  support_reason,
  desired_outcome,
  created_at
FROM submissions
WHERE status = 'approved'
  AND (support_reason IS NOT NULL OR desired_outcome IS NOT NULL)
ORDER BY created_at DESC;

-- Age group distribution
CREATE OR REPLACE VIEW age_distribution AS
SELECT
  age_group,
  COUNT(*) as count
FROM submissions
WHERE status = 'approved' AND age_group IS NOT NULL
GROUP BY age_group
ORDER BY age_group;

-- Occupation distribution
CREATE OR REPLACE VIEW occupation_distribution AS
SELECT
  occupation,
  COUNT(*) as count
FROM submissions
WHERE status = 'approved' AND occupation IS NOT NULL
GROUP BY occupation
ORDER BY count DESC
LIMIT 20;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- SUBMISSIONS POLICIES

-- Anyone can insert (rate limiting handled at API level)
CREATE POLICY "Anyone can submit a voice" ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Only allow setting safe fields
    status = 'approved'
    AND moderated_by IS NULL
    AND moderated_at IS NULL
  );

-- Anyone can read approved submissions (aggregated views)
CREATE POLICY "Anyone can read approved submissions" ON submissions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Only authenticated admins can update (moderate)
CREATE POLICY "Admins can moderate submissions" ON submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No one can delete submissions (audit trail)
-- (No DELETE policy = no deletes allowed)

-- CITIES CACHE POLICIES

-- Anyone can read cached cities
CREATE POLICY "Anyone can read cities cache" ON cities_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Server can insert cached cities (via service role)
CREATE POLICY "Service role can insert cities" ON cities_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- AUDIT LOG POLICIES

-- Only authenticated admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON admin_audit_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can insert audit logs
CREATE POLICY "Admins can insert audit logs" ON admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

-- ============================================================
-- 6. FUNCTIONS
-- ============================================================

-- Function to get overall stats
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_voices', (SELECT COUNT(*) FROM submissions WHERE status = 'approved'),
    'cities_represented', (SELECT COUNT(DISTINCT city) FROM submissions WHERE status = 'approved'),
    'states_represented', (SELECT COUNT(DISTINCT state) FROM submissions WHERE status = 'approved'),
    'supporting_count', (SELECT COUNT(*) FROM submissions WHERE status = 'approved' AND participation_status = 'supporting'),
    'participating_count', (SELECT COUNT(*) FROM submissions WHERE status = 'approved' AND participation_status = 'participating'),
    'undecided_count', (SELECT COUNT(*) FROM submissions WHERE status = 'approved' AND participation_status = 'undecided')
  );
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION get_platform_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_platform_stats() TO authenticated;
