import { LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const LOG_DIR = `${process.cwd()}/logs`;

// TODO: cls-rtracer로 request id를 넣어볼까?
// https://velog.io/@hopsprings2/Node.js-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98%EC%97%90%EC%84%9C-Request-ID-%EC%B6%94%EC%A0%81%ED%95%98%EA%B8%B0
// 없으면 공란이나 anonymous

export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = this.createLogger(context);
  }

  private createLogger(context?: string) {
    const { combine, timestamp, printf, colorize, simple } = winston.format;
    const environment = process.env.NODE_ENV;

    const logger = winston.createLogger({
      level: 'info', // 기본 로그 레벨 설정
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, level, message }) =>
          JSON.stringify({
            timestamp,
            level,
            context,
            requestId: 'some request id',
            detail: typeof message === 'string' ? message : JSON.stringify(message),
          }),
        ),
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
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            colorize({ all: true }),
            // simple(),
            printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}] ${context ? `[${context}]` : ''}:\n${message}`,
            ),
          ),
        }),
      );
    }

    return logger;
  }

  // level 0 : error
  error(message: any, trace?: string): void {
    this.logger.error(message, { trace });
  }

  // level 1 : warn
  warn(message: any): void {
    this.logger.warn(message);
  }

  // level 2 : info
  log(message: any): void {
    this.logger.info(message);
  }

  // level 5 : debug
  debug(message: any): void {
    this.logger.debug(message);
  }
}
