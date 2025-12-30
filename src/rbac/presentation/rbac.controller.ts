import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '../../shared/cqrs';
import { TenantId } from '../../shared/decorators/tenant-id.decorator';
import {
  AssignPermissionsToRoleCommand,
  AssignRoleToUserCommand,
  CreateRoleCommand,
  DeleteRoleCommand,
  RemovePermissionsFromRoleCommand,
  RemoveRoleFromUserCommand,
  UpdateRoleCommand,
} from '../application/commands/role.commands';
import {
  CreatePermissionCommand,
  DeletePermissionCommand,
  UpdatePermissionCommand,
} from '../application/commands/permission.commands';
import { GetRoleQuery, ListRolesQuery, GetUserPermissionsQuery } from '../application/queries/role.queries';
import { GetPermissionQuery, ListPermissionsQuery } from '../application/queries/permission.queries';
import {
  AssignPermissionsDto,
  AssignRoleDto,
  CreatePermissionDto,
  CreateRoleDto,
  UpdatePermissionDto,
  UpdateRoleDto,
} from '../dtos';

@Controller('rbac')
export class RbacController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('roles')
  async createRole(
    @TenantId() tenantId: string,
    @Body() dto: CreateRoleDto,
  ) {
    return this.commandBus.execute(
      new CreateRoleCommand(tenantId, dto.name, dto.description),
    );
  }

  @Get('roles')
  async listRoles(@TenantId() tenantId: string) {
    return this.queryBus.execute(new ListRolesQuery(tenantId));
  }

  @Get('roles/:id')
  async getRole(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.queryBus.execute(new GetRoleQuery(tenantId, id));
  }

  @Patch('roles/:id')
  async updateRole(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.commandBus.execute(
      new UpdateRoleCommand(tenantId, id, dto.name, dto.description),
    );
  }

  @Delete('roles/:id')
  async deleteRole(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.commandBus.execute(new DeleteRoleCommand(tenantId, id));
  }

  @Post('roles/:id/permissions')
  async assignPermissions(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.commandBus.execute(
      new AssignPermissionsToRoleCommand(tenantId, id, dto.permissionIds),
    );
  }

  @Delete('roles/:id/permissions')
  async removePermissions(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.commandBus.execute(
      new RemovePermissionsFromRoleCommand(tenantId, id, dto.permissionIds),
    );
  }

  @Post('permissions')
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.commandBus.execute(
      new CreatePermissionCommand(dto.key, dto.description),
    );
  }

  @Get('permissions')
  async listPermissions() {
    return this.queryBus.execute(new ListPermissionsQuery());
  }

  @Get('permissions/:id')
  async getPermission(@Param('id') id: string) {
    return this.queryBus.execute(new GetPermissionQuery(id));
  }

  @Patch('permissions/:id')
  async updatePermission(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.commandBus.execute(
      new UpdatePermissionCommand(id, dto.key, dto.description),
    );
  }

  @Delete('permissions/:id')
  async deletePermission(@Param('id') id: string) {
    return this.commandBus.execute(new DeletePermissionCommand(id));
  }

  @Post('users/:userId/roles')
  async assignRoleToUser(
    @TenantId() tenantId: string,
    @Param('userId') userId: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.commandBus.execute(
      new AssignRoleToUserCommand(tenantId, userId, dto.roleId),
    );
  }

  @Delete('users/:userId/roles/:roleId')
  async removeRoleFromUser(
    @TenantId() tenantId: string,
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.commandBus.execute(
      new RemoveRoleFromUserCommand(tenantId, userId, roleId),
    );
  }

  @Get('users/:userId/permissions')
  async listUserPermissions(
    @TenantId() tenantId: string,
    @Param('userId') userId: string,
  ) {
    return this.queryBus.execute(new GetUserPermissionsQuery(tenantId, userId));
  }
}
