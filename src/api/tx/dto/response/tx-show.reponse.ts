import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';

import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

@Exclude()
export class TxShowResponse {
  @Expose()
  id: number;

  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name) // 카테고리 이름만 추출
  categoryName: string;

  @Expose()
  txType: TxType;

  @Expose()
  txMethod: TxMethod;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  static from(txs: Tx[]) {
    return plainToInstance(TxShowResponse, txs);
  }
}
