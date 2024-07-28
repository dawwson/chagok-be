import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testUsers } from './in-memory-testing/test-data';

export const getUser1Agent = async (app: INestApplication) => {
  const res = await request(app.getHttpServer())
    .post('/auth/sign-in') //
    .send({
      email: testUsers[0].email,
      password: testUsers[0].password,
    });

  // Cookie 헤더에 JWT를 유지하여 사용할 agent 생성
  const agent = request.agent(app.getHttpServer());
  agent.set('Cookie', res.get('Set-Cookie'));
  return agent;
};

export const getUser2Agent = async (app: INestApplication) => {
  const res = await request(app.getHttpServer())
    .post('/auth/sign-in') //
    .send({
      email: testUsers[1].email,
      password: testUsers[1].password,
    });

  // Cookie 헤더에 JWT를 유지하여 사용할 agent 생성
  const agent = request.agent(app.getHttpServer());
  agent.set('Cookie', res.get('Set-Cookie'));
  return agent;
};
