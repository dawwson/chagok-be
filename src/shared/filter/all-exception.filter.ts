import { ArgumentsHost, Catch, ExceptionFilter as NestExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { LoggerService } from '../service/logger.service';
import { RequestWithUser } from '../interface/request.interface';

@Catch()
export class AllExceptionFilter implements NestExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithUser>();
    const res = ctx.getResponse<Response>();

    res.status(500).json({
      path: `${req.method} ${req.url}`,
      errorCode: 'INTERNAL_SERVER_ERROR',
      detail: exception.message,
      timestamp: new Date().toISOString(),
    });

    this.logger.error(exception.message, {
      method: req.method,
      url: req.url,
      userId: req?.user?.id || 'anonymous',
      status: res.status,
      trace: exception.stack,
    });
  }
}
