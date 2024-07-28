import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';
import {
  testCategories,
  testExpenses,
} from '../../in-memory-testing/test-data';
import { getUser1Agent } from '../../../test/get-agent';

describe('/expenses (PATCH)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await setupTestData(dataSource);
  });

  describe('PATCH /expenses/{id}', () => {
    test('지출 수정 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);

      const testExpense = testExpenses[0];
      const testRequestBody = {
        categoryId: testCategories[0].id,
        content: '떡볶이',
        amount: 14000,
        expenseDate: new Date().toISOString(),
      };

      // when
      const res = await agent
        .patch(`/expenses/${testExpense.id}`)
        .send(testRequestBody)
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          id: testExpense.id,
          categoryId: testRequestBody.categoryId,
          content: testRequestBody.content,
          amount: testRequestBody.amount,
          expenseDate: testRequestBody.expenseDate,
          isExcluded: false,
          updatedAt: expect.any(String),
        },
      });
    });

    test('지출 수정 실패(400) - 유효하지 않은 categoryId', async () => {
      // given
      const agent = await getUser1Agent(app);
      const testExpense = testExpenses[0];
      const invalidCategoryId = 9999;

      const testRequestBody = {
        categoryId: invalidCategoryId,
        content: '떡볶이',
        amount: 14000,
        expenseDate: new Date(),
      };

      // when
      await agent
        .patch(`/expenses/${testExpense.id}`)
        .send(testRequestBody)
        // then
        .expect(400);
    });
  });

  describe('PATCH /expenses/{id}', () => {
    test('지출 수정 실패(404) - 리소스가 존재하지 않거나 접근 권한이 없음', async () => {
      // given
      const agent = await getUser1Agent(app);
      const notMyExpense = testExpenses[2];

      const testRequestBody = {
        categoryId: notMyExpense.id,
        content: '떡볶이',
        amount: 14000,
        expenseDate: new Date().toISOString(),
      };

      // when
      await agent
        .patch('/expenses')
        .send(testRequestBody)
        // then
        .expect(404);
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
