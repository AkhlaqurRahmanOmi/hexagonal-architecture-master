import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import { ListActivityByEntityQuery } from '../queries/activity.queries';
import { ACTIVITY_REPOSITORY, ActivityRepositoryPort } from '../ports';
import { ActivityRecord } from '../../domain/entities';
import { LogNoteActivityCommand } from '../commands/note-activity.commands';
import { LogCallActivityCommand } from '../commands/call-activity.commands';
import { LogEmailActivityCommand } from '../commands/email-activity.commands';
import { LogMeetingActivityCommand } from '../commands/meeting-activity.commands';
import { LogSystemActivityCommand } from '../commands/system-activity.commands';

@CommandHandler(LogNoteActivityCommand)
export class LogNoteActivityHandler
  implements ICommandHandler<LogNoteActivityCommand, ActivityRecord>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(command: LogNoteActivityCommand): Promise<ActivityRecord> {
    return this.activityRepository.createNoteActivity({
      tenantId: command.tenantId,
      actorUserId: command.actorUserId,
      entityType: command.entityType,
      entityId: command.entityId,
      text: command.text,
    });
  }
}

@CommandHandler(LogCallActivityCommand)
export class LogCallActivityHandler
  implements ICommandHandler<LogCallActivityCommand, ActivityRecord>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(command: LogCallActivityCommand): Promise<ActivityRecord> {
    return this.activityRepository.createCallActivity({
      tenantId: command.tenantId,
      actorUserId: command.actorUserId,
      entityType: command.entityType,
      entityId: command.entityId,
      direction: command.direction,
      durationSeconds: command.durationSeconds,
      summary: command.summary,
    });
  }
}

@CommandHandler(LogEmailActivityCommand)
export class LogEmailActivityHandler
  implements ICommandHandler<LogEmailActivityCommand, ActivityRecord>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(command: LogEmailActivityCommand): Promise<ActivityRecord> {
    return this.activityRepository.createEmailActivity({
      tenantId: command.tenantId,
      actorUserId: command.actorUserId,
      entityType: command.entityType,
      entityId: command.entityId,
      toEmail: command.toEmail,
      fromEmail: command.fromEmail,
      subject: command.subject,
      bodyPreview: command.bodyPreview,
    });
  }
}

@CommandHandler(LogMeetingActivityCommand)
export class LogMeetingActivityHandler
  implements ICommandHandler<LogMeetingActivityCommand, ActivityRecord>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(command: LogMeetingActivityCommand): Promise<ActivityRecord> {
    return this.activityRepository.createMeetingActivity({
      tenantId: command.tenantId,
      actorUserId: command.actorUserId,
      entityType: command.entityType,
      entityId: command.entityId,
      location: command.location,
      scheduledAt: command.scheduledAt,
      summary: command.summary,
    });
  }
}

@CommandHandler(LogSystemActivityCommand)
export class LogSystemActivityHandler
  implements ICommandHandler<LogSystemActivityCommand, ActivityRecord>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(command: LogSystemActivityCommand): Promise<ActivityRecord> {
    return this.activityRepository.createSystemActivity({
      tenantId: command.tenantId,
      actorUserId: command.actorUserId,
      entityType: command.entityType,
      entityId: command.entityId,
      event: command.event,
      message: command.message,
    });
  }
}

@QueryHandler(ListActivityByEntityQuery)
export class ListActivityByEntityHandler
  implements IQueryHandler<ListActivityByEntityQuery, ActivityRecord[]>
{
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(query: ListActivityByEntityQuery): Promise<ActivityRecord[]> {
    return this.activityRepository.listByEntity(
      query.tenantId,
      query.entityType,
      query.entityId,
    );
  }
}

export const ACTIVITY_HANDLERS = [
  LogNoteActivityHandler,
  LogCallActivityHandler,
  LogEmailActivityHandler,
  LogMeetingActivityHandler,
  LogSystemActivityHandler,
  ListActivityByEntityHandler,
];
