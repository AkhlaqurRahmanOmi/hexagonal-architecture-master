import {
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import {
  CreatePermissionCommand,
  DeletePermissionCommand,
  UpdatePermissionCommand,
} from '../commands/permission.commands';
import { GetPermissionQuery, ListPermissionsQuery } from '../queries/permission.queries';
import { PERMISSION_REPOSITORY, PermissionRepositoryPort } from '../ports';
import { Permission } from '../../domain/entities';

@CommandHandler(CreatePermissionCommand)
export class CreatePermissionHandler
  implements ICommandHandler<CreatePermissionCommand, Permission>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<Permission> {
    const { key, description } = command;
    const existing = await this.permissionRepository.findByKey(key);
    if (existing) {
      throw new ConflictException('Permission already exists');
    }
    const permission = Permission.create(key, description);
    return this.permissionRepository.create(permission);
  }
}

@CommandHandler(UpdatePermissionCommand)
export class UpdatePermissionHandler
  implements ICommandHandler<UpdatePermissionCommand, Permission>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(command: UpdatePermissionCommand): Promise<Permission> {
    const { permissionId, key, description } = command;
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    if (key) {
      const existing = await this.permissionRepository.findByKey(key);
      if (existing && existing.getId().getValue() !== permissionId) {
        throw new ConflictException('Permission already exists');
      }
    }
    permission.update(key, description);
    return this.permissionRepository.update(permission);
  }
}

@CommandHandler(DeletePermissionCommand)
export class DeletePermissionHandler
  implements ICommandHandler<DeletePermissionCommand, void>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(command: DeletePermissionCommand): Promise<void> {
    await this.permissionRepository.delete(command.permissionId);
  }
}

@QueryHandler(GetPermissionQuery)
export class GetPermissionHandler
  implements IQueryHandler<GetPermissionQuery, Permission>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(query: GetPermissionQuery): Promise<Permission> {
    const permission = await this.permissionRepository.findById(query.permissionId);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
}

@QueryHandler(ListPermissionsQuery)
export class ListPermissionsHandler
  implements IQueryHandler<ListPermissionsQuery, Permission[]>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(): Promise<Permission[]> {
    return this.permissionRepository.list();
  }
}

export const PERMISSION_HANDLERS = [
  CreatePermissionHandler,
  UpdatePermissionHandler,
  DeletePermissionHandler,
  GetPermissionHandler,
  ListPermissionsHandler,
];
