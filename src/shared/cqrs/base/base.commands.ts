import { ICommand } from '../interfaces/command.interface';

/**
 * Generic base command for creating an entity
 */
export class CreateEntityCommand<T = any> implements ICommand {
    constructor(public readonly data: T) { }
}

/**
 * Generic base command for updating an entity
 */
export class UpdateEntityCommand<T = any> implements ICommand {
    constructor(
        public readonly id: string,
        public readonly data: Partial<T>,
    ) { }
}

/**
 * Generic base command for deleting an entity
 */
export class DeleteEntityCommand implements ICommand {
    constructor(public readonly id: string) { }
}
