import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '../../../shared/cqrs';
import { DeleteUserCommand } from '../commands';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';

/**
 * Handler for DeleteUserCommand
 * Implements the business logic for deleting a user
 */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, void> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: DeleteUserCommand): Promise<void> {
        const { id } = command;
        await this.userRepository.delete(id);
    }
}
