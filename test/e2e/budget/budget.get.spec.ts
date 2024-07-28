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

describe('/budgets (GET)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    dataSource = app.get(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    await setupTestData(dataSource);
  });

  describe('GET /budgets/{testYear}/{testMonth}/recommendation', () => {
    test('월별 예산 추천 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);

      const testYear = '2023';
      const testMonth = '11';
      const testTotalAmount = 1000000;

      // when
      const res = await agent
        .get(`/budgets/${testYear}/${testMonth}/recommendation`)
        .query({ totalAmount: testTotalAmount })
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          year: testYear,
          month: testMonth,
          budgetsByCategory: expect.any(Array),
        },
      });
      // 모든 카테고리에 대한 예산이 나오는지 확인
      expect(res.body.data.budgetsByCategory).toHaveLength(
        testCategories.length,
      );
      // 카테고리별 예산의 합이 설정한 총 예산과 일치하는지 확인
      expect(
        res.body.data.budgetsByCategory.reduce(
          (acc, { amount }) => (acc += amount),
          0,
        ),
      ).toBe(testTotalAmount);

      res.body.data.budgetsByCategory.forEach((budgetByCategory) => {
        expect(budgetByCategory).toEqual({
          categoryId: expect.any(Number),
          amount: expect.any(Number),
        });
      });
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
