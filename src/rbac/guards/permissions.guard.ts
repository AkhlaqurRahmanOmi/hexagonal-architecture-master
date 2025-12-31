import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RoleAssignmentRepositoryPort, ROLE_ASSIGNMENT_REPOSITORY } from '../application/ports';
import { Inject } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request?.tenantId;
    const userId = request?.user?.sub || request?.user?.id;

    if (!tenantId || !userId) {
      throw new UnauthorizedException('Missing tenant or user context');
    }

    const permissions = await this.roleAssignmentRepository.listPermissionKeysForUser(
      tenantId,
      userId,
    );

    const hasAll = requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );
    if (!hasAll) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
