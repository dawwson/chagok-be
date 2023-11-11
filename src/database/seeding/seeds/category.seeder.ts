import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Category } from '../../../entity/category.entity';
import { CategoryName } from '../../../shared/enum/category-name.enum';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    console.log('여기!!!😀');
    // 테이블 데이터 초기화(스키마 유지)
    await dataSource.query(
      'TRUNCATE TABLE categories RESTART IDENTITY CASCADE',
    );

    const categories = Object.keys(CategoryName).map((key) => {
      const category = new Category();
      category.name = CategoryName[key];
      return category;
    });

    await dataSource.getRepository(Category).save(categories);
  }
}
