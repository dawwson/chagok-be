import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tx } from '@src/entity/tx.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';

import { TxFindInput } from '../dto/input/tx-find.input';
import { TxSumInput } from '../dto/input/tx-sum.input';
import { TxSumOutput } from '../dto/output/tx-sum.output';

@Injectable()
export class TxQueryService {
  constructor(
    @InjectRepository(Tx)
    private readonly txRepo: Repository<Tx>,
  ) {}

  getTxsByDate(userId: string, dto: TxFindInput) {
    const { startDate, endDate } = dto;

    return this.txRepo
      .createQueryBuilder('tx')
      .select() // tx 모든 컬럼 포함
      .leftJoinAndSelect('tx.category', 'category') // category 모든 컬럼 포함해서 left join
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.date >= :startDate AND tx.date < :endDate', { startDate, endDate })
      .orderBy('tx.date', 'DESC') // 날짜순
      .getMany();
  }

  async calculateSum(userId: string, dto: TxSumInput): Promise<TxSumOutput> {
    const { startDate, endDate } = dto;

    const result = await this.txRepo
      .createQueryBuilder('tx')
      .select(`SUM(CASE WHEN tx.tx_type = '${TxType.INCOME}' THEN tx.amount ELSE 0 END)`, 'totalIncome')
      .addSelect(`SUM(CASE WHEN tx.tx_type = '${TxType.EXPENSE}' THEN tx.amount ELSE 0 END)`, 'totalExpense')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.isExcluded = false')
      .andWhere('tx.date >= :startDate AND tx.date < :endDate', { startDate, endDate })
      .getRawMany();

    return result[0];
  }
}
