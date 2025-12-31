import { TenantDomain } from '../../domain/entities';

export interface TenantDomainRepositoryPort {
  create(domain: TenantDomain): Promise<TenantDomain>;
  findByDomain(domain: string): Promise<TenantDomain | null>;
  listByTenant(tenantId: string): Promise<TenantDomain[]>;
  verify(tenantId: string, domainId: string): Promise<void>;
  remove(tenantId: string, domainId: string): Promise<void>;
}

export const TENANT_DOMAIN_REPOSITORY = Symbol('TENANT_DOMAIN_REPOSITORY');
