import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

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
export class TxShowDetailResponse {
  @ApiProperty({ description: '내역 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiCategoryId({ description: '카테고리 고유 식별자' })
  @Expose()
  categoryId: number;

  @ApiTxType({ description: '내역 유형' })
  @Expose()
  txType: TxType;

  @ApiTxMethod({ description: '내역 거래 방법' })
  @Expose()
  txMethod: TxMethod;

  @ApiTxAmount({ description: '내역 금액 (단위 : 원)' })
  @Expose()
  amount: number;

  @ApiISOString({ description: '내역 날짜 (ISO string)' })
  @Expose()
  date: Date;

  @ApiTxDescription({ description: '내역 세부 내용 (없으면 빈 문자열)' })
  @Expose()
  description: string;

  @ApiTxIsExcluded({ description: '내역 합계, 통계 제외 여부' })
  @Expose()
  isExcluded: boolean;

  static from(tx: Tx): TxShowDetailResponse {
    return plainToInstance(TxShowDetailResponse, tx);
  }
}
