import { ArgumentsHost, Catch, ExceptionFilter as NestExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { ErrorMessage } from '../constant/error-message.constant';
import { LoggerService } from '../../logger/logger.service';
import { RequestWithUser } from '../interface/request.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements NestExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithUser>();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;

    const isDefinedError = Object.keys(ErrorMessage).includes(message);

    const path = `${req.method} ${req.url}`;
    const timestamp = new Date().toISOString();
    let errorCode = '';
    let detail = '';

    if (isDefinedError) {
      errorCode = message;
      detail = ErrorMessage[errorCode];
    } else {
      errorCode = status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'UNDEFINED_ERROR';
      detail = message;
    }

    res.status(status).json({
      path,
      errorCode,
      detail,
      timestamp,
    });

    const log = {
      method: req.method,
      url: req.url,
      userId: req?.user?.id || 'anonymous',
      status,
    };

    status >= 500
      ? this.logger.error(message, { ...log, trace: exception.stack }) //
      : this.logger.warn(message, log);
  }
}
