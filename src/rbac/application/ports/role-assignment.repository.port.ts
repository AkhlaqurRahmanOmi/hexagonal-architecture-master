export interface RoleAssignmentRepositoryPort {
  assignRole(tenantId: string, userId: string, roleId: string): Promise<void>;
  removeRole(tenantId: string, userId: string, roleId: string): Promise<void>;
  listRoleIdsForUser(tenantId: string, userId: string): Promise<string[]>;
  listPermissionKeysForUser(tenantId: string, userId: string): Promise<string[]>;
}

export const ROLE_ASSIGNMENT_REPOSITORY = Symbol('ROLE_ASSIGNMENT_REPOSITORY');
