import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { LeadController } from './presentation/lead.controller';
import { LEAD_HANDLERS } from './application/handlers/lead.handlers';
import { LEAD_REPOSITORY } from './application/ports';
import { TypeOrmLeadRepository } from './infrastructure/adapters/typeorm-lead.repository';
import { LeadEntity } from './infrastructure/adapters/lead.orm-entity';
import { ActivityModule } from '../activity/activity.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    SharedCqrsModule,
    ActivityModule,
    TenantModule,
    TypeOrmModule.forFeature([LeadEntity]),
  ],
  controllers: [LeadController],
  providers: [
    ...LEAD_HANDLERS,
    {
      provide: LEAD_REPOSITORY,
      useClass: TypeOrmLeadRepository,
    },
  ],
})
export class LeadModule {}
