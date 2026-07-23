import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { validateSubmission, sanitizeText } from '@/lib/validation';
import { isProfane } from '@/lib/profanity';
import { checkRateLimit } from '@/lib/rate-limit';
import { SubmissionFormData } from '@/types/database';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${Math.round(rateLimit.resetIn / 60000)} minutes.` },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Form Data
    const body: SubmissionFormData = await request.json();
    const validation = validateSubmission(body);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    // 3. Sanitize Fields
    const city = sanitizeText(body.city);
    const state = sanitizeText(body.state);
    const district = body.district ? sanitizeText(body.district) : null;
    const country = body.country ? sanitizeText(body.country) : 'India';
    
    const support_reason = body.support_reason ? sanitizeText(body.support_reason) : null;
    const desired_outcome = body.desired_outcome ? sanitizeText(body.desired_outcome) : null;
    const occupation = body.occupation ? sanitizeText(body.occupation) : null;

    // 4. Profanity Filtering & Moderation Flagging
    let isSpamOrAbusive = false;
    if (support_reason && isProfane(support_reason)) isSpamOrAbusive = true;
    if (desired_outcome && isProfane(desired_outcome)) isSpamOrAbusive = true;
    if (occupation && isProfane(occupation)) isSpamOrAbusive = true;

    // Default status: if profane, set to pending moderation. Otherwise approved.
    const status = isSpamOrAbusive ? 'pending' : 'approved';

    // 5. Generate Submission Hash for Duplicate Detection (1 hour window)
    const hourTimestamp = Math.floor(Date.now() / (1000 * 60 * 60));
    const normalizedMessage = ((support_reason || '') + (desired_outcome || '')).toLowerCase().replace(/\s+/g, '');
    const submission_hash = `${city}_${state}_${body.participation_status}_${hourTimestamp}_${normalizedMessage.substring(0, 50)}`;

    // 6. Connect to Supabase
    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch {
      console.warn('Supabase not configured or variables missing. Simulating database insert.');
      // Return mock success for local testing/deployment where env variables aren't set yet
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Submission received successfully (Mocked)',
        data: {
          city,
          state,
          participation_status: body.participation_status,
          status
        }
      });
    }

    // Check for duplicate submission in this hour
    const { data: duplicate } = await supabase
      .from('submissions')
      .select('id')
      .eq('submission_hash', submission_hash)
      .maybeSingle();

    if (duplicate) {
      return NextResponse.json(
        { error: 'A duplicate submission was detected from your location recently.' },
        { status: 409 }
      );
    }

    // Insert submission
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        city,
        locality: body.locality ? sanitizeText(body.locality) : null,
        district,
        state,
        country,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        participation_status: body.participation_status,
        attendance: body.attendance || null,
        support_reason,
        desired_outcome,
        age_group: body.age_group || null,
        occupation,
        status,
        submission_hash
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase DB error:', error);
      return NextResponse.json({ error: 'Failed to save submission to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id, status: data.status });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
