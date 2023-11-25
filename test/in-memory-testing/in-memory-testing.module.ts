import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from '../../src/api/auth/auth.module';
import { CategoryModule } from '../../src/api/category/category.module';
import { BudgetModule } from '../../src/api/budget/budget.module';
import { ExpenseModule } from '../../src/api/expense/expense.module';
import dbConfig from '../../src/config/db.config';
import serverConfig from '../../src/config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.test.env'],
      load: [dbConfig, serverConfig],
      isGlobal: true,
    }),
    // NOTE: TypeORM DataSource를 프로바이더로 등록됩니다. 세부 옵션은 initialize-data-source.ts에서 설정합니다.
    TypeOrmModule.forRoot(),
    AuthModule,
    CategoryModule,
    BudgetModule,
    ExpenseModule,
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
export class InMemoryTestingModule {}
