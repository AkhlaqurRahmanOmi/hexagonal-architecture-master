import { ICommand } from '../../shared/cqrs';

/**
 * Command to create a new user
 */
export class CreateUserCommand implements ICommand {
    constructor(
        public readonly tenantId: string,
        public readonly name: string,
        public readonly email: string,
    ) { }
}

/**
 * Command to update an existing user
 */
export class UpdateUserCommand implements ICommand {
    constructor(
        public readonly tenantId: string,
        public readonly id: string,
        public readonly name?: string,
        public readonly email?: string,
    ) { }
}

/**
 * Command to delete a user
 */
export class DeleteUserCommand implements ICommand {
    constructor(
        public readonly tenantId: string,
        public readonly id: string,
    ) { }
}
