import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';
import { testCategories } from '../../in-memory-testing/test-data';
import { getUser1Agent } from '../../../test/get-agent';

describe('/categories (GET)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await setupTestData(dataSource);
  });

  test('카테고리 목록 조회 성공(200)', async () => {
    // given
    const agent = await getUser1Agent(app);

    // when
    const res2 = await agent //
      .get('/categories') //
      .expect(200);

    // then
    expect(res2.body).toHaveProperty('message', expect.any(String));
    expect(res2.body.data).toHaveLength(testCategories.length);
    res2.body.data.forEach((category) => {
      expect(category).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
