import { Tenant } from '../../domain/entities';

export interface TenantRepositoryPort {
  create(tenant: Tenant): Promise<Tenant>;
  update(tenant: Tenant): Promise<Tenant>;
  findById(id: string): Promise<Tenant | null>;
  findByName(name: string): Promise<Tenant | null>;
  list(): Promise<Tenant[]>;
}

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');
