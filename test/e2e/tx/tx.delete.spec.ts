import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { clearDatabase, createTestApp, getRepository, setupDatabase } from '@test/utils/utils';
import { testTxs, testUsers } from '@test/utils/test-data';
import { Tx } from '@src/entity/tx.entity';

const API_URL = '/txs';

describe(`DELETE ${API_URL}`, () => {
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
        return request(app.getHttpServer()).delete(`${API_URL}/123`).expect(401);
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

      test('(204) 내역 삭제 성공', async () => {
        // given
        const testTx = testTxs[0];

        // when
        const res = await agent.delete(`${API_URL}/${testTx.id}`).send();

        // then
        expect(res.status).toBe(204);
        expect(res.body).toEqual({});

        const found = await getRepository(Tx).findOneBy({ id: testTx.id });
        expect(found).toBeNull();
      });

      test('(403) 존재하지 않거나 접근 권한이 없음', async () => {
        // given
        const notOwnTx = testTxs[1]; // 사용자 2의 내역

        // when
        const res = await agent.delete(`${API_URL}/${notOwnTx.id}`).send();

        // then
        expect(res.status).toBe(403);
      });
    });
  });
});
