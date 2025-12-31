import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleAssignmentRepositoryPort, ROLE_ASSIGNMENT_REPOSITORY } from '../application/ports';
import { Inject } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request?.tenantId;
    const userId = request?.user?.sub || request?.user?.id;

    if (!tenantId || !userId) {
      throw new UnauthorizedException('Missing tenant or user context');
    }

    const roleIds = await this.roleAssignmentRepository.listRoleIdsForUser(
      tenantId,
      userId,
    );

    if (!roleIds.length) {
      throw new ForbiddenException('Access denied');
    }

    // Role names are not resolved here; use role IDs as requiredRoles or extend to resolve names.
    const hasRole = requiredRoles.some((roleId) => roleIds.includes(roleId));
    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
