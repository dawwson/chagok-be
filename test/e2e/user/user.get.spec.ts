import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testUsers } from '@test/util/data';

const API_URL = '/users';

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
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
      });

      test('(200) 사용자 조회 성공', async () => {
        // given

        // when
        const res = await agent.get(`${API_URL}`);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: currentUser.id,
          email: currentUser.email,
          nickname: currentUser.nickname,
        });
      });
    });
  });
});
