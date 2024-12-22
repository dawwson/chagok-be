import { IsBoolean, IsDefined, IsIn, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

import {
  ApiCategoryId,
  ApiTxAmount,
  ApiTxDescription,
  ApiTxIsExcluded,
  ApiTxMethod,
  ApiTxType,
} from '@src/shared/decorator/api-custom-property.decorator';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { BudgetCategory } from '@src/entity/budget-category.entity';

export class TxUpdateRequest {
  @ApiTxType({ description: '수정할 내역의 유형' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxType)], { message: ErrorCode.TX_INVALID_TX_TYPE })
  txType: TxType;

  @ApiTxMethod({ description: '수정할 내역의 거래 방법' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxMethod)], { message: ErrorCode.TX_INVALID_TX_METHOD })
  txMethod: TxMethod;

  @ApiTxAmount({ description: '수정할 내역의 금액 (단위 : 원)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.TX_INVALID_AMOUNT })
  @Min(1, { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 1원 이상
  @Max(BudgetCategory.getMaxAmount(), { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 10억원 이하
  amount: number;

  @ApiCategoryId({ description: '수정할 내역의 카테고리 고유 식별자' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @ApiTxDescription({ description: '수정할 내역의 세부 내용', required: true })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.TX_INVALID_DESCRIPTION })
  @MaxLength(100, { message: ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH })
  description: string;

  @ApiTxIsExcluded({ description: '수정할 내역의 합계, 통계 제외 여부' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsBoolean({ message: ErrorCode.TX_INVALID_IS_EXCLUDED })
  isExcluded: boolean;
}
