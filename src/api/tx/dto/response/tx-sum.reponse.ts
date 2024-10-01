import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TxSumResponse {
  @Expose()
  totalIncome: number;

  @Expose()
  totalExpense: number;

  static from(totalIncome: string, totalExpense: string) {
    const txSumResponse = new TxSumResponse();
    txSumResponse.totalIncome = Number(totalIncome);
    txSumResponse.totalExpense = Number(totalExpense);

    return txSumResponse;
  }
}
