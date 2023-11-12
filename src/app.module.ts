import { APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import * as path from 'path';

import dbConfig from './config/db.config';
import serverConfig from './config/server.config';
import { NodeEnv } from './shared/enum/node-env.enum';
import { IDbConfig } from './shared/interface/db-config.interface';
import { IServerConfig } from './shared/interface/server-config.interface';

import { AuthModule } from './api/auth/auth.module';
import { CategoryModule } from './api/category/category.module';
import { BudgetModule } from './api/budget/budget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.development.env', '.stage.env', '.production.env'],
      load: [dbConfig, serverConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serverConfig = configService.get<IServerConfig>('server');
        const dbConfig = configService.get<IDbConfig>('db');

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
          timezone: 'Asia/Seoul',
        };
      },
    }),
    AuthModule,
    CategoryModule,
    BudgetModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true, // DTO 클래스로 자동 형변환
          whitelist: true, //DTO 클래스에 없는 속성 제거
        }),
    },
  ],
})
export class AppModule {}
