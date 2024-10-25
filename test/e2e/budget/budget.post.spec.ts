import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testBudgets, testCategories, testUsers } from '@test/util/data';

import { TxType } from '@src/shared/enum/tx-type.enum';

const API_URL = '/budgets';

describe(`POST ${API_URL}`, () => {
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
        return request(app.getHttpServer()).post(`${API_URL}`).expect(401);
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

      test('(201) 예산 생성 성공', async () => {
        // given
        const testBudget = testBudgets[0];
        const oneMonthLater = dayjs(`${testBudget.year}/${testBudget.month}-01`).add(1, 'month');

        const year = oneMonthLater.year();
        const month = oneMonthLater.month() + 1;
        const budgets = testCategories
          .filter(({ type }) => type === TxType.EXPENSE)
          .map(({ id }) => ({ categoryId: id, amount: 1000 }));

        // when
        const res = await agent.post(`${API_URL}`).send({
          year,
          month,
          budgets,
        });

        // then
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual({
          id: expect.any(Number),
          year,
          month,
          totalAmount: budgets.reduce((acc, { amount }) => (acc += amount), 0),
          budgets,
        });
      });

      test('(400) 실패 : 예산의 총액이 서버에서 정의한 범위를 벗어남', async () => {
        // given
        const today = dayjs();
        const year = today.year();
        const month = today.month() + 1;

        const budgets = testCategories
          .filter(({ type }) => type === TxType.EXPENSE)
          .map(({ id }) => ({ categoryId: id, amount: 1000000000 }));

        // when
        const res = await agent.post(`${API_URL}`).send({
          year,
          month,
          budgets,
        });

        // then
        expect(res.status).toBe(400);
      });

      test('(404) 실패 : categoryId가 지출 카테고리가 아닌 경우', async () => {
        // given
        const today = dayjs();
        const year = today.year();
        const month = today.month() + 1;
        const budgets = testCategories
          .filter(({ type }) => type === TxType.EXPENSE)
          .map(({ id }) => ({ categoryId: id, amount: 1000 }));

        // 유효하지 않은 categoryId로 변경
        budgets[0].categoryId = 9999;

        // when
        const res = await agent.post(`${API_URL}`).send({
          year,
          month,
          budgets,
        });

        // then
        expect(res.status).toBe(404);
      });

      test('(409) 실패 : 이미 등록된 예산', async () => {
        // given
        const year = testBudgets[0].year;
        const month = testBudgets[0].month;
        const budgets = testCategories
          .filter(({ type }) => type === TxType.EXPENSE)
          .map(({ id }) => ({ categoryId: id, amount: 1000 }));

        // when
        const res = await agent.post(`${API_URL}`).send({
          year,
          month,
          budgets,
        });

        // then
        expect(res.status).toBe(409);
      });
    });
  });
});
