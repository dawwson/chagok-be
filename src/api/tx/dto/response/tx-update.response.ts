import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Tx } from '@src/entity/tx.entity';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import {
  ApiCategoryId,
  ApiISOString,
  ApiTxAmount,
  ApiTxDescription,
  ApiTxIsExcluded,
  ApiTxMethod,
  ApiTxType,
} from '@src/shared/decorator/api-custom-property.decorator';

@Exclude()
export class TxUpdateResponse {
  @ApiProperty({ description: '수정된 내역의 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiTxType({ description: '수정된 내역의 유형' })
  @Expose()
  txType: TxType;

  @ApiTxMethod({ description: '수정된 내역의 거래 방법' })
  @Expose()
  txMethod: TxMethod;

  @ApiTxAmount({ description: '수정된 내역의 금액' })
  @Expose()
  amount: number;

  @ApiCategoryId({ description: '수정된 내역의 카테고리 고유 식별자' })
  @Expose()
  categoryId: number;

  @ApiISOString({ description: '수정된 내역의 날짜 (ISO string)' })
  @Expose()
  date: Date;

  @ApiTxDescription({ description: '수정된 내역의 세부 내용 (없으면 빈 문자열)' })
  @Expose()
  description: string;

  @ApiTxIsExcluded({ description: '수정된 내역의 합계, 통계 제외 여부' })
  @Expose()
  isExcluded: boolean;

  @ApiISOString({ description: '수정된 내역의 수정 날짜 (ISO string)' })
  @Expose()
  updatedAt: Date;

  static from(tx: Tx): TxUpdateResponse {
    return plainToInstance(TxUpdateResponse, tx);
  }
}
