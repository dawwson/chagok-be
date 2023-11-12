import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Category } from '../../../entity/category.entity';

@Exclude()
export class GetCategoryListResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  static of(categories: Category[]) {
    return plainToInstance(GetCategoryListResponse, categories);
  }
}
