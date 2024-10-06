import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { User } from '@src/entity/user.entity';
import { clearDatabase, createTestApp, setupDatabase } from '@test/utils/utils';
import { testUsers } from '@test/utils/test-data';
import { ExpenseCategoryName, IncomeCategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

const API_URL = '/categories';

describe(`GET ${API_URL}`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupDatabase();
    app = await createTestApp();
  });

  afterEach(async () => {
    clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('로그인 전 : (401) 유효하지 않은 토큰', () => {
    test('/', async () => {
      await request(app.getHttpServer()) //
        .get(`${API_URL}`) //
        .expect(401);
    });
  });

  describe('로그인 후 : (사용자 1)', () => {
    let agent: request.SuperAgentTest;
    const currentUser = testUsers[0];

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: currentUser.email,
          password: currentUser.password,
        })
        .expect(200);

      agent = request.agent(app.getHttpServer());
      agent.set('Cookie', res.get('Set-Cookie'));
    });

    test('(200) 카테고리 목록 조회 성공', async () => {
      // given

      // when
      const res = await agent.get(`${API_URL}`);

      // then
      expect(res.status).toBe(200);
      res.body.data.forEach((category) => {
        expect(category).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          type: expect.any(String),
        });
        expect([...Object.values(IncomeCategoryName), ...Object.values(ExpenseCategoryName)]).toContain(category.name);
        expect(Object.values(TxType)).toContain(category.type);
      });
    });
  });
});
