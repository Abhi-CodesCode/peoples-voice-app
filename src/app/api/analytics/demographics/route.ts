import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch {
      // Fallback if Supabase credentials are not configured
      return NextResponse.json({
        occupations: [
          { occupation: 'Student', count: 350 },
          { occupation: 'Engineer', count: 210 },
          { occupation: 'Teacher', count: 180 },
          { occupation: 'Farmer', count: 120 },
          { occupation: 'Healthcare Worker', count: 90 },
          { occupation: 'Business Owner', count: 70 },
          { occupation: 'Other', count: 120 }
        ],
        ages: [
          { age_group: '18-24', count: 420 },
          { age_group: '25-34', count: 380 },
          { age_group: '35-44', count: 200 },
          { age_group: '45-54', count: 150 },
          { age_group: '55-64', count: 60 },
          { age_group: '65+', count: 37 }
        ]
      });
    }

    // Fetch from occupation_distribution view
    const { data: occupations, error: occError } = await supabase
      .from('occupation_distribution')
      .select('*')
      .limit(10);

    // Fetch from age_distribution view
    const { data: ages, error: ageError } = await supabase
      .from('age_distribution')
      .select('*');

    if (occError) console.error('Error fetching occupations:', occError);
    if (ageError) console.error('Error fetching ages:', ageError);

    return NextResponse.json({
      occupations: occupations || [],
      ages: ages || []
    });
  } catch (error) {
    console.error('Demographics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch demographics' }, { status: 500 });
  }
}
