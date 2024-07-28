import { DataSource, Repository } from 'typeorm';

import { User } from '../../src/entity/user.entity';
import { Category } from '../../src/entity/category.entity';
import { Expense } from '../../src/entity/expense.entity';

import { testCategories, testExpenses, testUsers } from './test-data';

export const setupTestData = async (datasource: DataSource) => {
  const userRepo: Repository<User> = datasource.getRepository(User);
  const categoryRepo: Repository<Category> = datasource.getRepository(Category);
  const expenseRepo: Repository<Expense> = datasource.getRepository(Expense);

  await userRepo.save(userRepo.create(testUsers));
  await categoryRepo.save(testCategories);
  await expenseRepo.save(testExpenses);
};

export const clearDatabase = async (dataSource: DataSource) => {
  await dataSource.query(
    'TRUNCATE TABLE users, categories, budgets, budget_category, expenses RESTART IDENTITY CASCADE',
  );
};
