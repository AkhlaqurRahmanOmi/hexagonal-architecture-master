import { ICommand } from '../../../shared/cqrs';
import { EntityType } from '../../domain/entities';

export class LogCallActivityCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly actorUserId: string | null,
    public readonly entityType: EntityType,
    public readonly entityId: string,
    public readonly direction: 'inbound' | 'outbound',
    public readonly durationSeconds?: number,
    public readonly summary?: string,
  ) {}
}
