import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { clearDatabase, createTestApp, getRepository, setupDatabase } from '@test/utils/utils';
import { testTxs, testUsers } from '@test/utils/test-data';
import { Tx } from '@src/entity/tx.entity';

const API_URL = '/txs';

describe(`PUT ${API_URL}`, () => {
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

  describe('/{id}', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', () => {
        return request(app.getHttpServer()).put(`${API_URL}/123`).expect(401);
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

      test('(200) 내역 수정 성공', async () => {
        // given
        const testTx = {
          ...testTxs[0],
          description: 'test',
        };

        // when
        const res = await agent.put(`${API_URL}/${testTx.id}`).send(testTx);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: testTx.id,
          categoryId: testTx.categoryId,
          txType: testTx.txType,
          txMethod: testTx.txMethod,
          amount: testTx.amount,
          date: testTx.date.toISOString(),
          description: testTx.description,
          isExcluded: testTx.isExcluded,
          updatedAt: expect.any(String),
        });

        const found = await getRepository(Tx).findOneBy({ id: res.body.data.id });
        expect(found.description).toBe(testTx.description);
      });

      test('(403) 존재하지 않거나 접근 권한이 없음', async () => {
        // given
        const notOwnTx = testTxs[1]; // 사용자 2의 내역

        // when
        const res = await agent.put(`${API_URL}/${notOwnTx.id}`).send(notOwnTx);

        // then
        expect(res.status).toBe(403);
      });

      test('(404) 존재하지 않는 categoryId', async () => {
        // given
        const invalidCategoryId = 9999;
        const testTx = {
          ...testTxs[0],
          categoryId: invalidCategoryId,
        };

        // when
        const res = await agent.put(`${API_URL}/${testTx.id}`).send(testTx);

        // then
        expect(res.status).toBe(404);
      });
    });
  });
});
