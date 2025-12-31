import { MembershipRole, TenantMembership } from '../../domain/entities';

export interface TenantMembershipRepositoryPort {
  create(membership: TenantMembership): Promise<TenantMembership>;
  update(membership: TenantMembership): Promise<TenantMembership>;
  findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<TenantMembership | null>;
  listByTenant(tenantId: string): Promise<TenantMembership[]>;
  listByUser(userId: string): Promise<TenantMembership[]>;
  remove(tenantId: string, userId: string): Promise<void>;
  updateRole(
    tenantId: string,
    userId: string,
    role: MembershipRole,
  ): Promise<void>;
}

export const TENANT_MEMBERSHIP_REPOSITORY = Symbol('TENANT_MEMBERSHIP_REPOSITORY');
