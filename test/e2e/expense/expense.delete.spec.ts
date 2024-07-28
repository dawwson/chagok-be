import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';
import { testExpenses } from '../../in-memory-testing/test-data';
import { getUser1Agent } from '../../../test/get-agent';

describe('/expenses (DELETE)', () => {
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

  describe('DELETE /expenses/{id}', () => {
    test('지출 삭제 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);
      const testExpense = testExpenses[0];

      // when
      const res = await agent //
        .delete(`/expenses/${testExpense.id}`) //
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
      });
    });

    test('지출 삭제 실패(404) - 존재하지 않거나 접근 권한이 없음', async () => {
      // given
      const agent = await getUser1Agent(app);
      const testExpense = testExpenses[2]; // 사용자 2의 지출

      // when
      await agent //
        .delete(`/expenses/${testExpense.id}`) //
        // then
        .expect(404);
    });
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });
});
