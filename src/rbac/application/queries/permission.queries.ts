import { IQuery } from '../../../shared/cqrs';
import { Permission } from '../../domain/entities';

export class GetPermissionQuery implements IQuery<Permission> {
  constructor(public readonly permissionId: string) {}
}

export class ListPermissionsQuery implements IQuery<Permission[]> {
  constructor() {}
}
