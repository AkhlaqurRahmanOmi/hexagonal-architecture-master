import { ICommand } from '../../../shared/cqrs';

/**
 * Command to create a new user
 * Encapsulates all data needed to create a user
 */
export class CreateUserCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly email: string,
    ) { }
}
