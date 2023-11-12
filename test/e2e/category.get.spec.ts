import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

describe.skip('/categories (GET)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    // TODO: seed user, category
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

  describe('로그인 후', () => {
    let agent: request.SuperAgentTest;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send();
    });
    test('카테고리 목록 조회 성공', async () => {});
  });
});
