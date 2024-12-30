import { ApiProperty } from '@nestjs/swagger';
import { ApiCategoryId, ApiCategoryName } from '@src/shared/decorator/api-custom-property.decorator';

export class StatExpenseResponse {
  @ApiCategoryId({ description: '카테고리 고유 식별자' })
  categoryId: number;

  @ApiCategoryName()
  categoryName: string;

  @ApiProperty({ description: '전년도 동월/전월 카테고리 지출 (단위 : 원)	', example: 229500 })
  previous: number;

  @ApiProperty({ description: '현재 월 카테고리 지출 (단위 : 원)', example: 209800 })
  current: number;
}
