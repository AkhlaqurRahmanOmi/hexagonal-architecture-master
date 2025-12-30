import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';

/**
 * Logger Module
 * Provides Winston logger throughout the application.
 */
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule],
})
export class LoggerModule {}
