import { IQuery } from '../interfaces/query.interface';

/**
 * Generic base query for getting an entity by ID
 */
export class GetByIdQuery implements IQuery {
    constructor(public readonly id: string) { }
}

/**
 * Generic base query for listing all entities
 */
export class ListAllQuery<TFilter = any> implements IQuery {
    constructor(public readonly filter?: TFilter) { }
}
