-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_name TEXT NOT NULL,
    title TEXT NOT NULL,
    date_range TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Timeline events are publicly readable"
ON timeline_events FOR SELECT
TO public
USING (true);

-- Allow authenticated admins to modify (insert, update, delete)
CREATE POLICY "Authenticated users can insert timeline events"
ON timeline_events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update timeline events"
ON timeline_events FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete timeline events"
ON timeline_events FOR DELETE
TO authenticated
USING (true);

-- Seed initial data
INSERT INTO timeline_events (stage_name, title, date_range, description, color, order_index) VALUES
('Stage 1', 'The Digital Spark & Movement Genesis', 'May – Early June 2026', 'Triggered by controversial institutional remarks comparing unemployed youth to "parasites and cockroaches," digital strategist Abhijeet Dipke founds the satirical Cockroach Janta Party (CJP). What starts as an online reaction virally mobilizes millions of Gen-Z and millennial students over systemic exam leaks (NEET-UG, CBSE), culminating in the movement''s first major physical sit-in at Jantar Mantar on June 6, 2026.', '#F97316', 1),
('Stage 2', 'Moral Escalation & The Hunger Strike', 'Late June – Mid July 2026', 'The protest gains deep national moral weight on June 28, 2026, when prominent environmentalist and education activist Sonam Wangchuk joins the Jantar Mantar camp, launching an indefinite hunger strike. His fast galvanizes widespread public support and solidarity from across the country, turning the site into a symbol of non-violent resistance.', '#F97316', 2),
('Stage 3', 'The State Crackdown', 'July 24, 2026', 'The movement faces its darkest hour when Delhi Police forcefully evict Sonam Wangchuk and hundreds of peaceful student protesters from Jantar Mantar during a sudden midnight raid. Students are detained, and Wangchuk is moved to an undisclosed location, sparking nationwide outrage and condemnation of the state''s heavy-handed tactics.', '#EF4444', 3),
('Stage 4', 'Nationwide Resurrection & "Black Day"', 'July 25 – July 26, 2026', 'In direct response to the police crackdown, student unions, activists, and citizens across India declare July 25 as a "Black Day" for democracy. Spontaneous solidarity protests erupt in major cities, university campuses go on strike, and international media begins heavily covering the government''s suppression of the youth-led anti-corruption movement.', '#EF4444', 4),
('Stage 5', 'The Institutional Fallout & Strategic Pivot', 'Late July 2026 – Present', 'As public pressure mounts and the Supreme Court agrees to hear petitions regarding the exam leaks and police brutality, the movement transitions from street protests to a sustained legal and political campaign. The CJP evolves from a satirical hashtag into a formal pressure group demanding sweeping educational reforms and institutional accountability.', '#22C55E', 5);
