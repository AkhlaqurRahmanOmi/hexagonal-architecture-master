import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { USER_REPOSITORY } from './application/ports';
import { USER_HANDLERS } from './application/user.handlers';
import { TypeOrmUserRepository } from './infrastructure/adapaters/typeorm-user.repository';
import { UserEntity } from './infrastructure/adapaters/user.orm-entity';
import { UserController } from './presentation/user.controller';

/**
 * User Module with CQRS Pattern
 */
@Module({
  imports: [
    SharedCqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [
    ...USER_HANDLERS,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    }
  ]
})
export class UserModule { }
