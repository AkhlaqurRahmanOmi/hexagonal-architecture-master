import { IQuery } from '../../shared/cqrs';
import { User } from '../domain/entities';

/**
 * Query to get a single user by ID
 */
export class GetUserQuery implements IQuery<User> {
    constructor(public readonly id: string) { }
}

/**
 * Query to get all users
 */
export class ListUsersQuery implements IQuery<User[]> {
    constructor() { }
}
