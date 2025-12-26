import { Module } from '@nestjs/common';
import { CreateUserUseCase, DeleteUserUseCase, GetUserUseCase, ListUsersUseCase, UpdateUserUseCase } from './application/use-cases';
import { USER_REPOSITORY } from './application/ports';
import { InMemoryUserRepository } from './infrastructure/adapaters/in-memory-user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    }
  ]
})
export class UserModule {}
