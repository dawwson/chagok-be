import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CategoryLib } from '@src/api/category/service/category.lib';
import { Budget } from '@src/entity/budget.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { ExpenseCategoryName } from '@src/shared/enum/category-name.enum';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

import { BudgetCreateInput } from '../dto/input/budget-create.input';
import { BudgetUpdateInput } from '../dto/input/budget-update.input';
import { BudgetRecommendInput } from '../dto/input/budget-recommend.input';
import { RecommendBudgetOutput } from '../dto/output/budget-recommend.output';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    private readonly categoryLib: CategoryLib,
    private readonly dataSource: DataSource,
  ) {}

  getBudgetById(id: number) {
    return this.budgetRepo.findOne({
      where: { id },
      relations: { budgetCategories: true },
    });
  }

  getOwnBudgetByYearAndMonth(userId: string, year: number, month: number) {
    return this.budgetRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.budgetCategories', 'bc')
      .leftJoinAndSelect('bc.category', 'c')
      .where('b.userId = :userId', { userId })
      .andWhere('b.year = :year', { year })
      .andWhere('b.month = :month', { month })
      .orderBy('bc.categoryId', 'ASC')
      .getOne();
  }

  async createBudget(dto: BudgetCreateInput) {
    const { userId, year, month, budgets } = dto;

    // 모두 지출 카테고리인지 검증
    await this.categoryLib.validateExpenseCategory(budgets.map((b) => b.categoryId));

    const budget = Budget.builder()
      .userId(userId)
      .year(year)
      .month(month)
      .totalAmount(budgets.reduce((acc, { amount }) => (acc += amount), 0))
      .budgetCategories(
        budgets.map((b) => {
          return BudgetCategory.builder() //
            .categoryId(b.categoryId) //
            .amount(b.amount)
            .build();
        }),
      )
      .build();

    try {
      return await this.budgetRepo.save(budget);
    } catch (error) {
      if (error.code === '23505') {
        // 23505: duplicate key value
        throw new ConflictException(ErrorCode.BUDGET_IS_DUPLICATED);
      }
      if (error.code === '23514') {
        // 23514: violates check constraint
        throw new BadRequestException(ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE);
      }
      throw error;
    }
  }

  async updateBudget(id: number, dto: BudgetUpdateInput) {
    const { budgets } = dto;

    // 모두 지출 카테고리인지 검증
    await this.categoryLib.validateExpenseCategory(budgets.map((b) => b.categoryId));

    // === START OF TRANSACTION ===
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalAmount = 0;

      const current = new Map(
        (await qr.manager.findBy(BudgetCategory, { budgetId: id })).map((bc) => [bc.categoryId, bc]),
      );
      const queries = [];

      budgets.forEach((b) => {
        // 기존에서 금액이 변경된 카테고리에 대한 업데이트 쿼리 생성
        const bc = current.get(b.categoryId);
        const isModified = bc.amount !== b.amount;

        if (isModified) {
          queries.push(qr.manager.update(BudgetCategory, bc.id, { amount: b.amount }));
        }
        totalAmount += b.amount;
      });

      if (queries.length > 0) {
        // Budget, BudgetCategory 업데이트
        await Promise.all([qr.manager.update(Budget, { id }, { totalAmount }), ...queries]);
      }

      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();

      if (error.code === '23514') {
        // 23514: violates check constraint
        throw new BadRequestException(ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE);
      }
      throw error;
    } finally {
      await qr.release();
    }
    // === END OF TRANSACTION ===
  }

  /**
   * 가중 평균 비율대로 각 카테고리에 총 예산 배분
   * - 단, 각 카테고리의 예산은 1,000원 단위로 변환
   * - 남는 예산은 기타 카테고리(other expense)로 포함
   */
  async getBudgetRecommendation(dto: BudgetRecommendInput): Promise<RecommendBudgetOutput[]> {
    const { userId, year, month, totalAmount } = dto;

    const weighedAvgRatios = await this.caculateWeightedAvgRatios(userId, year, month);
    const expenseCategoryMap = new Map((await this.categoryLib.getExpenseCategories()).map((c) => [c.id, c.name]));

    if (weighedAvgRatios.length === 0) {
      return [];
    }

    let sum = 0;
    let otherExpenseBudgetIndex = 0;

    const recommendedBudget = weighedAvgRatios.map(({ categoryId, ratio }, index) => {
      const categoryName = expenseCategoryMap.get(categoryId);
      if (categoryName === ExpenseCategoryName.OTHER_EXPENSE) {
        otherExpenseBudgetIndex = index;
      }

      const amount = Math.floor((totalAmount * ratio) / 1000) * 1000; // 1,000원 단위로 변환
      sum += amount;

      return { categoryId, categoryName, amount };
    });

    if (sum < totalAmount) {
      const remainder = totalAmount - sum;
      recommendedBudget[otherExpenseBudgetIndex].amount += remainder;
    }

    return recommendedBudget;
  }

  /**
   * 특정 사용자의 6개월 동안의 예산 데이터를 기반으로 카테고리별 가중 평균 비율을 계산
   */
  private async caculateWeightedAvgRatios(
    userId: string,
    year: number,
    month: number,
  ): Promise<{ categoryId: number; ratio: number }[]> {
    const query = `
      -- 월별 카테고리별 예산, 월별 총 예산 계산
      WITH monthly_data AS (
          SELECT
            b.year,
            b.month,
            bc.category_id,
            bc.amount AS category_amount,
            b.total_amount AS total_budget_amount
          FROM
              budgets b
          INNER JOIN
              budget_category bc ON b.id = bc.budget_id
          WHERE
              b.user_id = '${userId}'
            AND 
              TO_DATE(b.year || '-' || b.month, 'YYYY-MM') >= TO_DATE(${year} || '-' || ${month}, 'YYYY-MM') - INTERVAL '6 months'
            AND 
              TO_DATE(b.year || '-' || b.month, 'YYYY-MM') < TO_DATE(${year} || '-' || ${month}, 'YYYY-MM')    
      )	
      -- 최종적으로 각 카테고리 가중 평균 비율을 소수점 둘째 자리까지 계산
      SELECT
          category_id,
          TRUNC(SUM(category_amount) / SUM(total_budget_amount), 2) AS ratio
      FROM
          monthly_data
      GROUP BY
          category_id
      ORDER BY
        category_id ASC;
    `;

    const results = await this.budgetRepo.query(query);

    return results.map(({ category_id, ratio }) => ({ categoryId: category_id, ratio: Number(ratio) }));
  }
}
