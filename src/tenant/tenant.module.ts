import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { TenantController } from './presentation/tenant.controller';
import { TENANT_HANDLERS } from './application/handlers/tenant.handlers';
import {
  TENANT_REPOSITORY,
  TENANT_MEMBERSHIP_REPOSITORY,
} from './application/ports';
import { TypeOrmTenantRepository } from './infrastructure/adapters/typeorm-tenant.repository';
import { TypeOrmTenantMembershipRepository } from './infrastructure/adapters/typeorm-tenant-membership.repository';
import { TenantEntity } from './infrastructure/adapters/tenant.orm-entity';
import { TenantMembershipEntity } from './infrastructure/adapters/tenant-membership.orm-entity';
import { TenantGuard } from './guards/tenant.guard';

@Module({
  imports: [
    SharedCqrsModule,
    TypeOrmModule.forFeature([TenantEntity, TenantMembershipEntity]),
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
    TenantGuard,
  ],
  exports: [TENANT_REPOSITORY, TENANT_MEMBERSHIP_REPOSITORY, TenantGuard],
})
export class TenantModule {}
