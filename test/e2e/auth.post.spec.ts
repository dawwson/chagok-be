import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IBackup, IMemoryDb } from 'pg-mem';
import * as request from 'supertest';

import { initializeDataSource } from '../in-memory-testing/initialize-data-source';
import { setupMemoryDb } from '../in-memory-testing/setup-memory-db';
import { setupTestData } from '../in-memory-testing/setup-test-data';
import { InMemoryTestingModule } from '../in-memory-testing/in-memory-testing.module';
import { testUsers } from '../in-memory-testing/test-data';

describe('/auth (POST)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let memoryDb: IMemoryDb;
  let backup: IBackup;

  beforeAll(async () => {
    // 1. DB 설정
    memoryDb = setupMemoryDb();
    // 2. 연결 설정된 dataSource를 가져옴
    dataSource = await initializeDataSource(memoryDb);
    // 3. 테스트에 필요한 데이터 생성
    await setupTestData(dataSource);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InMemoryTestingModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // NOTE: datasource initialize 한 시점의 데이터를 백업합니다.
    backup = memoryDb.backup();
  });

  afterEach(async () => {
    // NOTE: 매 테스트 종료 후 백업한 데이터로 ROLLBACK 합니다.
    backup.restore();
  });

  afterAll(async () => {
    // NOTE: 모든 테스트 종료 후 앱을 종료합니다.(+ connection closed)
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
      const res = await request(app.getHttpServer())
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
});
