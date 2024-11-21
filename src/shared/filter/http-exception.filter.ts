import { ArgumentsHost, Catch, ExceptionFilter as NestExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from '../constant/error-message.constant';

interface HttpExceptionResponse {
  message: string[] | string;
  error: string;
  statusCode: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements NestExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const { message } = <HttpExceptionResponse>exception.getResponse();
    const extracted = Array.isArray(message) ? message[0].split('.').at(-1) : message;

    const path = `${req.method} ${req.url}`;
    const timestamp = new Date().toISOString();
    let errorCode = '';
    let detail = '';

    const isDefinedError = Object.keys(ErrorMessage).includes(extracted);

    if (isDefinedError) {
      errorCode = extracted;
      detail = ErrorMessage[errorCode];
    } else {
      errorCode = status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'UNKNOWN_ERROR';
      detail = extracted;
    }

    res.status(status).json({
      path,
      errorCode,
      detail,
      timestamp,
    });
  }
}
