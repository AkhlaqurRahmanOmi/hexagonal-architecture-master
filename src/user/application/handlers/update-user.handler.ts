import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '../../../shared/cqrs';
import { UpdateUserCommand } from '../commands';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';
import { User } from '../../domain/entities';

/**
 * Handler for UpdateUserCommand
 * Implements the business logic for updating an existing user
 */
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: UpdateUserCommand): Promise<User> {
        const { id, name, email } = command;

        // Find the user
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update fields if provided
        if (name) {
            user.updateName(name);
        }

        if (email) {
            user.updateEmail(email);
        }

        // Save and return
        return this.userRepository.save(user);
    }
}
