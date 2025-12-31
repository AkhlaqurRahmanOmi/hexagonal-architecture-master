import { ICommand } from '../../../shared/cqrs';
import { EntityType } from '../../domain/entities';

export class LogMeetingActivityCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly actorUserId: string | null,
    public readonly entityType: EntityType,
    public readonly entityId: string,
    public readonly location?: string,
    public readonly scheduledAt?: Date,
    public readonly summary?: string,
  ) {}
}
