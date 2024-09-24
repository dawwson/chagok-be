import { DataSource, Repository } from 'typeorm';

import { User } from '@src/entity/user.entity';
import { Category } from '@src/entity/category.entity';
import { Expense } from '@src/entity/expense.entity';

import { testCategories, testExpenses, testUsers } from './test-data';

export const setupTestData = async (datasource: DataSource) => {
  const userRepo: Repository<User> = datasource.getRepository(User);
  const categoryRepo: Repository<Category> = datasource.getRepository(Category);
  const expenseRepo: Repository<Expense> = datasource.getRepository(Expense);

  const hashedUsers = [];

  for (const testUser of testUsers) {
    const hashedUser = await User.create(testUser.email, testUser.password, testUser.nickname);
    hashedUsers.push({
      id: testUser.id,
      ...hashedUser,
    });
  }

  await userRepo.save(hashedUsers);
  await categoryRepo.save(testCategories);
  await expenseRepo.save(testExpenses);
};
