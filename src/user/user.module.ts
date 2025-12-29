import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { USER_REPOSITORY } from './application/ports';
import {
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  GetUserHandler,
  ListUsersHandler,
} from './application/handlers';
import { TypeOrmUserRepository } from './infrastructure/adapaters/typeorm-user.repository';
import { UserEntity } from './infrastructure/adapaters/user.orm-entity';

import { UserController } from './presentation/user.controller';

/**
 * User Module with CQRS Pattern
 * Imports SharedCqrsModule to use CommandBus and QueryBus
 * Registers all command and query handlers
 */
@Module({
  imports: [
    SharedCqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [
    // Command Handlers
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,

    // Query Handlers
    GetUserHandler,
    ListUsersHandler,

    // Repository
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    }
  ]
})
export class UserModule { }
