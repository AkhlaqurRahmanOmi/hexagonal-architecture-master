import {
  Injectable,
  NestMiddleware,
  Inject,
  Logger as NestLogger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly excludedPaths = ['/favicon.ico', '/health'];

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: NestLogger,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const traceId = (req as any).traceId || 'unknown';

    if (this.shouldSkipLogging(originalUrl)) {
      return next();
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress;
    const startTime = Date.now();
    const userAgent = req.headers['user-agent'] || 'Unknown';

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const logMessage = `[${traceId}] ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms - IP: ${ip} - User-Agent: ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }

  private shouldSkipLogging(url: string): boolean {
    return this.excludedPaths.some((path) => url.startsWith(path));
  }
}
