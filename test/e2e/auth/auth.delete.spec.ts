import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { User } from '@src/entity/user.entity';
import { clearDatabase, createTestApp, getRepository, setupDatabase } from '@test/utils/utils';
import { testUsers } from '@test/utils/test-data';

const API_URL = '/auth';

describe('DELETE /auth', () => {
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

  describe('/account', () => {
    test('로그인 전: (401) 유효하지 않은 토큰', async () => {
      await request(app.getHttpServer()) //
        .delete(`${API_URL}/account`) //
        .expect(401);
    });

    describe('사용자1 로그인 후:', () => {
      let agent: request.SuperAgentTest;
      const currentUser = testUsers[0];

      beforeAll(async () => {
        const res = await request(app.getHttpServer())
          .post(`${API_URL}/sign-in`)
          .send({
            email: currentUser.email,
            password: currentUser.password,
          })
          .expect(200);

        agent = request.agent(app.getHttpServer());
        agent.set('Cookie', res.get('Set-Cookie'));
      });

      test('(204) 회원 탈퇴 성공', async () => {
        // given

        // when
        const res = await agent.delete(`${API_URL}/account`);

        // then
        expect(res.status).toBe(204);
        expect(res.get('Set-Cookie')[0]).toBe('accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

        const find = await getRepository(User).findOne({ where: { id: currentUser.id } });
        expect(find).toBeNull();
      });
    });
  });
});
