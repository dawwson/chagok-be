import { Tx } from '@src/entity/tx.entity';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

@Exclude()
export class TxShowDetailResponse {
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

  static from(tx: Tx): TxShowDetailResponse {
    return plainToInstance(TxShowDetailResponse, tx);
  }
}
