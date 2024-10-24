import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { testCategories, testTxs, testUsers } from './data';
import { TestModule } from '@test/util/test.module';

import { User } from '@src/entity/user.entity';
import { Category } from '@src/entity/category.entity';
import { Tx } from '@src/entity/tx.entity';
import { INestApplication } from '@nestjs/common';

/**
 * 테스트에 필요한 데이터 저장
 */
export const setupDatabase = async (dataSource: DataSource) => {
  const hashedUsers = [];

  for (const testUser of testUsers) {
    const hashedUser = await User.create(testUser.email, testUser.password, testUser.nickname);
    hashedUsers.push({
      id: testUser.id,
      ...hashedUser,
    });
  }

  try {
    await Promise.all([
      dataSource.getRepository(User).insert(hashedUsers),
      dataSource.getRepository(Category).insert(testCategories),
    ]);
    await dataSource.getRepository(Tx).insert(testTxs);
  } catch (error) {
    throw error;
  }
};

/**
 * 테이블 구조 유지 & 테스트 데이터 삭제
 * @param dataSource
 */
export const clearDatabase = async (dataSource: DataSource) => {
  const qr = dataSource.createQueryRunner();
  await qr.startTransaction();

  try {
    await qr.query('TRUNCATE TABLE users, categories, txs, budgets, budget_category RESTART IDENTITY CASCADE');
    await qr.commitTransaction();
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};

/**
 * 테스트 앱 생성
 */
export const createTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TestModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.enableCors({
    origin: true, // 모든 origin 허용
    credentials: true, // 쿠키 허용
  });
  app.use(cookieParser());

  await app.init();

  return app;
};

/**
 * 특정 사용자로 로그인한 agent 생성
 */
export const createAuthorizedAgent = async (app: INestApplication, user: User) => {
  const res = await request(app.getHttpServer()) //
    .post('/auth/sign-in') //
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200);

  const agent = request.agent(app.getHttpServer());
  agent.set('Cookie', res.get('Set-Cookie'));

  return agent;
};
