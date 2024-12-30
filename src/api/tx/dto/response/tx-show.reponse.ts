import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import {
  ApiCategoryName,
  ApiISOString,
  ApiTxAmount,
  ApiTxMethod,
  ApiTxType,
} from '@src/shared/decorator/api-custom-property.decorator';

@Exclude()
export class TxShowResponse {
  @ApiProperty({ description: '내역 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiCategoryName()
  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name) // 카테고리 이름만 추출
  categoryName: string;

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

  static from(txs: Tx[]) {
    return plainToInstance(TxShowResponse, txs);
  }
}
