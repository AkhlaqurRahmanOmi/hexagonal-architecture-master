import { IQuery } from '../../../shared/cqrs';
import { User } from '../../domain/entities';

/**
 * Query to get all users
 * Returns an array of User domain entities
 */
export class ListUsersQuery implements IQuery<User[]> {
    constructor() { }
}
