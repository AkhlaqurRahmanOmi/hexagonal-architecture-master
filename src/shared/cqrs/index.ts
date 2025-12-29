// Export the shared CQRS module
export * from './cqrs.module';

// Export base interfaces
export * from './interfaces';

// Re-export commonly used CQRS decorators and classes from @nestjs/cqrs
// This makes them easily accessible from a single import point
export {
    CommandBus,
    QueryBus,
    EventBus,
    CommandHandler,
    QueryHandler,
    EventsHandler,
    ICommandHandler,
    IQueryHandler,
    IEventHandler,
} from '@nestjs/cqrs';
