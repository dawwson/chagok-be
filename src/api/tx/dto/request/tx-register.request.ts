import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Tx } from '@src/entity/tx.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import {
  ApiCategoryId,
  ApiISOString,
  ApiTxAmount,
  ApiTxDescription,
  ApiTxIsExcluded,
  ApiTxMethod,
  ApiTxType,
} from '@src/shared/decorator/api-custom-property.decorator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

export class TxRegisterRequest {
  @ApiTxType({ description: '생성할 내역의 유형' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxType)], { message: ErrorCode.TX_INVALID_TX_TYPE })
  txType: TxType;

  @ApiTxMethod({ description: '생성할 내역의 거래 방법' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxMethod)], { message: ErrorCode.TX_INVALID_TX_METHOD })
  txMethod: TxMethod;

  @ApiTxAmount({ description: '생성할 내역의 금액 (단위 : 원)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.TX_INVALID_AMOUNT })
  @Min(1, { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 1원 이상
  @Max(BudgetCategory.getMaxAmount(), { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 10억원 이하
  amount: number;

  @ApiCategoryId({ description: '생성할 내역의 카테고리 고유 식별자' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @ApiISOString({ description: '생성할 내역의 날짜 (ISO String)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date)
  @IsDate({ message: ErrorCode.TX_INVALID_DATE })
  date: Date;

  @ApiTxDescription({ description: '생성할 내역의 세부 내용', required: false })
  @IsOptional()
  @IsString({ message: ErrorCode.TX_INVALID_DESCRIPTION })
  @MaxLength(100, { message: ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH })
  description?: string;

  @ApiTxIsExcluded({ description: '생성할 내역의 합계, 통계 제외 여부' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsBoolean({ message: ErrorCode.TX_INVALID_IS_EXCLUDED })
  isExcluded: boolean;

  toEntity(userId: string) {
    return Tx.builder()
      .userId(userId)
      .categoryId(this.categoryId)
      .txType(this.txType)
      .txMethod(this.txMethod)
      .amount(this.amount)
      .date(this.date)
      .description(this.description)
      .isExcluded(this.isExcluded)
      .build();
  }
}
