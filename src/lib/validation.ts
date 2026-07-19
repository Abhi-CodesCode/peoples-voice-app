import type {
  SubmissionFormData,
  ParticipationStatus,
  AttendanceType,
  AgeGroup,
} from '@/types/database';
import {
  MAX_REASON_LENGTH,
  MAX_OUTCOME_LENGTH,
  MAX_OCCUPATION_LENGTH,
} from '@/lib/constants';

// ── Allowed enum values ────────────────────────────────────────────────
const VALID_PARTICIPATION: ParticipationStatus[] = [
  'supporting',
  'participating',
  'undecided',
];

const VALID_ATTENDANCE: AttendanceType[] = [
  'already_attended',
  'planning_to_attend',
  'supporting_online',
];

const VALID_AGE_GROUPS: AgeGroup[] = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

// ── Sanitisation ───────────────────────────────────────────────────────

/** Strip all HTML tags and collapse surrounding whitespace. */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

// ── Validation ─────────────────────────────────────────────────────────

export function validateSubmission(
  data: SubmissionFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.city || data.city.trim().length === 0) {
    errors.push('City is required.');
  }
  if (!data.state || data.state.trim().length === 0) {
    errors.push('State is required.');
  }

  // Participation status must be a known value
  if (
    !data.participation_status ||
    !VALID_PARTICIPATION.includes(data.participation_status)
  ) {
    errors.push('A valid participation status is required.');
  }

  // Optional text fields — enforce max lengths
  if (
    data.support_reason &&
    data.support_reason.length > MAX_REASON_LENGTH
  ) {
    errors.push(
      `Support reason must be ${MAX_REASON_LENGTH} characters or fewer.`
    );
  }

  if (
    data.desired_outcome &&
    data.desired_outcome.length > MAX_OUTCOME_LENGTH
  ) {
    errors.push(
      `Desired outcome must be ${MAX_OUTCOME_LENGTH} characters or fewer.`
    );
  }

  if (
    data.occupation &&
    data.occupation.length > MAX_OCCUPATION_LENGTH
  ) {
    errors.push(
      `Occupation must be ${MAX_OCCUPATION_LENGTH} characters or fewer.`
    );
  }

  // Optional enums — if provided, must be valid
  if (
    data.attendance !== undefined &&
    !VALID_ATTENDANCE.includes(data.attendance)
  ) {
    errors.push('Invalid attendance type.');
  }

  if (
    data.age_group !== undefined &&
    !VALID_AGE_GROUPS.includes(data.age_group)
  ) {
    errors.push('Invalid age group.');
  }

  return { valid: errors.length === 0, errors };
}
