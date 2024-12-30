import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Category } from '@src/entity/category.entity';
import { ExpenseCategoryName, IncomeCategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

@Exclude()
export class CategoryShowResponse {
  @ApiProperty({ description: '카테고리 고유 식별자', example: '1' })
  @Expose()
  id: number;

  @ApiProperty({
    description: '카테고리 이름',
    enum: [...Object.values(IncomeCategoryName), ...Object.values(ExpenseCategoryName)],
    example: 'food',
  })
  @Expose()
  name: IncomeCategoryName | ExpenseCategoryName;

  @ApiProperty({ description: '카테고리 타입', enum: TxType, example: 'expense' })
  @Expose()
  type: TxType;

  static from(categories: Category[]) {
    return plainToInstance(CategoryShowResponse, categories);
  }
}
