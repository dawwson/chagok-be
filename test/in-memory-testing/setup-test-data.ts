import { DataSource, Repository } from 'typeorm';

import { User } from '../../src/entity/user.entity';
import { Category } from '../../src/entity/category.entity';

import { testCategories, testUsers } from './test-data';

export const setupTestData = async (datasource: DataSource) => {
  const userRepo: Repository<User> = await datasource.getRepository(User);
  const categoryRepo: Repository<Category> =
    await datasource.getRepository(Category);

  await userRepo.save(userRepo.create(testUsers));
  await categoryRepo.save(testCategories);
};
