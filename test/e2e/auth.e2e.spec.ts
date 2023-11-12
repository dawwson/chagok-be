import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // 데이터베이스 테이블 유지 + 데이터 초기화
    const dataSource = app.get(DataSource);
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
  });
});
