import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ActivityRepositoryPort } from '../../application/ports/activity.repository.port';
import { Activity, ActivityRecord } from '../../domain/entities';
import { ActivityEntity } from './activity.orm-entity';
import { NoteActivityEntity } from './note-activity.orm-entity';
import { CallActivityEntity } from './call-activity.orm-entity';
import { EmailActivityEntity } from './email-activity.orm-entity';
import { MeetingActivityEntity } from './meeting-activity.orm-entity';
import { SystemActivityEntity } from './system-activity.orm-entity';

@Injectable()
export class TypeOrmActivityRepository implements ActivityRepositoryPort {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
    @InjectRepository(NoteActivityEntity)
    private readonly noteRepository: Repository<NoteActivityEntity>,
    @InjectRepository(CallActivityEntity)
    private readonly callRepository: Repository<CallActivityEntity>,
    @InjectRepository(EmailActivityEntity)
    private readonly emailRepository: Repository<EmailActivityEntity>,
    @InjectRepository(MeetingActivityEntity)
    private readonly meetingRepository: Repository<MeetingActivityEntity>,
    @InjectRepository(SystemActivityEntity)
    private readonly systemRepository: Repository<SystemActivityEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createSystemActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    event: string;
    message?: string;
  }): Promise<ActivityRecord> {
    return this.dataSource.transaction(async (manager) => {
      const activity = Activity.create({
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType as any,
        entityId: params.entityId,
        type: 'system',
      });

      const base = this.toEntity(activity);
      await manager.getRepository(ActivityEntity).save(base);

      const detail = new SystemActivityEntity();
      detail.activityId = base.id;
      detail.event = params.event;
      detail.message = params.message || null;
      await manager.getRepository(SystemActivityEntity).save(detail);

      return { activity, details: { event: detail.event, message: detail.message || undefined } };
    });
  }

  async createNoteActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    text: string;
  }): Promise<ActivityRecord> {
    return this.dataSource.transaction(async (manager) => {
      const activity = Activity.create({
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType as any,
        entityId: params.entityId,
        type: 'note',
      });

      const base = this.toEntity(activity);
      await manager.getRepository(ActivityEntity).save(base);

      const detail = new NoteActivityEntity();
      detail.activityId = base.id;
      detail.text = params.text;
      await manager.getRepository(NoteActivityEntity).save(detail);

      return { activity, details: { text: detail.text } };
    });
  }

  async createCallActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    direction: 'inbound' | 'outbound';
    durationSeconds?: number;
    summary?: string;
  }): Promise<ActivityRecord> {
    return this.dataSource.transaction(async (manager) => {
      const activity = Activity.create({
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType as any,
        entityId: params.entityId,
        type: 'call',
      });

      const base = this.toEntity(activity);
      await manager.getRepository(ActivityEntity).save(base);

      const detail = new CallActivityEntity();
      detail.activityId = base.id;
      detail.direction = params.direction;
      detail.durationSeconds = params.durationSeconds ?? null;
      detail.summary = params.summary ?? null;
      await manager.getRepository(CallActivityEntity).save(detail);

      return {
        activity,
        details: {
          direction: detail.direction,
          durationSeconds: detail.durationSeconds || undefined,
          summary: detail.summary || undefined,
        },
      };
    });
  }

  async createEmailActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    toEmail?: string;
    fromEmail?: string;
    subject?: string;
    bodyPreview?: string;
  }): Promise<ActivityRecord> {
    return this.dataSource.transaction(async (manager) => {
      const activity = Activity.create({
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType as any,
        entityId: params.entityId,
        type: 'email',
      });

      const base = this.toEntity(activity);
      await manager.getRepository(ActivityEntity).save(base);

      const detail = new EmailActivityEntity();
      detail.activityId = base.id;
      detail.toEmail = params.toEmail ?? null;
      detail.fromEmail = params.fromEmail ?? null;
      detail.subject = params.subject ?? null;
      detail.bodyPreview = params.bodyPreview ?? null;
      await manager.getRepository(EmailActivityEntity).save(detail);

      return {
        activity,
        details: {
          toEmail: detail.toEmail || undefined,
          fromEmail: detail.fromEmail || undefined,
          subject: detail.subject || undefined,
          bodyPreview: detail.bodyPreview || undefined,
        },
      };
    });
  }

  async createMeetingActivity(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    location?: string;
    scheduledAt?: Date;
    summary?: string;
  }): Promise<ActivityRecord> {
    return this.dataSource.transaction(async (manager) => {
      const activity = Activity.create({
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType as any,
        entityId: params.entityId,
        type: 'meeting',
      });

      const base = this.toEntity(activity);
      await manager.getRepository(ActivityEntity).save(base);

      const detail = new MeetingActivityEntity();
      detail.activityId = base.id;
      detail.location = params.location ?? null;
      detail.scheduledAt = params.scheduledAt ?? null;
      detail.summary = params.summary ?? null;
      await manager.getRepository(MeetingActivityEntity).save(detail);

      return {
        activity,
        details: {
          location: detail.location || undefined,
          scheduledAt: detail.scheduledAt || undefined,
          summary: detail.summary || undefined,
        },
      };
    });
  }

  async listByEntity(
    tenantId: string,
    entityType: string,
    entityId: string,
  ): Promise<ActivityRecord[]> {
    const entities = await this.activityRepository.find({
      where: { tenantId, entityType, entityId },
      order: { createdAt: 'DESC' },
    });
    if (entities.length === 0) {
      return [];
    }
    const records = entities.map((entity) => this.toDomain(entity));
    const ids = records.map((record) => record.activity.getId());

    const systemDetails = await this.systemRepository
      .createQueryBuilder('s')
      .where('s.activity_id IN (:...ids)', { ids })
      .getMany();
    const noteDetails = await this.noteRepository
      .createQueryBuilder('n')
      .where('n.activity_id IN (:...ids)', { ids })
      .getMany();
    const callDetails = await this.callRepository
      .createQueryBuilder('c')
      .where('c.activity_id IN (:...ids)', { ids })
      .getMany();
    const emailDetails = await this.emailRepository
      .createQueryBuilder('e')
      .where('e.activity_id IN (:...ids)', { ids })
      .getMany();
    const meetingDetails = await this.meetingRepository
      .createQueryBuilder('m')
      .where('m.activity_id IN (:...ids)', { ids })
      .getMany();

    const detailMap = new Map<string, any>();
    systemDetails.forEach((d) =>
      detailMap.set(d.activityId, { event: d.event, message: d.message || undefined }),
    );
    noteDetails.forEach((d) =>
      detailMap.set(d.activityId, { text: d.text }),
    );
    callDetails.forEach((d) =>
      detailMap.set(d.activityId, {
        direction: d.direction,
        durationSeconds: d.durationSeconds || undefined,
        summary: d.summary || undefined,
      }),
    );
    emailDetails.forEach((d) =>
      detailMap.set(d.activityId, {
        toEmail: d.toEmail || undefined,
        fromEmail: d.fromEmail || undefined,
        subject: d.subject || undefined,
        bodyPreview: d.bodyPreview || undefined,
      }),
    );
    meetingDetails.forEach((d) =>
      detailMap.set(d.activityId, {
        location: d.location || undefined,
        scheduledAt: d.scheduledAt || undefined,
        summary: d.summary || undefined,
      }),
    );

    return records.map((record) => ({
      activity: record.activity,
      details: detailMap.get(record.activity.getId()),
    }));
  }

  private toEntity(activity: Activity): ActivityEntity {
    const entity = new ActivityEntity();
    entity.id = activity.getId();
    entity.tenantId = activity.getTenantId();
    entity.actorUserId = activity.getActorUserId() || null;
    entity.entityType = activity.getEntityType();
    entity.entityId = activity.getEntityId();
    entity.type = activity.getType();
    entity.createdAt = activity.getCreatedAt() || new Date();
    return entity;
  }

  private toDomain(entity: ActivityEntity): ActivityRecord {
    const activity = new Activity(
      entity.id,
      entity.tenantId,
      entity.actorUserId || null,
      entity.entityType as any,
      entity.entityId,
      entity.type as any,
      entity.createdAt,
    );

    return { activity };
  }
}
