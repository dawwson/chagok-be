import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { dtsDtsxOrDtsDtsxMapRegex } from 'ts-loader/dist/constants';
import DoneCallback = jest.DoneCallback;

describe('/auth', () => {
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

  afterEach(async () => {
    // 데이터베이스 테이블 유지 + 데이터 초기화
    await dataSource.query(
      'TRUNCATE TABLE users, categories, budgets, budget_category, expenses RESTART IDENTITY CASCADE',
    );
  });

  afterAll(async () => {
    // 앱 종료(+ DB connection 종료)
    await app.close();
  });

  describe('POST /auth/sign-up', () => {
    test('회원가입 성공', async () => {
      // given
      const testUserInfo = {
        email: 'success@gmail.com',
        password: 'test_password',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo);

      // then
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
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
        // 성공 테스트에서 생성된 회원
        email: 'exist@gmail.com',
        password: 'test_password',
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo)
        .expect(201);

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo)
        // then
        .expect(409);
    });
  });

  describe('POST /auth/sign-in', () => {
    const testUserInfo = {
      email: 'exist@gmail.com',
      password: 'test_password',
    };

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUserInfo)
        .expect(201);
    });

    test('로그인 성공', async () => {
      // given

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(testUserInfo);

      // then
      expect(response.statusCode).toBe(200);
      expect(response.headers['set-cookie'][0]).toContain('accessToken=');
      expect(response.body).toEqual({
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
        password: 'test_password',
      };

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        // then
        .send(testUserInfo)
        .expect(401);
    });

    test('로그인 실패 - 비밀번호 틀림', async () => {
      // given
      const testUserInfo = {
        email: 'exist@gmail.com',
        password: 'wrong_password',
      };

      // when
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        // then
        .send(testUserInfo)
        .expect(401);
    });
  });
});
