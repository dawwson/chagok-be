import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

@Exclude()
export class TxRegisterResponse {
  @Expose()
  id: number;

  @Expose()
  txType: TxType;

  @Expose()
  txMethod: TxMethod;

  @Expose()
  amount: number;

  @Expose()
  categoryId: number;

  @Expose()
  date: Date;

  @Expose()
  description: string;

  @Expose()
  isExcluded: boolean | null;

  @Expose()
  createdAt: Date;

  static from(tx: Tx) {
    return plainToInstance(TxRegisterResponse, tx);
  }
}
