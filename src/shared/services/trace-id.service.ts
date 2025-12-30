import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

/**
 * Service for generating and managing unique request trace IDs.
 */
@Injectable()
export class TraceIdService {
  /**
   * Generate a unique trace ID.
   */
  generate(): string {
    return randomUUID();
  }

  /**
   * Extract or generate trace ID from request headers.
   */
  getOrGenerate(headers: Record<string, any>): string {
    const existingTraceId = headers['x-trace-id'] || headers['X-Trace-Id'];
    return existingTraceId || this.generate();
  }
}
