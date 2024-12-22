import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
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
export class TxRegisterResponse {
  @ApiProperty({ description: '생성된 내역의 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiTxType({ description: '생성된 내역의 유형' })
  @Expose()
  txType: TxType;

  @ApiTxMethod({ description: '생성된 내역의 거래 방법' })
  @Expose()
  txMethod: TxMethod;

  @ApiTxAmount({ description: '생성된 내역의 금액' })
  @Expose()
  amount: number;

  @ApiCategoryId({ description: '생성된 내역의 카테고리 고유 식별자' })
  @Expose()
  categoryId: number;

  @ApiISOString({ description: '생성된 내역의 날짜 (ISO string)' })
  @Expose()
  date: Date;

  @ApiTxDescription({ description: '생성된 내역의 세부 내용 (없으면 빈 문자열)', required: true })
  @Expose()
  description: string;

  @ApiTxIsExcluded({ description: '생성된 내역의 합계, 통계 제외 여부' })
  @Expose()
  isExcluded: boolean | null;

  @ApiISOString({ description: '생성된 내역 생성 날짜 (ISO string)' })
  @Expose()
  createdAt: Date;

  static from(tx: Tx) {
    return plainToInstance(TxRegisterResponse, tx);
  }
}
