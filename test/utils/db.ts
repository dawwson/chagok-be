import { DataSource, Repository } from 'typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import { newDb, DataType, IBackup } from 'pg-mem';
import { v4 } from 'uuid';
import { testUsers } from './test-data';
import { User } from '@src/entity/user.entity';

const memoryDb = newDb({
  autoCreateForeignKeyIndices: true,
});

memoryDb.public.registerFunction({
  // SELECT * FROM version();
  name: 'version',
  // 쿼리 결과
  implementation: () =>
    'PostgreSQL 16.0 (Debian 16.0-1.pgdg120+1) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit',
});

memoryDb.public.registerFunction({
  // SELECT * FROM current_database();
  name: 'current_database',
  // 쿼리 결과
  implementation: () => 'test',
});

// CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
memoryDb.registerExtension('uuid-ossp', (schema) => {
  schema.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: v4,
    impure: true,
  });
});

export const createDataSource = async () => {
  const dataSource: DataSource = await memoryDb.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    // logging: true,
  });

  // 커넥션 수립
  await dataSource.initialize().catch((error) => {
    console.error('Error during Data Source initialization', error);
  });

  return dataSource;
};

export const setupTestData = async (dataSource: DataSource) => {
  const userRepo: Repository<User> = dataSource.getRepository(User);

  const hashedUsers = [];

  for (const testUser of testUsers) {
    const hashedUser = await User.create(testUser.email, testUser.password, testUser.nickname);
    hashedUsers.push({
      id: testUser.id,
      ...hashedUser,
    });
  }

  await userRepo.save(hashedUsers);
};

let backup: IBackup;

export const commit = () => {
  backup = memoryDb.backup();
};

export const rollback = () => {
  backup.restore();
};
