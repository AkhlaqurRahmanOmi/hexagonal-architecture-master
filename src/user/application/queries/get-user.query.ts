import { IQuery } from '../../../shared/cqrs';
import { User } from '../../domain/entities';

/**
 * Query to get a single user by ID
 * Returns a User domain entity
 */
export class GetUserQuery implements IQuery<User> {
    constructor(public readonly id: string) { }
}
