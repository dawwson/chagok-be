import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Tx } from '@src/entity/tx.entity';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

@Exclude()
export class TxUpdateResponse {
  @Expose()
  id: number;

  @Expose()
  categoryId: number;

  @Expose()
  txType: TxType;

  @Expose()
  txMethod: TxMethod;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  @Expose()
  description: string;

  @Expose()
  isExcluded: boolean;

  @Expose()
  updatedAt: Date;

  static from(tx: Tx): TxUpdateResponse {
    return plainToInstance(TxUpdateResponse, tx);
  }
}
