import { IMemoryDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

export const initializeDataSource = async (
  db: IMemoryDb,
): Promise<DataSource> => {
  const dataSource: DataSource = await db.adapters.createTypeormDataSource({
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
