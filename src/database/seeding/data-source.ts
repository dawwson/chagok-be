import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import * as dotenv from 'dotenv';
import * as path from 'path';

/*
NOTE :
1. typeorm-extension 라이브러리의 seed:run 명령어를 통해 data-source로 seeder의 run() 메서드를 실행한다.
2. seeds의 디폴트 경로는 src/database/seeds 여서, 다른 경로에 둘 경우 seeds 옵션을 설정해줘야 한다.
 */

dotenv.config({ path: `.env.dev` });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '../../entity/*.entity{.ts,.js}')],
  seeds: ['src/database/seeding/seeds/**/*{.ts,.js}'],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions & SeederOptions);
