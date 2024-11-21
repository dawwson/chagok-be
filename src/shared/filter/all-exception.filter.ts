import { ArgumentsHost, Catch, ExceptionFilter as NestExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements NestExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(500).json({
      path: `${req.method} ${req.url}`,
      errorCode: 'INTERNAL_SERVER_ERROR',
      detail: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
