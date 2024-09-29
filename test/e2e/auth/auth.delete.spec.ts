import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { clearDatabase, createTestApp, getRepository, setupDatabase } from '@test/utils/utils';
import { testUsers } from '@test/in-memory-testing/test-data';

import { User } from '@src/entity/user.entity';

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
    test('로그인 전: (401) 유효하지 않은 JWT', async () => {
      await request(app.getHttpServer()) //
        .delete('/auth/account') //
        .expect(401);
    });

    describe('사용자1 로그인 후:', () => {
      let agent: request.SuperAgentTest;
      const user = testUsers[0];

      beforeAll(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            email: user.email,
            password: user.password,
          })
          .expect(200);

        agent = request.agent(app.getHttpServer());
        agent.set('Cookie', res.get('Set-Cookie'));
      });

      test('(204) 회원 탈퇴 성공', async () => {
        // given

        // when
        const res = await agent.delete('/auth/account');

        // then
        expect(res.status).toBe(204);
        expect(res.get('Set-Cookie')[0]).toBe('accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

        const find = await getRepository(User).findOne({ where: { id: user.id } });
        expect(find).toBeNull();
      });
    });
  });
});
