import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testUsers } from '@test/util/data';

const API_URL = '/txs';

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
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', () => {
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

      test('(201) 내역 생성 성공', async () => {
        // given
        const testTx = {
          txType: TxType.EXPENSE,
          txMethod: TxMethod.BANK_TRANSFER,
          amount: 3000,
          categoryId: 1,
          date: new Date().toISOString(),
          description: '붕어빵',
          isExcluded: false,
        };

        // when
        const res = await agent.post(`${API_URL}`).send(testTx);

        // then
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual({
          ...testTx,
          id: expect.any(Number),
          createdAt: expect.any(String),
        });

        const found = await dataSource.getRepository(Tx).findOneBy({ id: res.body.data.id });
        expect(found).toBeDefined();
      });

      test('(404) 존재하지 않는 categoryId', async () => {
        // given
        const invalidCategoryId = 9999;
        const testTx = {
          txType: TxType.EXPENSE,
          txMethod: TxMethod.BANK_TRANSFER,
          amount: 3000,
          categoryId: invalidCategoryId,
          date: new Date().toISOString(),
          description: '붕어빵',
          isExcluded: false,
        };

        // when
        const res = await agent.post(`${API_URL}`).send(testTx);

        // then
        expect(res.status).toBe(404);
      });
    });
  });
});
