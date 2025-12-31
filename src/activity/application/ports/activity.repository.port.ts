import { ActivityRecord } from '../../domain/entities';

export interface ActivityRepositoryPort {
  createSystemActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    event: string;
    message?: string;
  }): Promise<ActivityRecord>;
  createNoteActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    text: string;
  }): Promise<ActivityRecord>;
  createCallActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    direction: 'inbound' | 'outbound';
    durationSeconds?: number;
    summary?: string;
  }): Promise<ActivityRecord>;
  createEmailActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    toEmail?: string;
    fromEmail?: string;
    subject?: string;
    bodyPreview?: string;
  }): Promise<ActivityRecord>;
  createMeetingActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    location?: string;
    scheduledAt?: Date;
    summary?: string;
  }): Promise<ActivityRecord>;
  listByEntity(
    tenantId: string,
    entityType: string,
    entityId: string,
  ): Promise<ActivityRecord[]>;
}

export const ACTIVITY_REPOSITORY = Symbol('ACTIVITY_REPOSITORY');
