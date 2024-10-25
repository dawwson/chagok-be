import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { Tx } from '@src/entity/tx.entity';
import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testTxs, testUsers } from '@test/util/data';

const API_URL = '/txs';

describe(`DELETE ${API_URL}`, () => {
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
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
      });

      test('(204) 내역 삭제 성공', async () => {
        // given
        const testTx = testTxs[0];

        // when
        const res = await agent.delete(`${API_URL}/${testTx.id}`).send();

        // then
        expect(res.status).toBe(204);
        expect(res.body).toEqual({});

        const found = await dataSource.getRepository(Tx).findOneBy({ id: testTx.id });
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
