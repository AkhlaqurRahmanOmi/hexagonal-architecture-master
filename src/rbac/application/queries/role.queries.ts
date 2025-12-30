import { IQuery } from '../../../shared/cqrs';
import { Role } from '../../domain/entities';

export interface RoleWithPermissions {
  role: Role;
  permissionIds: string[];
}

export class GetRoleQuery implements IQuery<RoleWithPermissions> {
  constructor(public readonly tenantId: string, public readonly roleId: string) {}
}

export class ListRolesQuery implements IQuery<RoleWithPermissions[]> {
  constructor(public readonly tenantId: string) {}
}

export class GetUserPermissionsQuery implements IQuery<string[]> {
  constructor(public readonly tenantId: string, public readonly userId: string) {}
}
