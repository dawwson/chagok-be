import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

export interface TxUpdateInput {
  categoryId: number;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  description: string;
  isExcluded: boolean;
}
