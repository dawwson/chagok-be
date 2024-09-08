import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Category } from '@src/entity/category.entity';
import { CategoryName } from '@src/shared/enum/category-name.enum';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    // 테이블 데이터 초기화(스키마 유지)
    await dataSource.query(
      'TRUNCATE TABLE categories, budget_category, expenses, budgets, users RESTART IDENTITY CASCADE',
    );

    const categories = Object.keys(CategoryName).map((key) => {
      const category = new Category();
      category.name = CategoryName[key];
      return category;
    });

    await dataSource.getRepository(Category).save(categories);
  }
}
