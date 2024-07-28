import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { testUsers } from '../../in-memory-testing/test-data';
import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';

describe('/auth (POST)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await setupTestData(dataSource);
  });

  describe('POST /auth/sign-up', () => {
    test('회원가입 성공', async () => {
      // given
      const testUserInfo = {
        email: 'success@gmail.com',
        password: 'test_password',
      };

      // when
      const res = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo)
        .expect(201);

      // then
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          id: expect.any(String),
          email: testUserInfo.email,
        },
      });
    });

    test('회원가입 실패 - 이미 존재하는 이메일', async () => {
      // given
      const testUserInfo = {
        email: testUsers[0].email,
        password: testUsers[0].password,
      };

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo)
        // then
        .expect(409);
    });
  });

  describe('POST /auth/sign-in', () => {
    test('로그인 성공', async () => {
      // given
      const testUserInfo = {
        email: testUsers[0].email,
        password: testUsers[0].password,
      };

      // when
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(testUserInfo);

      // then
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie'][0]).toContain('accessToken=');
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          id: expect.any(String),
          email: testUserInfo.email,
        },
      });
    });

    test('로그인 실패 - 존재하지 않는 이메일', async () => {
      // given
      const testUserInfo = {
        email: 'do_not_exist@gmail.com',
        password: testUsers[0].password,
      };

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(testUserInfo)
        // then
        .expect(401);
    });

    test('로그인 실패 - 비밀번호 틀림', async () => {
      // given
      const testUserInfo = {
        email: testUsers[0].email,
        password: 'wrong_password',
      };

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(testUserInfo)
        // then
        .expect(401);
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
