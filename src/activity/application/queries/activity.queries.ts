import { IQuery } from '../../../shared/cqrs';
import { ActivityRecord } from '../../domain/entities';

export class ListActivityByEntityQuery implements IQuery<ActivityRecord[]> {
  constructor(
    public readonly tenantId: string,
    public readonly entityType: string,
    public readonly entityId: string,
  ) {}
}
