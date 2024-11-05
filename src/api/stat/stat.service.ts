import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';

import { TxType } from '@src/shared/enum/tx-type.enum';

import { StatExpenseInput } from './dto/input/stat-expense.input';
import { StatExpenseOutput } from './dto/output/stat-expense.output';

@Injectable()
export class StatService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * 전년도 동월 대비 지출 통계 / 전월 대비 지출 통계
   * - 모든 카테고리를 결과에 포함하기 위해 카테고리 기준으로 LEFT JOIN 하였음.
   */
  async getExpenseStats(dto: StatExpenseInput): Promise<StatExpenseOutput[]> {
    const { userId, year, month, view } = dto;

    const current = dayjs(`${year}-${month}-01`);
    const previous = current.subtract(1, view === 'monthly' ? 'month' : 'year');

    const startOfcurrent = current.startOf('month').toISOString();
    const endOfCurrent = current.endOf('month').toISOString();

    const startOfPrevious = previous.startOf('month').toISOString();
    const endOfPrevious = previous.endOf('month').toISOString();

    const rawResults = (await this.dataSource.query(`
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        COALESCE(
          SUM(t.amount) FILTER ( WHERE t.date >= '${startOfPrevious}' AND t.date <= '${endOfPrevious}' ), 0) AS previous,
        COALESCE(
          SUM(t.amount) FILTER ( WHERE t.date >= '${startOfcurrent}' AND t.date <= '${endOfCurrent}' ), 0) AS current
      FROM
        categories c
          LEFT JOIN txs t ON t.category_id = c.id
          AND t.user_id = '${userId}'
          AND t.tx_type = '${TxType.EXPENSE}'
          AND t.is_excluded = FALSE
      WHERE c.type = '${TxType.EXPENSE}'
      GROUP BY
        c.id
      ORDER BY
        c.id ASC;
    `)) as Array<{
      category_id: number;
      category_name: string;
      previous: string;
      current: string;
    }>;

    return rawResults.map((result) => ({
      categoryId: result.category_id,
      categoryName: result.category_name,
      previous: parseInt(result.previous),
      current: parseInt(result.current),
    }));
  }
}
