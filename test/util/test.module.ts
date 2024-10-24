import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import * as path from 'path';

import { AuthModule } from '@src/api/auth/auth.module';
import { BudgetModule } from '@src/api/budget/budget.module';
import { CategoryModule } from '@src/api/category/category.module';
import { TxModule } from '@src/api/tx/tx.module';
import dbConfig from '@src/config/db.config';
import serverConfig from '@src/config/server.config';
import { AllExceptionFilter, HttpExceptionFilter } from '@src/shared/filter/custom-exception.filter';
import { TransformInterceptor } from '@src/shared/interceptor/transform.interceptor';
import { DbConfig } from '@src/shared/interface/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.test'],
      load: [dbConfig, serverConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DbConfig>('db');

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          entities: [path.join(__dirname, '/../../src/**/*.entity{.ts,.js}')],
          namingStrategy: new SnakeNamingStrategy(),
          // logging: true,
        };
      },
    }),
    AuthModule,
    BudgetModule,
    CategoryModule,
    TxModule,
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
export class TestModule {}
