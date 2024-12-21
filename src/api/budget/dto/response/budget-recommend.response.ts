import {
  ApiBudgetCategoryAmount,
  ApiBudgetMonth,
  ApiBudgets,
  ApiBudgetYear,
  ApiCategoryId,
  ApiCategoryName,
} from '@src/shared/decorator/api-custom-property.decorator';

class BudgetByCategoryWithName {
  @ApiCategoryId()
  categoryId: number;

  @ApiCategoryName()
  categoryName: string;

  @ApiBudgetCategoryAmount()
  amount: number;
}

export class BudgetRecommendResponse {
  @ApiBudgetYear({ description: '추천할 예산 연도 (YYYY)' })
  year: number;

  @ApiBudgetMonth({ description: '추천할 예산 월 (M~MM)' })
  month: number;

  @ApiBudgets({ description: '카테고리별 추천 예산 (없으면 빈 배열)', type: BudgetByCategoryWithName })
  budgets: BudgetByCategoryWithName[];

  static from(year: number, month, budgets: BudgetByCategoryWithName[]) {
    const budgetRecommendResponse = new BudgetRecommendResponse();
    budgetRecommendResponse.year = year;
    budgetRecommendResponse.month = month;
    budgetRecommendResponse.budgets = budgets;

    return budgetRecommendResponse;
  }
}
