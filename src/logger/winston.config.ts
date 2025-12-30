import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isProduction = process.env.NODE_ENV === 'production';

export const winstonConfig: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        winston.format.ms(),
        winston.format.padLevels(),
        winston.format.splat(),
        winston.format.json(),
        nestWinstonModuleUtilities.format.nestLike('HexagonalCRM', {
          prettyPrint: true,
          colors: true,
          appName: true,
          processId: false,
        }),
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        winston.format.errors({ stack: true }),
        winston.format.json({ space: 2 }),
      ),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, traceId, ...meta }) =>
          JSON.stringify(
            {
              timestamp,
              level,
              traceId,
              message,
              ...meta,
            },
            null,
            2,
          ),
        ),
      ),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, traceId, ...meta }) =>
          JSON.stringify(
            {
              timestamp,
              level,
              traceId,
              message,
              ...meta,
            },
            null,
            2,
          ),
        ),
      ),
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
  exitOnError: false,
};
