import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Category } from 'src/entity/category.entity';
import { CategoryName } from 'src/shared/enum/category-name.enum';

@Exclude()
export class CategoryShowResponse {
  @Expose()
  id: number;

  @Expose()
  name: CategoryName;

  static from(categories: Category[]) {
    return plainToInstance(CategoryShowResponse, categories);
  }
}
