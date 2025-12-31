import { ICommand } from '../../../shared/cqrs';
import { EntityType } from '../../domain/entities';

export class LogSystemActivityCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly actorUserId: string | null,
    public readonly entityType: EntityType,
    public readonly entityId: string,
    public readonly event: string,
    public readonly message?: string,
  ) {}
}
