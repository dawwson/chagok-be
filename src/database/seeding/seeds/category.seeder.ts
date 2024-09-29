import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Category } from '@src/entity/category.entity';
import { IncomeCategoryName, ExpenseCategoryName } from '@src/shared/enum/category-name.enum';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    // 테이블 데이터 초기화(스키마 유지)
    await dataSource.query('TRUNCATE TABLE categories, budget_category, txs, budgets, users RESTART IDENTITY CASCADE');

    const incomeCategories = Object.keys(IncomeCategoryName).map((key) =>
      Category.createIncomeCategory(IncomeCategoryName[key]),
    );

    const expenseCategories = Object.keys(ExpenseCategoryName).map((key) =>
      Category.createExpenseCategory(ExpenseCategoryName[key]),
    );

    await dataSource.getRepository(Category).save([...incomeCategories, ...expenseCategories]);
  }
}
