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

// userId: 'f131cfc0-0fb0-4208-804b-1b0f7b8aac38',
//   categoryId: 1,
//   txType: 'income',
//   txMethod: 'credit card',
//   amount: 6800,
//   date: 2024-09-30T04:22:17.531Z,
//   description: '',
//   isExcluded: null,
//   id: 5,
//   createdAt: 2024-09-30T08:04:48.103Z,
//   updatedAt: 2024-09-30T08:04:48.103Z
