import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { GetBudgetRecommendationDto } from '../dto/get-budget-recommendation.dto';

import { Budget } from '../../../entity/budget.entity';
import { Category } from '../../../entity/category.entity';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';
import { CategoryName } from '../../../shared/enum/category-name.enum';

@Injectable()
export class RecommendBudgetService {
  constructor(private readonly dataSource: DataSource) {}

  async getBudgetRecommendation({
    userId,
    year,
    month,
    totalAmount,
  }: GetBudgetRecommendationDto): Promise<Map<number, number>> {
    const budgetsByCategoryMap = new Map(); // key: 카테고리 id, value: 카테고리 예산

    const avgRatiosByCategory = await this.getAvgRatiosByCategory(
      userId,
      year,
      month,
    );

    // 총 예산과 비교할 합계
    let sum = 0;

    avgRatiosByCategory.forEach(({ categoryId, avgRatio }) => {
      // 문자열 비율(단위: %)를 number로 변환
      const dirtyAmount = (totalAmount * parseInt(avgRatio)) / 100;
      // 100의 자리에서 버림(1000원 단위로 변환)
      const recommendedAmount = Math.floor(dirtyAmount / 100) * 100;
      // 총 예산과 비교하기 위해 더함
      sum += recommendedAmount;

      budgetsByCategoryMap.set(categoryId, recommendedAmount);
    });

    if (sum === totalAmount) {
      return budgetsByCategoryMap;
    }
    // NOTE: 100원 단위 버림으로 인해 총 예산과 일치하지 않을 경우
    const etcCategory = await this.dataSource
      .getRepository(Category)
      .findOneBy({ name: CategoryName.ETC });

    // 기타 카테고리로 채워져야 하는 금액
    const remainder = totalAmount - sum;

    // 이미 기타 카테고리의 예산이 있으면 그 값에 더하고, 없으면 새로 저장
    let etcAmount = budgetsByCategoryMap.get(etcCategory.id);

    budgetsByCategoryMap.set(
      etcCategory.id,
      etcAmount ? etcAmount + remainder : remainder,
    );

    return budgetsByCategoryMap;
  }

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
          .andWhere(
            `TO_DATE(year || '-' || month, 'YYYY-MM') < TO_DATE('${year}-${month}', 'YYYY-MM')`,
          )
          .groupBy('b.year')
          .addGroupBy('b.month')
          .addGroupBy('bc.categoryId');
      }, 'category_ratios')
      .groupBy('"category_ratios"."categoryId"')
      .getRawMany();
  }

  /*
  <Raw Query>
    select
      "category_ratios"."categoryId" as "categoryId",
      AVG(ratio) as "avgPercentage"
    from
      (
        select
          "b"."year" as "year",
          "b"."month" as "month",
          "bc"."category_id" as "categoryId",
          AVG("bc"."amount" * 100 / "b"."total_amount") as "ratio"
        from
          "budgets" "b"
        inner join "budget_category" "bc" on
          "bc"."budget_id" = "b"."id"
          and ("b"."id" = "bc"."budget_id")
        where
          "b"."user_id" = '988028bb-8368-4bf0-b702-c3a9ca078ebe'
          and TO_DATE("b"."year" || '-' || "b"."month", 'YYYY-MM') >= TO_DATE('2023-03', 'YYYY-MM') - interval '6 months'
          and TO_DATE(year || '-' || month, 'YYYY-MM') < TO_DATE('2023-03', 'YYYY-MM')
        group by
          "b"."year",
          "b"."month",
          "bc"."category_id"
      ) "category_ratios"
    group by
      "category_ratios"."categoryId";
   */
}
