import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { User } from '@src/entity/user.entity';
import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { testUsers } from '@test/util/data';

const API_URL = '/auth';

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

  describe('/sign-up', () => {
    test('(201) 회원 가입 성공', async () => {
      // given
      const user = {
        email: 'new@email.com',
        password: 'new_password',
        nickname: 'new_user',
      };

      // when
      const res = await request(app.getHttpServer()) //
        .post(`${API_URL}/sign-up`)
        .send({
          email: user.email,
          password: user.password,
          nickname: user.nickname,
        });

      // then
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        data: {
          id: expect.any(String),
          email: user.email,
          nickname: user.nickname,
        },
      });

      const found = await dataSource.getRepository(User).findOneBy({ id: res.body.data.id });
      expect(found).toEqual({
        id: res.body.data.id,
        email: user.email,
        password: expect.any(String),
        nickname: user.nickname,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test('(409) 회원가입 실패: 이미 사용 중인 이메일', async () => {
      // given
      const user = {
        email: testUsers[0].email,
        password: 'new_password',
        nickname: 'new_user',
      };

      // when
      const res = await request(app.getHttpServer()) //
        .post(`${API_URL}/sign-up`)
        .send({
          email: user.email,
          password: user.password,
          nickname: user.nickname,
        });

      // then
      expect(res.status).toBe(409);
    });
  });

  describe('/sign-in', () => {
    test('(200) 사용자1로 로그인 성공', async () => {
      // given
      const user = testUsers[0];

      // when
      const res = await request(app.getHttpServer()) //
        .post(`${API_URL}/sign-in`)
        .send({
          email: user.email,
          password: user.password,
        });

      // then
      expect(res.status).toBe(200);
      expect(res.get('Set-Cookie')[0]).toContain('accessToken=');
      expect(res.body).toEqual({
        data: {
          id: user.id,
          nickname: user.nickname,
        },
      });
    });

    test('(401) 로그인 실패: 존재하지 않는 이메일', async () => {
      // given
      const user = {
        email: 'fail@email.com',
        password: testUsers[0].password,
      };

      // when
      const res = await request(app.getHttpServer()) //
        .post(`${API_URL}/sign-in`)
        .send({
          email: user.email,
          password: user.password,
        });

      // then
      expect(res.status).toBe(401);
    });

    test('(401) 로그인 실패: 비밀번호 불일치', async () => {
      // given
      const user = {
        email: testUsers[0].email,
        password: 'wrong_password',
      };

      // when
      const res = await request(app.getHttpServer()) //
        .post(`${API_URL}/sign-in`)
        .send({
          email: user.email,
          password: user.password,
        });

      // then
      expect(res.status).toBe(401);
    });
  });

  describe('/sign-out', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).post(`${API_URL}/sign-out`).expect(401);
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

      test('(204) 로그아웃 성공', async () => {
        // given

        // when
        const res = await agent.post(`${API_URL}/sign-out`);

        // then
        expect(res.status).toBe(204);
        expect(res.get('Set-Cookie')[0]).toBe('accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      });
    });
  });
});
