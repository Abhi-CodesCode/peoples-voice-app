import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !['approved', 'hidden'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Update status in submissions table
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ 
        status,
        moderated_by: user.id,
        moderated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Moderation update error:', updateError);
      return NextResponse.json({ error: 'Failed to update submission status' }, { status: 500 });
    }

    // Log the admin action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_id: user.id,
        action: status === 'approved' ? 'approve' : 'hide',
        target_id: id,
        details: { moderated_at: new Date().toISOString() }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Moderation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
