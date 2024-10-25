import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { expenseCategories, testBudgets, testUsers } from '@test/util/data';

import { ErrorCode } from '@src/shared/enum/error-code.enum';

const API_URL = '/budgets';

describe(`PUT ${API_URL}`, () => {
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

  describe('/', () => {
    describe('로그인 전 :', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        // given
        const testBudget = testBudgets[0];

        // when
        const res = await request(app.getHttpServer()).put(`${API_URL}/${testBudget.id}`);

        // then
        expect(res.status).toBe(401);
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

      test('(201) 예산 수정 성공', async () => {
        // given
        const testBudget = testBudgets[0];
        const budgetsToUpdate = expenseCategories.map((c, index) => ({ categoryId: c.id, amount: index }));

        // when
        const res = await agent.put(`${API_URL}/${testBudget.id}`).send({
          budgets: budgetsToUpdate,
        });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: expect.any(Number),
          year: testBudget.year,
          month: testBudget.month,
          totalAmount: budgetsToUpdate.reduce((acc, { amount }) => (acc += amount), 0),
          budgets: budgetsToUpdate,
          updatedAt: expect.any(String),
        });
        expect(res.body.data.budgets).toHaveLength(expenseCategories.length);
      });

      test('(400) 실패 : 예산의 총액이 서버에서 정의한 범위를 벗어남', async () => {
        // given
        const testBudget = testBudgets[0];
        const budgetsToUpdate = expenseCategories.map((c) => ({ categoryId: c.id, amount: 1000000000 }));

        // when
        const res = await agent.put(`${API_URL}/${testBudget.id}`).send({
          budgets: budgetsToUpdate,
        });

        // then
        expect(res.status).toBe(400);
        expect(res.body.errorCode).toBe(ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE);
      });

      test('(404) 실패 : categoryId가 지출 카테고리가 아닌 경우', async () => {
        // given
        const testBudget = testBudgets[0];

        // 유효하지 않은 categoryId로 변경
        const budgetsToUpdate = expenseCategories.map((c) => ({ categoryId: c.id, amount: 100000 }));
        budgetsToUpdate[0].categoryId = 9999;

        // when
        const res = await agent.put(`${API_URL}/${testBudget.id}`).send({
          budgets: budgetsToUpdate,
        });

        // then
        expect(res.status).toBe(404);
        expect(res.body.errorCode).toBe(ErrorCode.CATEGORY_NOT_FOUND);
      });
    });
  });
});
