import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import { GetUserQuery } from '../queries';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';
import { User } from '../../domain/entities';

/**
 * Handler for GetUserQuery
 * Retrieves a single user by ID
 */
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, User> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(query: GetUserQuery): Promise<User> {
        const { id } = query;

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return user;
    }
}
