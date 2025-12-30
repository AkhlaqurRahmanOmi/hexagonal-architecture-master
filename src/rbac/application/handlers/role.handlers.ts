import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import {
  AssignPermissionsToRoleCommand,
  AssignRoleToUserCommand,
  CreateRoleCommand,
  DeleteRoleCommand,
  RemovePermissionsFromRoleCommand,
  RemoveRoleFromUserCommand,
  UpdateRoleCommand,
} from '../commands/role.commands';
import { GetRoleQuery, ListRolesQuery, GetUserPermissionsQuery, RoleWithPermissions } from '../queries/role.queries';
import {
  ROLE_REPOSITORY,
  RoleRepositoryPort,
  PERMISSION_REPOSITORY,
  PermissionRepositoryPort,
  ROLE_ASSIGNMENT_REPOSITORY,
  RoleAssignmentRepositoryPort,
} from '../ports';
import { Role } from '../../domain/entities';
import { USER_REPOSITORY, UserRepositoryPort } from '../../../user/application/ports';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand, Role> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    const { tenantId, name, description } = command;
    const existing = await this.roleRepository.findByName(tenantId, name);
    if (existing) {
      throw new ConflictException('Role already exists');
    }
    const role = Role.create(tenantId, name, description);
    return this.roleRepository.create(role);
  }
}

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand, Role> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<Role> {
    const { tenantId, roleId, name, description } = command;
    const role = await this.roleRepository.findById(tenantId, roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (name) {
      const existing = await this.roleRepository.findByName(tenantId, name);
      if (existing && existing.getId().getValue() !== roleId) {
        throw new ConflictException('Role already exists');
      }
    }
    role.update(name, description);
    return this.roleRepository.update(role);
  }
}

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand, void> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    await this.roleRepository.delete(command.tenantId, command.roleId);
  }
}

@CommandHandler(AssignPermissionsToRoleCommand)
export class AssignPermissionsToRoleHandler
  implements ICommandHandler<AssignPermissionsToRoleCommand, void>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(command: AssignPermissionsToRoleCommand): Promise<void> {
    const { tenantId, roleId, permissionIds } = command;
    const role = await this.roleRepository.findById(tenantId, roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('One or more permissions not found');
    }

    await this.roleRepository.assignPermissions(roleId, permissionIds);
  }
}

@CommandHandler(RemovePermissionsFromRoleCommand)
export class RemovePermissionsFromRoleHandler
  implements ICommandHandler<RemovePermissionsFromRoleCommand, void>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: RemovePermissionsFromRoleCommand): Promise<void> {
    const { tenantId, roleId, permissionIds } = command;
    const role = await this.roleRepository.findById(tenantId, roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.removePermissions(roleId, permissionIds);
  }
}

@CommandHandler(AssignRoleToUserCommand)
export class AssignRoleToUserHandler
  implements ICommandHandler<AssignRoleToUserCommand, void>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<void> {
    const { tenantId, userId, roleId } = command;
    const role = await this.roleRepository.findById(tenantId, roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const user = await this.userRepository.findById(tenantId, userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.roleAssignmentRepository.assignRole(tenantId, userId, roleId);
  }
}

@CommandHandler(RemoveRoleFromUserCommand)
export class RemoveRoleFromUserHandler
  implements ICommandHandler<RemoveRoleFromUserCommand, void>
{
  constructor(
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
  ) {}

  async execute(command: RemoveRoleFromUserCommand): Promise<void> {
    const { tenantId, userId, roleId } = command;
    await this.roleAssignmentRepository.removeRole(tenantId, userId, roleId);
  }
}

@QueryHandler(GetRoleQuery)
export class GetRoleHandler implements IQueryHandler<GetRoleQuery, RoleWithPermissions> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(query: GetRoleQuery): Promise<RoleWithPermissions> {
    const role = await this.roleRepository.findById(query.tenantId, query.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const permissionIds = await this.roleRepository.getPermissionIds(query.roleId);
    return { role, permissionIds };
  }
}

@QueryHandler(ListRolesQuery)
export class ListRolesHandler implements IQueryHandler<ListRolesQuery, RoleWithPermissions[]> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(query: ListRolesQuery): Promise<RoleWithPermissions[]> {
    const roles = await this.roleRepository.list(query.tenantId);
    const results: RoleWithPermissions[] = [];
    for (const role of roles) {
      const permissionIds = await this.roleRepository.getPermissionIds(
        role.getId().getValue(),
      );
      results.push({ role, permissionIds });
    }
    return results;
  }
}

@QueryHandler(GetUserPermissionsQuery)
export class GetUserPermissionsHandler
  implements IQueryHandler<GetUserPermissionsQuery, string[]>
{
  constructor(
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
  ) {}

  async execute(query: GetUserPermissionsQuery): Promise<string[]> {
    return this.roleAssignmentRepository.listPermissionKeysForUser(
      query.tenantId,
      query.userId,
    );
  }
}

export const ROLE_HANDLERS = [
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  AssignPermissionsToRoleHandler,
  RemovePermissionsFromRoleHandler,
  AssignRoleToUserHandler,
  RemoveRoleFromUserHandler,
  GetRoleHandler,
  ListRolesHandler,
  GetUserPermissionsHandler,
];
