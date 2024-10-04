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

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { Tx } from '@src/entity/tx.entity';

export class TxRegisterRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxType)], { message: ErrorCode.TX_INVALID_TX_TYPE })
  txType: TxType;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxMethod)], { message: ErrorCode.TX_INVALID_TX_METHOD })
  txMethod: TxMethod;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.TX_INVALID_AMOUNT })
  @Min(10, { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 10원 이상
  @Max(2000000000, { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 20억 이하
  amount: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date)
  @IsDate({ message: ErrorCode.TX_INVALID_DATE })
  date: Date;

  @IsOptional()
  @IsString({ message: ErrorCode.TX_INVALID_DESCRIPTION })
  @MaxLength(100, { message: ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH })
  description?: string;

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
