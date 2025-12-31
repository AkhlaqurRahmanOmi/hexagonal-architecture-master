import { IQuery } from '../../../shared/cqrs';
import { TenantDomain } from '../../domain/entities';

export class ListTenantDomainsQuery implements IQuery<TenantDomain[]> {
  constructor(public readonly tenantId: string) {}
}

export class ResolveTenantByDomainQuery implements IQuery<TenantDomain> {
  constructor(public readonly domain: string) {}
}
