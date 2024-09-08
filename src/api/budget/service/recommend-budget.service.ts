import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Budget } from '@src/entity/budget.entity';
import { Category } from '@src/entity/category.entity';
import { BudgetMonth } from '@src/shared/enum/budget-month.enum';
import { CategoryName } from '@src/shared/enum/category-name.enum';

import { BudgetRecommendInput } from './dto/input/budget-recommend.input';
import { BudgetByCategory, RecommendBudgetOutput } from './dto/output/budget-recommend.output';

@Injectable()
export class RecommendBudgetService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  async recommendBudgetByCategory(dto: BudgetRecommendInput): Promise<RecommendBudgetOutput> {
    const { userId, year, month, totalAmount } = dto;

    const budgetsByCategory: BudgetByCategory[] = [];

    const avgRatiosByCategory = await this.getAvgRatiosByCategory(userId, year, month);

    const categories = await this.categoryRepo.find();

    // === 1. 6개월 내에 설정한 예산이 없는 경우 모든 예산을 기타 카테고리로 포함 ===
    const isEmptyIn6Months = avgRatiosByCategory.length === 0;

    if (isEmptyIn6Months) {
      categories.forEach((category) => {
        budgetsByCategory.push({
          categoryId: category.id,
          amount: category.name === CategoryName.ETC ? totalAmount : 0,
        });
      });

      return { budgetsByCategory };
    }

    // === 2. 6개월 내에 설정한 예산이 있는 경우 ===

    // 총 예산과 비교할 합계
    let sum = 0;
    let etcIndex = 0;

    categories.forEach(({ id, name }, index) => {
      etcIndex = name === CategoryName.ETC ? index : 0;

      const { categoryId, avgRatio } = avgRatiosByCategory.find(({ categoryId }) => categoryId === id);

      // 문자열 비율(단위: %)를 number로 변환
      const dirtyAmount = (totalAmount * parseInt(avgRatio)) / 100;
      // 10000원 단위로 변환
      const recommendedAmount = Math.floor(dirtyAmount / 1000) * 1000;
      // 총 예산과 비교하기 위해 더함
      sum += recommendedAmount;

      budgetsByCategory.push({ categoryId: categoryId, amount: recommendedAmount });
    });

    // 2-1. 합계가 총 예산과 일치하면, 비율대로 분배한 예산 반환
    if (sum === totalAmount) {
      return { budgetsByCategory };
    }

    // 2-2. 합계가 총 예산과 일치하지 않으면, 남은 금액은 기타 카테고리로 포함
    const remainder = totalAmount - sum;

    budgetsByCategory[etcIndex] = {
      ...budgetsByCategory[etcIndex],
      amount: budgetsByCategory[etcIndex].amount + remainder,
    };

    return { budgetsByCategory };
  }

  // TODO: Raw Query로 수정 + 서브쿼리 최소화 or 캐시
  /**
   * 특정 사용자의 월별 카테고리별 예산 비율의 이전 6개월 동안의 평균
   * @param userId 사용자 고유 식별자
   * @param year 예산 연도
   * @param month 예산 월
   * @private
   * @return { categoryId: 카테고리 고유 식별자, avgRatio: 카테고리 예산 비율 평균(단위: %) }
   */
  private getAvgRatiosByCategory(
    userId: string,
    year: string,
    month: BudgetMonth,
  ): Promise<{ categoryId: number; avgRatio: string }[]> {
    return this.dataSource
      .createQueryBuilder()
      .select('"category_ratios"."categoryId"', 'categoryId')
      .addSelect('AVG("category_ratios"."ratio")', 'avgRatio')
      .from((qb) => {
        return qb
          .select('b.year', 'year')
          .addSelect('b.month', 'month')
          .addSelect('bc.categoryId', 'categoryId')
          .addSelect('AVG(bc.amount * 100 / b.totalAmount)', 'ratio')
          .from(Budget, 'b')
          .innerJoin('b.budgetCategories', 'bc', 'b.id = bc.budgetId')
          .where(`b.userId = '${userId}'`)
          .andWhere(
            `TO_DATE(b.year || '-' || b.month, 'YYYY-MM') >= TO_DATE('${year}-${month}', 'YYYY-MM') - interval '6 months'`,
          )
          .andWhere(`TO_DATE(year || '-' || month, 'YYYY-MM') < TO_DATE('${year}-${month}', 'YYYY-MM')`)
          .groupBy('b.year')
          .addGroupBy('b.month')
          .addGroupBy('bc.categoryId');
      }, 'category_ratios')
      .groupBy('"category_ratios"."categoryId"')
      .getRawMany();
  }
}
