import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  TENANT_MEMBERSHIP_REPOSITORY,
  TenantMembershipRepositoryPort,
} from '../application/ports';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('TenantId is required');
    }

    const userId = request?.user?.sub || request?.user?.id;
    if (!userId) {
      return true;
    }

    const membership = await this.membershipRepository.findByTenantAndUser(
      tenantId,
      userId,
    );
    if (!membership || membership.getStatus() !== 'active') {
      throw new ForbiddenException('Not a member of this tenant');
    }

    return true;
  }
}
