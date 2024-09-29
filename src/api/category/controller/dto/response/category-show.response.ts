import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Category } from '@src/entity/category.entity';
import { ExpenseCategoryName, IncomeCategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

@Exclude()
export class CategoryShowResponse {
  @Expose()
  id: number;

  @Expose()
  name: IncomeCategoryName | ExpenseCategoryName;

  @Expose()
  type: TxType;

  static from(categories: Category[]) {
    return plainToInstance(CategoryShowResponse, categories);
  }
}
