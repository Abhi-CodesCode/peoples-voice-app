// People's Voices — Database Types
// Strict TypeScript interfaces for all data entities

export type ParticipationStatus = 'supporting' | 'participating' | 'undecided';

export type AttendanceType =
  | 'already_attended'
  | 'planning_to_attend'
  | 'supporting_online'
  | 'local_protest';

export type AgeGroup =
  | '18-24'
  | '25-34'
  | '35-44'
  | '45-54'
  | '55-64'
  | '65+';

export type SubmissionStatus = 'pending' | 'approved' | 'hidden';

/** A single raw submission row from the database */
export interface Submission {
  id: string;
  city: string;
  district: string | null;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  participation_status: ParticipationStatus;
  attendance: AttendanceType | null;
  support_reason: string | null;
  desired_outcome: string | null;
  age_group: AgeGroup | null;
  occupation: string | null;
  student_field: string | null;
  status: SubmissionStatus;
  created_at: string;
  submission_hash: string;
}

/** Aggregated voice counts per city (used by the map layer) */
export interface CityAggregate {
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  total_voices: number;
  supporting_count: number;
  participating_count: number;
  undecided_count: number;
  already_attended_count: number;
  planning_count: number;
  online_count: number;
  local_protest_count: number;
}

/** Aggregated voice counts per state */
export interface StateAggregate {
  state: string;
  country: string;
  total_voices: number;
  supporting_count: number;
  participating_count: number;
  undecided_count: number;
}

/** Daily submission totals for trend charts */
export interface DailySubmission {
  submission_date: string;
  total: number;
  supporting: number;
  participating: number;
  undecided: number;
}

/** Publicly visible voice (no PII) shown in the feed */
export interface PublicVoice {
  id: string;
  city: string;
  state: string;
  participation_status: ParticipationStatus;
  support_reason: string | null;
  desired_outcome: string | null;
  student_field: string | null;
  created_at: string;
}

/** Global platform statistics */
export interface PlatformStats {
  total_voices: number;
  cities_represented: number;
  states_represented: number;
  supporting_count: number;
  participating_count: number;
  undecided_count: number;
}

/** Data shape submitted via the public form */
export interface SubmissionFormData {
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  participation_status: ParticipationStatus;
  attendance?: AttendanceType;
  support_reason?: string;
  desired_outcome?: string;
  age_group?: AgeGroup;
  occupation?: string;
  student_field?: string;
}

/** Result returned by the city autocomplete / geocoding search */
export interface CitySearchResult {
  city: string;
  district?: string | null;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}
