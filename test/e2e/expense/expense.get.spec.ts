import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import * as cookieParser from 'cookie-parser';
import * as dayjs from 'dayjs';

import { AppModule } from '../../../src/app.module';
import {
  clearDatabase,
  setupTestData,
} from '../../in-memory-testing/setup-test-data';
import { testExpenses } from '../../in-memory-testing/test-data';
import { getUser1Agent } from '../../../test/get-agent';

describe('/expenses (GET)', () => {
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

  describe('GET /expenses', () => {
    test('지출 목록 조회 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);

      // when
      const res = await agent
        .get(`/expenses`)
        .query({
          startDate: dayjs().subtract(7, 'days').toISOString(),
          endDate: dayjs().add(7, 'days').toISOString(),
        })
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          totalAmount: expect.any(Number),
          totalAmountsByCategory: expect.any(Array),
          expenses: expect.any(Array),
        },
      });
      res.body.data.totalAmountsByCategory.forEach((totalAmountByCategory) => {
        expect(totalAmountByCategory).toMatchObject({
          categoryId: expect.any(Number),
          // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
          // name: expect.any(String),
          totalAmount: expect.any(Number),
        });
      });
      res.body.data.expenses.forEach((expense) => {
        expect(expense).toEqual({
          id: expect.any(Number),
          content: expect.any(String),
          amount: expect.any(Number),
          expenseDate: expect.any(String),
          categoryName: expect.any(String),
        });
      });
    });
  });

  describe('GET /expenses/{id}', () => {
    test('지출 상세 조회 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);
      const testExpense = testExpenses[0];

      // when
      const res = await agent //
        .get(`/expenses/${testExpense.id}`) //
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          id: testExpense.id,
          categoryId: testExpense.categoryId,
          content: testExpense.content,
          amount: testExpense.amount,
          expenseDate: testExpense.expenseDate.toISOString(),
          isExcluded: testExpense.isExcluded,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    test('지출 상세 조회 실패(404) - 존재하지 않거나 접근 권한이 없음', async () => {
      // given
      const agent = await getUser1Agent(app);
      const testExpense = testExpenses[2]; // 사용자 2의 지출

      // when
      await agent
        .get(`/expenses/${testExpense.id}`)
        // then
        .expect(404);
    });
  });

  describe('GET /expenses/statistics', () => {
    test('지출 통계 성공(200)', async () => {
      // given
      const agent = await getUser1Agent(app);

      // when
      const res = await agent //
        .get('/expenses/statistics') //
        .expect(200);

      // then
      expect(res.body).toEqual({
        message: expect.any(String),
        data: {
          comparedToLastMonth: expect.any(Array),
          comparedToLastWeek: expect.any(Array),
        },
      });

      res.body.data.comparedToLastMonth.forEach((category) => {
        expect(category).toMatchObject({
          categoryId: expect.any(Number),
          // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
          categoryName: expect.any(String),
          lastMonthAmount: expect.any(Number),
          thisMonthAmount: expect.any(Number),
        });
      });
      res.body.data.comparedToLastWeek.forEach((category) => {
        expect(category).toMatchObject({
          categoryId: expect.any(Number),
          // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
          categoryName: expect.any(String),
          lastWeekAmount: expect.any(Number),
          thisWeekAmount: expect.any(Number),
        });
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
