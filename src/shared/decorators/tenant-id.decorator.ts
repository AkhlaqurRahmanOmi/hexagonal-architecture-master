import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract tenant id from request context (set by middleware/guard) or headers.
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request?.tenantId ||
      request?.user?.tenantId ||
      request?.headers?.['x-tenant-id']
    );
  },
);
