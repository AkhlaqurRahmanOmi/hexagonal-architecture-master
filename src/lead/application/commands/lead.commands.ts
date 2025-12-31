import { ICommand } from '../../../shared/cqrs';
import { LeadStatus } from '../../domain/entities';

export class CreateLeadCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly source?: string,
  ) {}
}

export class UpdateLeadCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly leadId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly status?: LeadStatus,
    public readonly source?: string,
  ) {}
}
