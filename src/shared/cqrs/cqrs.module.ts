import { Module } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';

/**
 * Shared CQRS Module
 * Re-exports NestJS CQRS module for use across all feature modules
 * Any module that uses CQRS should import this module
 */
@Module({
    imports: [NestCqrsModule],
    exports: [NestCqrsModule],
})
export class SharedCqrsModule { }
