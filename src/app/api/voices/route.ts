import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const filter = searchParams.get('filter') || 'all'; // all, supporting, participating, undecided
    const search = searchParams.get('search') || '';

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch {
      // Mock data when Supabase credentials are not yet set
      const mockVoices = [
        { id: '1', city: 'Lucknow', state: 'Uttar Pradesh', participation_status: 'supporting', support_reason: 'We want transparency and accountability in governance.', desired_outcome: 'An independent oversight board.', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', city: 'Delhi', state: 'Delhi', participation_status: 'participating', support_reason: 'I simply want answers to our basic questions.', desired_outcome: 'Direct dialog with the organizers.', created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: '3', city: 'Kanpur', state: 'Uttar Pradesh', participation_status: 'supporting', support_reason: 'Our concerns deserve attention and action, not deflection.', desired_outcome: 'Formal response to the memorandum.', created_at: new Date(Date.now() - 10800000).toISOString() },
        { id: '4', city: 'Mumbai', state: 'Maharashtra', participation_status: 'supporting', support_reason: 'Peaceful protest is the bedrock of democracy.', desired_outcome: 'Protection of civil liberties.', created_at: new Date(Date.now() - 14400000).toISOString() },
        { id: '5', city: 'Bangalore', state: 'Karnataka', participation_status: 'participating', support_reason: 'To show solidarity with the movement and raise awareness.', desired_outcome: 'Policy reforms and revisions.', created_at: new Date(Date.now() - 18000000).toISOString() },
        { id: '6', city: 'Chennai', state: 'Tamil Nadu', participation_status: 'undecided', support_reason: 'I am here to understand the core arguments.', desired_outcome: 'A fair public discussion without bias.', created_at: new Date(Date.now() - 21600000).toISOString() },
        { id: '7', city: 'Pune', state: 'Maharashtra', participation_status: 'supporting', support_reason: 'As a student, I feel our voice is not being heard.', desired_outcome: 'Inclusive decision making.', created_at: new Date(Date.now() - 25200000).toISOString() },
        { id: '8', city: 'Kolkata', state: 'West Bengal', participation_status: 'participating', support_reason: 'I am actively coordinating local awareness meets.', desired_outcome: 'A decentralized resolution framework.', created_at: new Date(Date.now() - 28800000).toISOString() },
        { id: '9', city: 'Ahmedabad', state: 'Gujarat', participation_status: 'supporting', support_reason: 'Supporting online to raise awareness and amplify reach.', desired_outcome: 'Constructive action.', created_at: new Date(Date.now() - 32400000).toISOString() },
        { id: '10', city: 'Jaipur', state: 'Rajasthan', participation_status: 'supporting', support_reason: 'Hoping for a positive resolution that benefits all.', desired_outcome: 'Amicable consensus.', created_at: new Date(Date.now() - 36000000).toISOString() }
      ];

      // Filter and search mock data
      let filtered = [...mockVoices];
      if (filter !== 'all') {
        filtered = filtered.filter(v => v.participation_status === filter);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(v => 
          v.city.toLowerCase().includes(query) || 
          v.state.toLowerCase().includes(query) ||
          (v.support_reason && v.support_reason.toLowerCase().includes(query))
        );
      }

      return NextResponse.json({
        voices: filtered.slice(from, from + limit),
        total: filtered.length,
        page,
        limit
      });
    }

    // Query from public_voices view in Supabase
    let queryBuilder = supabase
      .from('public_voices')
      .select('*', { count: 'exact' });

    if (filter !== 'all') {
      queryBuilder = queryBuilder.eq('participation_status', filter);
    }

    if (search) {
      queryBuilder = queryBuilder.or(`city.ilike.%${search}%,state.ilike.%${search}%,support_reason.ilike.%${search}%,desired_outcome.ilike.%${search}%`);
    }

    const { data, count, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('DB query error:', error);
      return NextResponse.json({ error: 'Failed to query submissions' }, { status: 500 });
    }

    return NextResponse.json({
      voices: data || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('Voices API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
