import { LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

import { NodeEnv } from '../enum/node-env.enum';

const LOG_DIR = `${process.cwd()}/logs`;

// TODO: cls-rtracer로 request id를 넣어볼까?
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private env = process.env.NODE_ENV;

  constructor(context?: string) {
    this.logger = this.createLogger(context);
  }

  private createLogger(context?: string) {
    const { combine, timestamp, printf, colorize } = winston.format;

    return winston.createLogger({
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
        // 로그 파일 저장
        new winstonDaily({
          level: 'debug', // error, warn, info, debug
          datePattern: 'YYYY-MM-DD',
          dirname: LOG_DIR,
          filename: '%DATE%.log',
          maxSize: '20m', // 각 로그 파일의 최대 크기: 20MB
          maxFiles: '30d', // 30일 동안의 로그 파일만 유지
          zippedArchive: true, // maxSize 초과시 압축
          silent: this.env === NodeEnv.TEST,
        }),
        new winstonDaily({
          level: 'error', // error
          datePattern: 'YYYY-MM-DD',
          dirname: LOG_DIR + '/error',
          filename: '%DATE%.error.log',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
          silent: this.env === NodeEnv.TEST,
        }),
        // 로그 콘솔 출력
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
          silent: this.env !== NodeEnv.DEV, // dev 환경에서만 출력
        }),
      ],
    });
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
