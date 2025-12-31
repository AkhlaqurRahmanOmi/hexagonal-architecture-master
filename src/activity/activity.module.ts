import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { TenantModule } from '../tenant/tenant.module';
import { ActivityController } from './presentation/activity.controller';
import { ACTIVITY_HANDLERS } from './application/handlers/activity.handlers';
import { ACTIVITY_REPOSITORY } from './application/ports';
import { TypeOrmActivityRepository } from './infrastructure/adapters/typeorm-activity.repository';
import { ActivityEntity } from './infrastructure/adapters/activity.orm-entity';
import { NoteActivityEntity } from './infrastructure/adapters/note-activity.orm-entity';
import { CallActivityEntity } from './infrastructure/adapters/call-activity.orm-entity';
import { EmailActivityEntity } from './infrastructure/adapters/email-activity.orm-entity';
import { MeetingActivityEntity } from './infrastructure/adapters/meeting-activity.orm-entity';
import { SystemActivityEntity } from './infrastructure/adapters/system-activity.orm-entity';

@Module({
  imports: [
    SharedCqrsModule,
    TenantModule,
    TypeOrmModule.forFeature([
      ActivityEntity,
      NoteActivityEntity,
      CallActivityEntity,
      EmailActivityEntity,
      MeetingActivityEntity,
      SystemActivityEntity,
    ]),
  ],
  controllers: [ActivityController],
  providers: [
    ...ACTIVITY_HANDLERS,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: TypeOrmActivityRepository,
    },
  ],
  exports: [ACTIVITY_REPOSITORY],
})
export class ActivityModule {}
