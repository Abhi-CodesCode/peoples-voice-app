-- ============================================================
-- People's Voices — Seed Data for Local Development
-- Run this in your Supabase SQL Editor
-- ============================================================

INSERT INTO submissions (
  city, district, state, country, latitude, longitude, 
  participation_status, attendance, support_reason, 
  desired_outcome, age_group, occupation, status
) VALUES 
  ('Delhi', 'New Delhi', 'Delhi', 'India', 28.7041, 77.1025, 'supporting', 'planning_to_attend', 'We want absolute transparency and accountability in local decision-making.', 'An independent audit and community review board.', '25-34', 'Software Engineer', 'approved'),
  ('Delhi', 'Central Delhi', 'Delhi', 'India', 28.7041, 77.1025, 'participating', 'already_attended', 'Our voices deserve answers, not avoidance. Peaceful assembly is our right.', 'A formal public dialogue with movement organizers.', '18-24', 'College Student', 'approved'),
  ('Lucknow', 'Lucknow', 'Uttar Pradesh', 'India', 26.8467, 80.9462, 'supporting', 'supporting_online', 'Supporting online from UP. We need to raise awareness on civic reforms.', 'Policy reforms and revisions to standard protocols.', '35-44', 'High School Teacher', 'approved'),
  ('Kanpur', 'Kanpur Nagar', 'Uttar Pradesh', 'India', 26.4499, 80.3319, 'participating', 'already_attended', 'Attended the local assembly. The community stands united for public rights.', 'An official written memorandum response from the council.', '45-54', 'Retailer', 'approved'),
  ('Mumbai', 'Mumbai City', 'Maharashtra', 'India', 19.0760, 72.8777, 'supporting', 'planning_to_attend', 'Democracy functions best when public concerns are addressed.', 'Constructive and open discussion with all stakeholders.', '25-34', 'Designer', 'approved'),
  ('Mumbai', 'Mumbai Suburban', 'Maharashtra', 'India', 19.0760, 72.8777, 'undecided', 'supporting_online', 'Evaluating the core arguments. Clearer transparency is definitely needed.', 'Clear publication of all guidelines and audits.', '18-24', 'Freelancer', 'approved'),
  ('Bangalore', 'Bangalore Urban', 'Karnataka', 'India', 12.9716, 77.5946, 'supporting', 'planning_to_attend', 'Hoping to attend the upcoming meet in Bangalore. Stand for community values.', 'A decentralized approach to solving local issues.', '25-34', 'Consultant', 'approved'),
  ('Chennai', 'Chennai', 'Tamil Nadu', 'India', 13.0827, 80.2707, 'supporting', 'supporting_online', 'Civic systems must be updated to serve modern citizens.', 'Implementation of online feedback mechanisms.', '35-44', 'Researcher', 'approved'),
  ('Kolkata', 'Kolkata', 'West Bengal', 'India', 22.5726, 88.3639, 'participating', 'already_attended', 'Raising voice for student representations. Every citizen counts.', 'Reforms in the youth representation policies.', '18-24', 'Student Leader', 'approved'),
  ('Pune', 'Pune', 'Maharashtra', 'India', 18.5204, 73.8567, 'supporting', 'planning_to_attend', 'Solidarity with the Lucknow assembly. Accountability is essential.', 'Fair distribution of development projects.', '25-34', 'Mechanical Engineer', 'approved'),
  ('Patna', 'Patna', 'Bihar', 'India', 25.6093, 85.1376, 'participating', 'already_attended', 'We held a peaceful rally in Patna. The support is overwhelming.', 'Answers to our written questionnaire.', '18-24', 'Student', 'approved'),
  ('Ahmedabad', 'Ahmedabad', 'Gujarat', 'India', 23.0225, 72.5714, 'supporting', 'supporting_online', 'I support the cause and advocate for open governance.', 'Establishment of public advisory committees.', '35-44', 'Accountant', 'approved'),
  ('Guwahati', 'Kamrup Metropolitan', 'Assam', 'India', 26.1445, 91.7362, 'supporting', 'planning_to_attend', 'Citizens from the North-East support these transparency reforms.', 'A nationwide unified transparency code.', '25-34', 'Journalist', 'approved'),
  ('Bhopal', 'Bhopal', 'Madhya Pradesh', 'India', 23.2599, 77.4126, 'supporting', 'supporting_online', 'Hoping for a positive resolution that respects citizen rights.', 'Mutual agreement between organizers and officials.', '45-54', 'Govt Employee', 'approved'),
  ('Jaipur', 'Jaipur', 'Rajasthan', 'India', 26.9124, 75.7873, 'supporting', 'planning_to_attend', 'Supportive of peaceful movements that aim to improve public systems.', 'Introduction of regular audits.', '35-44', 'Doctor', 'approved'),
  ('Chandigarh', 'Chandigarh', 'Chandigarh', 'India', 30.7333, 76.7794, 'supporting', 'planning_to_attend', 'Let our collective voice make a difference.', 'Timely completion of civic audits.', '18-24', 'Graduate Student', 'approved'),
  
  -- Add a few pending/abusive examples to test moderation
  ('Lucknow', 'Lucknow', 'Uttar Pradesh', 'India', 26.8467, 80.9462, 'supporting', 'planning_to_attend', 'This is a terrible system and everyone is bad!', 'Completely fire everyone now.', '25-34', 'Unemployed', 'pending'),
  ('Delhi', 'Central Delhi', 'Delhi', 'India', 28.7041, 77.1025, 'participating', 'already_attended', 'I support the movement but the organizers are idiots.', 'Nothing, just wanted to rant.', '18-24', 'Student', 'pending'),
  ('Mumbai', 'Mumbai City', 'Maharashtra', 'India', 19.0760, 72.8777, 'supporting', 'supporting_online', 'Spam spam spam voice verification testing text.', 'None.', '55-64', 'Retired', 'hidden')
;
