import { IsDate, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class TxShowRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date) // 타입 변환
  @IsDate({ message: ErrorCode.TX_INVALID_START_DATE })
  startDate: Date;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date) // 타입 변환
  @IsDate({ message: ErrorCode.TX_INVALID_END_DATE })
  endDate: Date;
}
