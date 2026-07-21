import type { ParticipationStatus, AgeGroup } from '@/types/database';

// ── Site Metadata ──────────────────────────────────────────────────────
export const SITE_NAME = "People's Voices";

export const SITE_DESCRIPTION =
  'An anonymous, open-source platform where people voluntarily share why they support or participate in the CJP protest.';

export const DISCLAIMER_TEXT =
  'This platform visualizes voluntary submissions from individuals who choose to participate. It is intended to document participation and perspectives, not to estimate public opinion or represent the views of the general population.';

export const MOVEMENT_NAME = 'CJP Protest';

// ── Validation Limits ──────────────────────────────────────────────────
export const MAX_REASON_LENGTH = 300;
export const MAX_OUTCOME_LENGTH = 300;
export const MAX_OCCUPATION_LENGTH = 100;

// ── Rate Limiting ──────────────────────────────────────────────────────
export const RATE_LIMIT_WINDOW_MS = 3_600_000; // 1 hour
export const RATE_LIMIT_MAX_REQUESTS = 3;

// ── Map Defaults (India) ──────────────────────────────────────────────
export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 } as const;
export const INDIA_ZOOM = 4.5;

// ── External APIs ──────────────────────────────────────────────────────
export const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// ── Human-readable Labels ──────────────────────────────────────────────
export const PARTICIPATION_LABELS: Record<ParticipationStatus, string> = {
  supporting: 'Supporting',
  participating: 'Participating',
  undecided: 'Undecided',
};

export const ATTENDANCE_LABELS: Record<string, string> = {
  already_attended: 'Already Attended',
  planning_to_attend: 'Planning to Attend',
  supporting_online: 'Supporting Online',
  local_protest: 'Joining Local Protest',
};

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '18-24': '18–24',
  '25-34': '25–34',
  '35-44': '35–44',
  '45-54': '45–54',
  '55-64': '55–64',
  '65+': '65+',
};
