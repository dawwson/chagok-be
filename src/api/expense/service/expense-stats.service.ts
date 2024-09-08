import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';

import { ExpenseFindMonthlyOutput, ExpenseFindMonthlyRawResult } from './dto/output/expense-find-monthly-output';
import { ExpenseFindWeeklyOutput, ExpenseFindWeeklyRawResult } from './dto/output/expense-find-weekly-output';

dayjs.extend(isoWeek);

// NOTE: 한국 시간대만 지원합니다.
@Injectable()
export class ExpenseStatsService {
  constructor(private readonly dataSource: DataSource) {}

  async getMonthlyExpenseByCategory(userId: string) {
    const now = dayjs();
    const lastMonthStart = now.startOf('month').subtract(1, 'month').toISOString();
    const lastMonthEnd = now.startOf('month').subtract(1, 'month').endOf('month').toISOString();
    const thisMonthStart = now.startOf('month').toISOString();
    const thisMonthEnd = now.endOf('month').toISOString();

    const rawResults: ExpenseFindMonthlyRawResult[] = await this.dataSource.query(
      `
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        COALESCE(
          SUM(e.amount) FILTER ( WHERE e.expense_date BETWEEN '${lastMonthStart}' AND '${lastMonthEnd}' ), 0) AS last_month_expense,
        COALESCE(
          SUM(e.amount) FILTER ( WHERE e.expense_date BETWEEN '${thisMonthStart}' AND '${thisMonthEnd}' ), 0) AS this_month_expense
      FROM
        categories c
          LEFT JOIN expenses e ON e.category_id = c.id
          AND e.user_id = '${userId}'
          AND e.is_excluded = FALSE
      GROUP BY
        c.id
      ORDER BY
        c.id ASC`,
    );

    return ExpenseFindMonthlyOutput.from(rawResults);
  }

  async getWeeklyExpenseByCategory(userId: string) {
    const now = dayjs();
    const lastWeekStart = now.startOf('isoWeek').subtract(7, 'day').toISOString();
    const lastWeekEnd = now.endOf('isoWeek').subtract(7, 'day').toISOString();
    const thisWeekStart = now.startOf('isoWeek').toISOString();
    const thisWeekEnd = now.endOf('isoWeek').toISOString();

    const rawResults: ExpenseFindWeeklyRawResult[] = await this.dataSource.query(
      `
      SELECT
	      c.id AS category_id,
	      c.name AS category_name,
	      COALESCE(
		      SUM(e.amount) FILTER (
			      WHERE e.expense_date BETWEEN '${lastWeekStart}' AND '${lastWeekEnd}'
		      ), 0) AS last_week_expense,
	      COALESCE(
		      SUM(e.amount) FILTER (
			      WHERE e.expense_date BETWEEN '${thisWeekStart}' AND '${thisWeekEnd}'
		    ), 0) AS this_week_expense
      FROM
	      categories c 
          LEFT JOIN expenses e ON e.category_id = c.id
	        AND e.user_id = '${userId}'
	        AND e.is_excluded = FALSE	
      GROUP BY
	      c.id
      ORDER BY
	      c.id ASC
      `,
    );
    return ExpenseFindWeeklyOutput.from(rawResults);
  }
}
