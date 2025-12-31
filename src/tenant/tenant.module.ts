import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { TenantController } from './presentation/tenant.controller';
import { TENANT_HANDLERS } from './application/handlers/tenant.handlers';
import {
  TENANT_REPOSITORY,
  TENANT_MEMBERSHIP_REPOSITORY,
  TENANT_DOMAIN_REPOSITORY,
} from './application/ports';
import { TypeOrmTenantRepository } from './infrastructure/adapters/typeorm-tenant.repository';
import { TypeOrmTenantMembershipRepository } from './infrastructure/adapters/typeorm-tenant-membership.repository';
import { TenantEntity } from './infrastructure/adapters/tenant.orm-entity';
import { TenantMembershipEntity } from './infrastructure/adapters/tenant-membership.orm-entity';
import { TenantGuard } from './guards/tenant.guard';
import { TenantDomainEntity } from './infrastructure/adapters/tenant-domain.orm-entity';
import { TypeOrmTenantDomainRepository } from './infrastructure/adapters/typeorm-tenant-domain.repository';

@Module({
  imports: [
    SharedCqrsModule,
    TypeOrmModule.forFeature([
      TenantEntity,
      TenantMembershipEntity,
      TenantDomainEntity,
    ]),
  ],
  controllers: [TenantController],
  providers: [
    ...TENANT_HANDLERS,
    {
      provide: TENANT_REPOSITORY,
      useClass: TypeOrmTenantRepository,
    },
    {
      provide: TENANT_MEMBERSHIP_REPOSITORY,
      useClass: TypeOrmTenantMembershipRepository,
    },
    {
      provide: TENANT_DOMAIN_REPOSITORY,
      useClass: TypeOrmTenantDomainRepository,
    },
    TenantGuard,
  ],
  exports: [
    TENANT_REPOSITORY,
    TENANT_MEMBERSHIP_REPOSITORY,
    TENANT_DOMAIN_REPOSITORY,
    TenantGuard,
  ],
})
export class TenantModule {}
