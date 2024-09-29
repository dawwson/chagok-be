import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { TestAppModule } from './test-app.module';
import { commit, createDataSource, rollback, setupTestData } from './db';

let dataSource: DataSource;

/**
 * 데이터베이스 설정
 * 1. 데이터베이스 생성 & 커넥션 수립
 * 2. 테스트 데이터 생성
 * 3. 현재 시점의 테스트 데이터를 backup
 */
export const setupDatabase = async () => {
  dataSource = await createDataSource();

  // 테스트 데이터를 db에 넣고 백업
  await setupTestData(dataSource);
  commit();
};

/**
 * 테스트용 앱 생성 (TypeORM DataSource를 pg-mem에서 생성한 DataSource로 대체)
 */
export const createTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TestAppModule],
  })
    .overrideProvider(DataSource)
    .useValue(dataSource)
    .compile();

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
 * 데이터베이스 초기화 (backup 시점으로 rollback)
 */
export const clearDatabase = () => {
  rollback();
};

/**
 * 데이터베이스 접근시 사용
 */
export const getRepository = (entity: EntityTarget<ObjectLiteral>) => {
  return dataSource.getRepository(entity);
};
