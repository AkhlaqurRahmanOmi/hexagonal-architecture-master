import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import { ListUsersQuery } from '../queries';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';
import { User } from '../../domain/entities';

/**
 * Handler for ListUsersQuery
 * Retrieves all users from the repository
 */
@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, User[]> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(query: ListUsersQuery): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
