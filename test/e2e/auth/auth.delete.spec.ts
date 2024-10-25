import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { User } from '@src/entity/user.entity';
import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testUsers } from '@test/util/data';

const API_URL = '/auth';

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

  describe('/account', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).delete(`${API_URL}/account`).expect(401);
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

      test.skip('(204) 회원 탈퇴 성공', async () => {
        // given

        // when
        const res = await agent.delete(`${API_URL}/account`);

        // then
        expect(res.status).toBe(204);
        expect(res.get('Set-Cookie')[0]).toBe('accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

        const found = await dataSource.getRepository(User).findOne({ where: { id: currentUser.id } });
        expect(found).toBeNull();
      });
    });
  });
});
