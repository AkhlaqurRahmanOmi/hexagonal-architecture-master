import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ICommand } from '../interfaces';
import { IQuery } from '../interfaces';

/**
 * Base class for Command Handlers to reduce repetition
 */
export abstract class BaseCommandHandler<TCommand extends ICommand, TResult = any> {

    abstract execute(command: TCommand): Promise<TResult>;
}

/**
 * Base class for Query Handlers to reduce repetition
 */
export abstract class BaseQueryHandler<TQuery extends IQuery, TResult = any> {

    abstract execute(query: TQuery): Promise<TResult>;
}
