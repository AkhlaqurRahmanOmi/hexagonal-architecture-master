import { IQuery } from '../../../shared/cqrs';
import { Tenant, TenantMembership } from '../../domain/entities';

export class GetTenantQuery implements IQuery<Tenant> {
  constructor(public readonly tenantId: string) {}
}

export class ListTenantsQuery implements IQuery<Tenant[]> {
  constructor() {}
}

export class ListTenantMembersQuery implements IQuery<TenantMembership[]> {
  constructor(public readonly tenantId: string) {}
}

export class ListUserTenantsQuery implements IQuery<TenantMembership[]> {
  constructor(public readonly userId: string) {}
}
