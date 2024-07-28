import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { testCategories } from '../../in-memory-testing/test-data';
import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';

import { getUser1Agent } from '../../../test/get-agent';

describe('/budgets (PUT)', () => {
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

  describe('PUT /budgets/{year}/{month}', () => {
    test('월별 예산 설정 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);

      const testYear = '2023';
      const testMonth = '11';
      const testBudgetsByCategory = [
        {
          categoryId: testCategories[0].id,
          amount: 500000,
        },
        {
          categoryId: testCategories[1].id,
          amount: 2000000,
        },
      ];

      // when
      const res = await agent
        .put(`/budgets/${testYear}/${testMonth}`)
        .send({
          budgetsByCategory: testBudgetsByCategory,
        })
        .expect(200);

      // then
      expect(res.body).toHaveProperty('message', expect.any(String));
      expect(res.body.data).toEqual({
        id: expect.any(Number),
        year: testYear,
        month: testMonth,
        // NOTE: arrayContaining() -> 배열에 특정 배열을 포함하고 있는지 검사
        budgetsByCategory: expect.arrayContaining(testBudgetsByCategory),
      });
      // 모든 카테고리별 예산을 가지고 있는지 확인
      expect(res.body.data.budgetsByCategory).toHaveLength(
        testCategories.length,
      );
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
