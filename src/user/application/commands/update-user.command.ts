import { ICommand } from '../../../shared/cqrs';

/**
 * Command to update an existing user
 * Contains the user ID and optional fields to update
 */
export class UpdateUserCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly email?: string,
    ) { }
}
