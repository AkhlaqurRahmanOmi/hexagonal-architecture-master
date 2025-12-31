import { Role } from '../../domain/entities';

export interface RoleRepositoryPort {
  create(role: Role): Promise<Role>;
  update(role: Role): Promise<Role>;
  findById(tenantId: string, id: string): Promise<Role | null>;
  findByName(tenantId: string, name: string): Promise<Role | null>;
  findByIds(tenantId: string, ids: string[]): Promise<Role[]>;
  list(tenantId: string): Promise<Role[]>;
  delete(tenantId: string, id: string): Promise<void>;
  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
  removePermissions(roleId: string, permissionIds: string[]): Promise<void>;
  getPermissionIds(roleId: string): Promise<string[]>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
