import { IsBoolean, IsDefined, IsIn, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { BudgetCategory } from '@src/entity/budget-category.entity';

export class TxUpdateRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxType)], { message: ErrorCode.TX_INVALID_TX_TYPE })
  txType: TxType;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(TxMethod)], { message: ErrorCode.TX_INVALID_TX_METHOD })
  txMethod: TxMethod;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.TX_INVALID_AMOUNT })
  @Min(1, { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 0원 초과
  @Max(BudgetCategory.getMaxAmount(), { message: ErrorCode.TX_AMOUNT_OUT_OF_RANGE }) // 20억 이하
  amount: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.TX_INVALID_DESCRIPTION })
  @MaxLength(100, { message: ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH })
  description: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsBoolean({ message: ErrorCode.TX_INVALID_IS_EXCLUDED })
  isExcluded: boolean;
}
