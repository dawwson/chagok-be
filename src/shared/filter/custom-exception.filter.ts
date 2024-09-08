import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorMessage } from '../constant/error-message.constant';

interface HttpExceptionResponse {
  message: string[] | string;
  error: string;
  statusCode: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const { message } = <HttpExceptionResponse>exception.getResponse();
    const errorCode = Array.isArray(message) ? message[0].split('.').at(-1) : message;
    const detail = ErrorMessage[errorCode];

    if (status === 400) {
      res.status(status).json({
        path: `${req.method} ${req.url}`,
        errorCode: detail ? errorCode : 'BAD_REQUEST',
        detail: detail ?? errorCode,
        timestamp: new Date().toISOString(),
      });
    } else if (status >= 500) {
      res.status(status).json({
        path: `${req.method} ${req.url}`,
        errorCode: 'INTERNAL_SERVER_ERROR',
        detail: message,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(status).json({
        path: `${req.method} ${req.url}`,
        errorCode,
        detail,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
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

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
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
