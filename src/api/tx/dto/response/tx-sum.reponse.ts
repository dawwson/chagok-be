import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TxSumResponse {
  @ApiProperty({ description: '수입 합계 (단위 : 원)', example: 3000000 })
  @Expose()
  totalIncome: number;

  @ApiProperty({ description: '지출 합계 (단위 : 원)', example: 1000000 })
  @Expose()
  totalExpense: number;

  static from(totalIncome: string, totalExpense: string) {
    const txSumResponse = new TxSumResponse();
    txSumResponse.totalIncome = Number(totalIncome);
    txSumResponse.totalExpense = Number(totalExpense);

    return txSumResponse;
  }
}
