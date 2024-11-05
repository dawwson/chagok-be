import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import * as dayjs from 'dayjs';

import { clearDatabase, createAuthorizedAgent, createTestApp, setupDatabase } from '@test/util';
import { expenseCategories, testUsers } from '@test/util/data';

const API_URL = '/stats';

describe(`GET ${API_URL}`, () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await setupDatabase(dataSource);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/expense/{year}/{month}', () => {
    describe('로그인 전 : ', () => {
      test('(401) 유효하지 않은 토큰', async () => {
        return request(app.getHttpServer()).get(`${API_URL}/expense/2024/11`).expect(401);
      });
    });

    describe('로그인 후 : (사용자 1)', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        await setupDatabase(dataSource);
        agent = await createAuthorizedAgent(app, currentUser);
        await clearDatabase(dataSource);
      });

      test('(200) 지출 통계 조회 성공', async () => {
        // given
        const testYear = dayjs().year();
        const testMonth = dayjs().month() + 1;

        // when
        const res = await agent.get(`${API_URL}/expense/${testYear}/${testMonth}`).query({
          view: 'monthly',
        });

        // then
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(expenseCategories.length);
        res.body.data.forEach((stat) => {
          expect(stat).toEqual({
            categoryId: expect.any(Number),
            categoryName: expect.any(String),
            previous: expect.any(Number),
            current: expect.any(Number),
          });
        });
      });
    });
  });
});
