import { Global, Module } from '@nestjs/common';
import { SharedCqrsModule } from './cqrs/cqrs.module';
import { ResponseBuilderService } from './services/response-builder.service';
import { TraceIdService } from './services/trace-id.service';

/**
 * Shared module for cross-cutting concerns.
 * Kept global to reduce repetitive imports.
 */
@Global()
@Module({
  imports: [SharedCqrsModule],
  providers: [ResponseBuilderService, TraceIdService],
  exports: [SharedCqrsModule, ResponseBuilderService, TraceIdService],
})
export class SharedModule {}
