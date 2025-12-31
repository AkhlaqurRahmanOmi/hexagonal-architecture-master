import { Activity } from './activity.entity';

export interface NoteDetails {
  text: string;
}

export interface CallDetails {
  direction: 'inbound' | 'outbound';
  durationSeconds?: number;
  summary?: string;
}

export interface EmailDetails {
  toEmail?: string;
  fromEmail?: string;
  subject?: string;
  bodyPreview?: string;
}

export interface MeetingDetails {
  location?: string;
  scheduledAt?: Date;
  summary?: string;
}

export interface SystemDetails {
  event: string;
  message?: string;
}

export type ActivityDetails =
  | NoteDetails
  | CallDetails
  | EmailDetails
  | MeetingDetails
  | SystemDetails;

export interface ActivityRecord {
  activity: Activity;
  details?: ActivityDetails;
}
