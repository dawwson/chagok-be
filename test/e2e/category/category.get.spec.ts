import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IBackup, IMemoryDb } from 'pg-mem';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { setupMemoryDb } from '../../in-memory-testing/setup-memory-db';
import { initializeDataSource } from '../../in-memory-testing/initialize-data-source';
import { setupTestData } from '../../in-memory-testing/setup-test-data';
import { InMemoryTestingModule } from '../../in-memory-testing/in-memory-testing.module';
import { testCategories, testUsers } from '../../in-memory-testing/test-data';

describe('/categories (GET)', () => {
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
    app.use(cookieParser());
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

  describe('테스트 사용자 1로 로그인 후', () => {
    let agent: request.SuperAgentTest;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password,
        })
        .expect(200);

      // Cookie 헤더에 JWT를 유지하여 사용할 agent 생성
      agent = request.agent(app.getHttpServer());
      agent.set('Cookie', res.get('Set-Cookie'));
    });

    describe('GET /categories', () => {
      test('카테고리 목록 조회 성공(200)', async () => {
        // given

        // when
        const res = await agent //
          .get('/categories') //
          .expect(200);

        // then
        expect(res.body.data).toHaveLength(testCategories.length);
        res.body.data.forEach((category) => {
          expect(category).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
          });
        });
      });
    });
  });
});
