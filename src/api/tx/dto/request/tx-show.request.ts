import { IsDate, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

import { ApiISOString } from '@src/shared/decorator/api-custom-property.decorator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class TxShowRequest {
  @ApiISOString({ description: '조회 시작 날짜 (ISO string)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date) // 타입 변환
  @IsDate({ message: ErrorCode.TX_INVALID_START_DATE })
  startDate: Date;

  @ApiISOString({ description: '조회 종료 날짜 (ISO string)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date) // 타입 변환
  @IsDate({ message: ErrorCode.TX_INVALID_END_DATE })
  endDate: Date;
}
