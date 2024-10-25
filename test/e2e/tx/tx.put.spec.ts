import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { Tx } from '@src/entity/tx.entity';
import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testTxs, testUsers } from '@test/util/data';

const API_URL = '/txs';

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
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
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

        const found = await dataSource.getRepository(Tx).findOneBy({ id: res.body.data.id });
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
