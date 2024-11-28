import { LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const LOG_DIR = `${process.cwd()}/logs`;

// TODO: cls-rtracer로 request id를 넣어볼까?
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = this.createLogger(context);
  }

  private createLogger(context?: string) {
    const { combine, timestamp, printf, colorize } = winston.format;
    const environment = process.env.NODE_ENV;

    const logger = winston.createLogger({
      level: 'info', // 기본 로그 레벨 설정
      format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // ISO 8601 형식
        printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

          return `${timestamp} APP[${context}]: ${level.toUpperCase()}: ${message}${metaString}`;
        }),
      ),
      transports: [
        new winstonDaily({
          level: 'info', // error, warn, info
          datePattern: 'YYYY-MM-DD',
          dirname: LOG_DIR,
          filename: '%DATE%.log',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
        }),
        new winstonDaily({
          level: 'error', // error
          datePattern: 'YYYY-MM-DD',
          dirname: LOG_DIR + '/error',
          filename: '%DATE%.error.log',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
        }),
      ],
    });

    if (environment !== 'prod') {
      logger.add(
        new winston.transports.Console({
          format: combine(
            timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // ISO 8601 형식
            printf((info) => {
              const { timestamp, level, message, ...meta } = info;
              const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

              return `${timestamp} [${context}]: ${level.toUpperCase()}: ${message}${metaString}`;
            }),
            colorize({ all: true }),
          ),
        }),
      );
    }

    return logger;
  }

  // level 0 : error
  error(message: string, meta?: Record<string, any>): void {
    this.logger.error(message, meta);
  }

  // level 1 : warn
  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  // level 2 : info
  log(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  // level 5 : debug
  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }
}
