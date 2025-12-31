import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '../../shared/cqrs';
import { TenantId } from '../../shared/decorators/tenant-id.decorator';
import { TenantGuard } from '../../tenant/guards/tenant.guard';
import { ListActivityByEntityQuery } from '../application/queries/activity.queries';
import {
  LogCallActivityCommand,
  LogEmailActivityCommand,
  LogMeetingActivityCommand,
  LogNoteActivityCommand,
  LogSystemActivityCommand,
} from '../application/commands';
import {
  LogCallDto,
  LogEmailDto,
  LogMeetingDto,
  LogNoteDto,
  LogSystemDto,
} from '../dtos';
import { ActivityRecord } from '../domain/entities';

@Controller('activities')
@UseGuards(TenantGuard)
export class ActivityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('notes')
  async logNote(@TenantId() tenantId: string, @Body() dto: LogNoteDto) {
    const activity = await this.commandBus.execute<
      LogNoteActivityCommand,
      ActivityRecord
    >(
      new LogNoteActivityCommand(
        tenantId,
        null,
        dto.entityType,
        dto.entityId,
        dto.text,
      ),
    );
    return this.mapActivity(activity);
  }

  @Post('calls')
  async logCall(@TenantId() tenantId: string, @Body() dto: LogCallDto) {
    const activity = await this.commandBus.execute<
      LogCallActivityCommand,
      ActivityRecord
    >(
      new LogCallActivityCommand(
        tenantId,
        null,
        dto.entityType,
        dto.entityId,
        dto.direction,
        dto.durationSeconds,
        dto.summary,
      ),
    );
    return this.mapActivity(activity);
  }

  @Post('emails')
  async logEmail(@TenantId() tenantId: string, @Body() dto: LogEmailDto) {
    const activity = await this.commandBus.execute<
      LogEmailActivityCommand,
      ActivityRecord
    >(
      new LogEmailActivityCommand(
        tenantId,
        null,
        dto.entityType,
        dto.entityId,
        dto.toEmail,
        dto.fromEmail,
        dto.subject,
        dto.bodyPreview,
      ),
    );
    return this.mapActivity(activity);
  }

  @Post('meetings')
  async logMeeting(@TenantId() tenantId: string, @Body() dto: LogMeetingDto) {
    const activity = await this.commandBus.execute<
      LogMeetingActivityCommand,
      ActivityRecord
    >(
      new LogMeetingActivityCommand(
        tenantId,
        null,
        dto.entityType,
        dto.entityId,
        dto.location,
        dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        dto.summary,
      ),
    );
    return this.mapActivity(activity);
  }

  @Post('system')
  async logSystem(@TenantId() tenantId: string, @Body() dto: LogSystemDto) {
    const activity = await this.commandBus.execute<
      LogSystemActivityCommand,
      ActivityRecord
    >(
      new LogSystemActivityCommand(
        tenantId,
        null,
        dto.entityType,
        dto.entityId,
        dto.event,
        dto.message,
      ),
    );
    return this.mapActivity(activity);
  }

  @Get(':entityType/:entityId')
  async list(
    @TenantId() tenantId: string,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    const activities = await this.queryBus.execute<
      ListActivityByEntityQuery,
      ActivityRecord[]
    >(new ListActivityByEntityQuery(tenantId, entityType, entityId));
    return activities.map((activity) => this.mapActivity(activity));
  }

  private mapActivity(record: ActivityRecord) {
    return {
      id: record.activity.getId(),
      tenantId: record.activity.getTenantId(),
      actorUserId: record.activity.getActorUserId(),
      entityType: record.activity.getEntityType(),
      entityId: record.activity.getEntityId(),
      type: record.activity.getType(),
      details: record.details,
      createdAt: record.activity.getCreatedAt(),
    };
  }
}
