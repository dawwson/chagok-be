import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';
import { testCategories } from '../../in-memory-testing/test-data';
import { getUser1Agent } from '../../../test/get-agent';

describe('/expenses (DELETE)', () => {
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

  describe('POST /expenses', () => {
    test('지출 생성 성공(201)', async () => {
      // given
      const agent = await getUser1Agent(app);
      const category = testCategories[0];

      const testRequestBody = {
        categoryId: category.id,
        content: '떡볶이',
        amount: 14000,
        expenseDate: new Date(),
      };

      // when
      const res = await agent
        .post('/expenses')
        .send(testRequestBody)
        .expect(201);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          id: expect.any(Number),
          categoryId: category.id,
          content: testRequestBody.content,
          amount: testRequestBody.amount,
          expenseDate: testRequestBody.expenseDate.toISOString(),
          isExcluded: false,
          createdAt: expect.any(String),
        },
      });
    });

    test('지출 생성 실패(400) - 유효하지 않은 categoryId', async () => {
      // given
      const agent = await getUser1Agent(app);
      const invalidCategoryId = 9999;

      const testRequestBody = {
        categoryId: invalidCategoryId,
        content: '떡볶이',
        amount: 14000,
        expenseDate: new Date(),
      };

      // when
      await agent
        .post('/expenses')
        .send(testRequestBody)
        // then
        .expect(400);
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
