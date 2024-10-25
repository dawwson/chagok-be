import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { expenseCategories, testBudgets, testUsers } from '@test/util/data';

const API_URL = '/budgets';

describe(`GET ${API_URL}`, () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await setupDatabase(dataSource);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/{year}/{month}', () => {
    describe('로그인 전 :', () => {
      test('로그인 전 : (401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).get(`${API_URL}/2024/10`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
      });

      test('(200) 예산 조회 성공 : 해당 연도/월에 예산이 있는 경우', async () => {
        // given
        const testBudget = testBudgets[0];

        // when
        const res = await agent.get(`${API_URL}/${testBudget.year}/${testBudget.month}`);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: testBudget.id,
          year: testBudget.year,
          month: testBudget.month,
          budgets: expect.any(Array<{ categoryId: number; categoryName: string; amount: number }>),
        });
        expect(res.body.data.budgets).toHaveLength(expenseCategories.length);
      });

      test('(200) 예산 조회 성공 : 해당 연도/월에 예산이 없는 경우', async () => {
        // given
        const testYear = 2000;
        const testMonth = 1;

        // when
        const res = await agent.get(`${API_URL}/${testYear}/${testMonth}`);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: null,
          year: testYear,
          month: testMonth,
          budgets: expect.any(Array<{ categoryId: number; categoryName: string; amount: number }>),
        });
        expect(res.body.data.budgets).toHaveLength(expenseCategories.length);
        res.body.data.budgets.forEach((b) => expect(b.amount).toBe(0));
      });
    });
  });

  describe('/{year}/{month}/recommendation', () => {
    describe('로그인 전 :', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).get(`${API_URL}/2024/10/recommendation`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
      });

      test('(200) 예산 추천 성공 : 직전 6개월 동안에 등록된 예산이 없는 경우', async () => {
        // given
        const testBudget = testBudgets[0];

        const oneYearLater = dayjs(`${testBudget.year}-${testBudget.month}-01`).add(1, 'year');
        const testYear = oneYearLater.year();
        const testMonth = oneYearLater.month() + 1;

        // when
        const res = await agent
          .get(`${API_URL}/${testYear}/${testMonth}/recommendation`)
          .query({ totalAmount: 1000000 });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          year: testYear,
          month: testMonth,
          budgets: [],
        });
      });

      test('(200) 예산 추천 성공 : 직전 6개월 동안에 등록된 예산이 있는 경우', async () => {
        // given
        const testBudget = testBudgets[0];

        const oneMonthLater = dayjs(`${testBudget.year}-${testBudget.month}-01`).add(1, 'month');
        const testYear = oneMonthLater.year();
        const testMonth = oneMonthLater.month() + 1;

        // when
        const res = await agent
          .get(`${API_URL}/${testYear}/${testMonth}/recommendation`)
          .query({ totalAmount: 1000000 });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          year: testYear,
          month: testMonth,
          budgets: expect.any(Array<{ categoryId: number; categoryName: string; amount: number }>),
        });
        expect(res.body.data.budgets).toHaveLength(expenseCategories.length);
      });
    });
  });
});
