import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from '../constant/error-message.constant';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    res.status(status).json({
      statusCode: status,
      path: req.url,
      code: exception.message,
      detail: ErrorMessage[exception.message],
      timestamp: new Date().toISOString(),
    });
  }
}
