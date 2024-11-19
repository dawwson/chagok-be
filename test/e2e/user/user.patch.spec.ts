import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testUsers } from '@test/util/data';
import { User } from '@src/entity/user.entity';

const API_URL = '/users';

describe(`PATCH ${API_URL}`, () => {
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

  describe('/profile', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).patch(`${API_URL}/profile`).expect(401);
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

      test('(200) 사용자 프로필 수정 성공', async () => {
        // given
        const newProfile = {
          nickname: 'new_nickname',
        };

        // when
        const res = await agent.patch(`${API_URL}/profile`).send(newProfile);

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
          id: currentUser.id,
          email: currentUser.email,
          ...newProfile,
        });
      });
    });
  });

  describe('/password', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).patch(`${API_URL}/password`).expect(401);
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

      test('(204) 사용자 비밀번호 수정 성공', async () => {
        // given
        const oldPassword = currentUser.password;
        const newPassword = 'new_password';

        // when
        const res = await agent.patch(`${API_URL}/password`).send({
          oldPassword,
          newPassword,
        });

        // then
        expect(res.status).toBe(204);

        const found = await dataSource.getRepository(User).findOneBy({ id: currentUser.id });
        expect(found.password.startsWith('$2b$')).toBe(true);
      });

      test('(401) 실패 : 이전 비밀번호 불일치', async () => {
        // given
        const oldPassword = 'wrong_password';
        const newPassword = 'new_password';

        // when
        const res = await agent.patch(`${API_URL}/password`).send({
          oldPassword,
          newPassword,
        });

        // then
        expect(res.status).toBe(401);
      });
    });
  });
});
