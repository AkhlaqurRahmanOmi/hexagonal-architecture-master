import { ICommand } from '../../../shared/cqrs';

export class CreateRoleCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

export class UpdateRoleCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly roleId: string,
    public readonly name?: string,
    public readonly description?: string,
  ) {}
}

export class DeleteRoleCommand implements ICommand {
  constructor(public readonly tenantId: string, public readonly roleId: string) {}
}

export class AssignPermissionsToRoleCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly roleId: string,
    public readonly permissionIds: string[],
  ) {}
}

export class RemovePermissionsFromRoleCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly roleId: string,
    public readonly permissionIds: string[],
  ) {}
}

export class AssignRoleToUserCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}

export class RemoveRoleFromUserCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}
