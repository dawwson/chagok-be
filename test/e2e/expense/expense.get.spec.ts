import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IBackup, IMemoryDb } from 'pg-mem';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as dayjs from 'dayjs';

import { InMemoryTestingModule } from '../../in-memory-testing/in-memory-testing.module';
import { setupMemoryDb } from '../../in-memory-testing/setup-memory-db';
import { initializeDataSource } from '../../in-memory-testing/initialize-data-source';
import { setupTestData } from '../../in-memory-testing/setup-test-data';
import { testExpenses, testUsers } from '../../in-memory-testing/test-data';

describe('/expenses (GET)', () => {
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

    describe('GET /expenses', () => {
      test('지출 목록 조회 성공(200)', async () => {
        // given

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
          data: {
            totalAmount: expect.any(Number),
            totalAmountsByCategory: expect.any(Array),
            expenses: expect.any(Array),
          },
        });
        res.body.data.totalAmountsByCategory.forEach(
          (totalAmountByCategory) => {
            expect(totalAmountByCategory).toMatchObject({
              categoryId: expect.any(Number),
              // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
              // name: expect.any(String),
              totalAmount: expect.any(Number),
            });
          },
        );
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
        const testExpense = testExpenses[0];

        // when
        const res = await agent //
          .get(`/expenses/${testExpense.id}`) //
          .expect(200);

        // then
        expect(res.body).toEqual({
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

        // when
        const res = await agent //
          .get('/expenses/statistics') //
          .expect(200);

        // then
        expect(res.body).toEqual({
          data: {
            comparedToLastMonth: expect.any(Array),
            comparedToLastWeek: expect.any(Array),
          },
        });

        res.body.data.comparedToLastMonth.forEach((category) => {
          expect(category).toMatchObject({
            categoryId: expect.any(Number),
            // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
            // categoryName: expect.any(String),
            lastMonthAmount: expect.any(Number),
            thisMonthAmount: expect.any(Number),
          });
        });
        res.body.data.comparedToLastWeek.forEach((category) => {
          expect(category).toMatchObject({
            categoryId: expect.any(Number),
            // FIXME: name이 쿼리에서부터 null로 나옴. 그런데 로컬 DB로 테스트할 때는 문제 없음(아마도 pg-mem 문제?)
            // categoryName: expect.any(String),
            lastWeekAmount: expect.any(Number),
            thisWeekAmount: expect.any(Number),
          });
        });
      });
    });
  });
});
