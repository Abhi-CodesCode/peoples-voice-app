import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

const PREDEFINED_OPTIONS = [
  "To demand accountability for repeated exam paper leaks (NEET, etc.) and justice for affected students.",
  "Because students' futures and lives are being ruined by systemic failures in the education system.",
  "To support the call for Education Minister Dharmendra Pradhan's resignation and better governance.",
  "As a concerned citizen/parent/youth who wants transparent and fair examinations in India.",
  "Resignation of the Education Minister and strict action against those responsible for leaks.",
  "Complete cancellation/re-examination of compromised tests + compensation for affected students/families.",
  "Long-term reforms: stronger security for exams, independent oversight, and prevention of future leaks.",
  "Nationwide awareness and pressure for systemic change in recruitment and education policies."
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const q = searchParams.get('q');

    if (!field || (field !== 'support_reason' && field !== 'desired_outcome')) {
      return NextResponse.json({ error: 'Invalid field parameter' }, { status: 400 });
    }

    if (!q || q.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch {
      // Mock fallback if Supabase not configured
      return NextResponse.json({ suggestions: [
        `More accountability regarding ${q}...`,
        `Addressing ${q} immediately.`
      ] });
    }

    const { data, error } = await supabase
      .from('public_voices')
      .select(field)
      .ilike(field, `%${q}%`)
      .limit(50);

    if (error) {
      console.error('DB query error:', error);
      return NextResponse.json({ error: 'Failed to query suggestions' }, { status: 500 });
    }

    // Filter unique, not in predefined, and valid strings
    const uniqueSuggestions = new Set<string>();
    for (const row of data || []) {
      const val = (row as any)[field];
      if (val && typeof val === 'string' && val.trim().length > 0) {
        if (!PREDEFINED_OPTIONS.includes(val)) {
          uniqueSuggestions.add(val);
        }
      }
      if (uniqueSuggestions.size >= 5) break; // limit to 5
    }

    return NextResponse.json({ suggestions: Array.from(uniqueSuggestions) });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
