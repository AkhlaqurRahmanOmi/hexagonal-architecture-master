import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '../../../shared/cqrs';
import { CreateUserCommand } from '../commands';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';
import { User } from '../../domain/entities';

/**
 * Handler for CreateUserCommand
 * Implements the business logic for creating a new user
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: CreateUserCommand): Promise<User> {
        const { name, email } = command;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create user using domain factory
        const user = User.create(name, email);

        // Save and return
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }
}
