import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

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

  afterAll(async () => {
    // 데이터베이스 테이블 유지 + 데이터 초기화
    await dataSource.query(
      'TRUNCATE TABLE users, categories, budgets, budget_category, expenses RESTART IDENTITY CASCADE',
    );
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
        email: 'success@gmail.com',
        password: 'test_password',
      };

      await request(app.getHttpServer())
        // when
        .post('/auth/sign-up')
        .send(testUserInfo)
        // then
        .expect(409);
    });
  });
});
