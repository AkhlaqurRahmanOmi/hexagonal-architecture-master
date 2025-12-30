import { Permission } from '../../domain/entities';

export interface PermissionRepositoryPort {
  create(permission: Permission): Promise<Permission>;
  update(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByKey(key: string): Promise<Permission | null>;
  findByIds(ids: string[]): Promise<Permission[]>;
  list(): Promise<Permission[]>;
  delete(id: string): Promise<void>;
}

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');
