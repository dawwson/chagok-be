import { newDb, IMemoryDb, DataType } from 'pg-mem';
import { v4 } from 'uuid';

export const setupMemoryDb = (): IMemoryDb => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    // SELECT * FROM version();
    name: 'version',
    // 쿼리 결과
    implementation: () =>
      'PostgreSQL 16.0 (Debian 16.0-1.pgdg120+1) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit',
  });

  db.public.registerFunction({
    // SELECT * FROM current_database();
    name: 'current_database',
    // 쿼리 결과
    implementation: () => 'test',
  });

  // CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  return db;
};
