import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '../../shared/cqrs';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from './user.commands';
import { GetUserQuery, ListUsersQuery } from './user.queries';
import { USER_REPOSITORY, UserRepositoryPort } from './ports';
import { User } from '../domain/entities';

/**
 * HANDLER: CreateUser
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: CreateUserCommand): Promise<User> {
        const { tenantId, name, email } = command;
        const existingUser = await this.userRepository.findByEmailGlobal(email);
        if (existingUser) throw new Error('User already exists');
        const user = User.create(name, email, tenantId);
        return this.userRepository.save(user);
    }
}

/**
 * HANDLER: UpdateUser
 */
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: UpdateUserCommand): Promise<User> {
        const { tenantId, id, name, email } = command;
        const user = await this.userRepository.findById(tenantId, id);
        if (!user) throw new NotFoundException('User not found');
        if (name) user.updateName(name);
        if (email) user.updateEmail(email);
        return this.userRepository.save(user);
    }
}

/**
 * HANDLER: DeleteUser
 */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, void> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: DeleteUserCommand): Promise<void> {
        await this.userRepository.delete(command.tenantId, command.id);
    }
}

/**
 * HANDLER: GetUser
 */
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(query: GetUserQuery): Promise<User> {
        const user = await this.userRepository.findById(query.tenantId, query.id);
        if (!user) throw new NotFoundException('User not found.');
        return user;
    }
}

/**
 * HANDLER: ListUsers
 */
@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, User[]> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(query: ListUsersQuery): Promise<User[]> {
        return this.userRepository.findAll(query.tenantId);
    }
}

/**
 * All User CQRS Handlers for registration
 */
export const USER_HANDLERS = [
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    GetUserHandler,
    ListUsersHandler,
];
