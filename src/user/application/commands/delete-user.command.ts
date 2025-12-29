import { ICommand } from '../../../shared/cqrs';

/**
 * Command to delete a user
 * Contains the ID of the user to delete
 */
export class DeleteUserCommand implements ICommand {
    constructor(public readonly id: string) { }
}
