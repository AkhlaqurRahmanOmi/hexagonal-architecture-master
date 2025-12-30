import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const headerValue = req?.headers?.['x-tenant-id'];
    const headerTenantId = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;
    const tokenTenantId = req?.user?.tenantId;

    req.tenantId = headerTenantId || tokenTenantId;
    next();
  }
}
