import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as dayjs from 'dayjs';

import { clearDatabase, createTestApp, setupDatabase } from '@test/utils/utils';
import { testTxs, testUsers } from '@test/utils/test-data';

const API_URL = '/txs';

describe(`GET ${API_URL}`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupDatabase();
    app = await createTestApp();
  });

  afterEach(async () => {
    clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).get(`${API_URL}`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            email: currentUser.email,
            password: currentUser.password,
          })
          .expect(200);

        agent = request.agent(app.getHttpServer());
        agent.set('Cookie', res.get('Set-Cookie'));
      });

      test('(200) 내역 목록 조회 성공', async () => {
        // given
        const testTx = testTxs[0]; // 사용자 1의 내역
        const startDate = dayjs(testTx.date).startOf('day').toISOString();
        const endDate = dayjs(testTx.date).endOf('day').toISOString();

        // when
        const res = await agent.get(`${API_URL}`).query({
          startDate,
          endDate,
        });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]).toEqual({
          id: testTx.id,
          categoryName: expect.any(String),
          txType: testTx.txType,
          txMethod: testTx.txMethod,
          amount: testTx.amount,
          date: testTx.date.toISOString(),
        });
      });
    });
  });

  describe('/sum', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', () => {
        return request(app.getHttpServer()).get(`${API_URL}/sum`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            email: currentUser.email,
            password: currentUser.password,
          })
          .expect(200);

        agent = request.agent(app.getHttpServer());
        agent.set('Cookie', res.get('Set-Cookie'));
      });

      test('(200) 내역 합계 조회 성공', async () => {
        // given
        const testTx = testTxs[0]; // 사용자 1의 내역
        const startDate = dayjs(testTx.date).startOf('day').toISOString();
        const endDate = dayjs(testTx.date).endOf('day').toISOString();

        // when
        const res = await agent.get(`${API_URL}/sum`).query({
          startDate,
          endDate,
        });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          totalIncome: expect.any(Number),
          totalExpense: expect.any(Number),
        });
      });
    });
  });

  describe('/{id}', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', () => {
        return request(app.getHttpServer()).get(`${API_URL}/123`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            email: currentUser.email,
            password: currentUser.password,
          })
          .expect(200);

        agent = request.agent(app.getHttpServer());
        agent.set('Cookie', res.get('Set-Cookie'));
      });

      test('(200) 내역 상세 조회 성공', async () => {
        // given
        const testTx = testTxs[0]; // 사용자 1의 내역

        // when
        const res = await agent.get(`${API_URL}/${testTx.id}`);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: testTx.id,
          categoryId: testTx.categoryId,
          txType: testTx.txType,
          txMethod: testTx.txMethod,
          amount: testTx.amount,
          date: testTx.date.toISOString(),
          description: testTx?.description ?? '',
          isExcluded: testTx.isExcluded,
        });
      });

      test('(403) 내역 상세 조회 실패 - 존재하지 않거나 접근 권한이 없음', async () => {
        // given
        const notOwnTx = testTxs[1]; // 사용자 2의 내역

        // when
        const res = await agent.get(`${API_URL}/${notOwnTx.id}`);

        // then
        expect(res.status).toBe(403);
      });
    });
  });
});
