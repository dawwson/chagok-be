import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import * as path from 'path';

import { AuthModule } from './api/auth/auth.module';
import { BudgetModule } from './api/budget/budget.module';
import { CategoryModule } from './api/category/category.module';
import { TxModule } from './api/tx/tx.module';
// import { StatModule } from './api/stat/stat.module';
// import { ExpenseModule } from './api/expense/expense.module';

import dbConfig from './config/db.config';
import serverConfig from './config/server.config';
import { NodeEnv } from './shared/enum/node-env.enum';
import { AllExceptionFilter, HttpExceptionFilter } from './shared/filter/custom-exception.filter';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';
import { DbConfig, ServerConfig } from './shared/interface/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.stage', '.env.prod'],
      load: [dbConfig, serverConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serverConfig = configService.get<ServerConfig>('server');
        const dbConfig = configService.get<DbConfig>('db');

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          entities: [path.join(__dirname, '/entity/*.entity{.ts,.js}')],
          logging: serverConfig.nodeEnv === NodeEnv.DEV,
          namingStrategy: new SnakeNamingStrategy(),
          // FIXME: RDS DB 접근 시 ssl 인증을 요구함.
          //        개발 단계에서는 ssl 검증을 생략할 수 있으나, 프로덕션 단계에서는 인증서를 쓰는 게 좋다.
          // ssl: { rejectUnauthorized: false },
        };
      },
    }),
    AuthModule,
    BudgetModule,
    CategoryModule,
    TxModule,
    // StatModule,
    // ExpenseModule, // TODO: 삭제
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true, // DTO 클래스로 자동 형변환
          whitelist: true, // DTO 클래스에 없는 속성 제거
        }),
    },
    // NOTE: 필터 우선순위는 역순!!
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
