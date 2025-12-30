import { ICommand } from '../../../shared/cqrs';

export class CreatePermissionCommand implements ICommand {
  constructor(public readonly key: string, public readonly description?: string) {}
}

export class UpdatePermissionCommand implements ICommand {
  constructor(
    public readonly permissionId: string,
    public readonly key?: string,
    public readonly description?: string,
  ) {}
}

export class DeletePermissionCommand implements ICommand {
  constructor(public readonly permissionId: string) {}
}
