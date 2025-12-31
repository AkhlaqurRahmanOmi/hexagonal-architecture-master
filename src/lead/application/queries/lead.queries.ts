import { IQuery } from '../../../shared/cqrs';
import { Lead } from '../../domain/entities';

export class GetLeadQuery implements IQuery<Lead> {
  constructor(public readonly tenantId: string, public readonly leadId: string) {}
}

export class ListLeadsQuery implements IQuery<Lead[]> {
  constructor(public readonly tenantId: string) {}
}
