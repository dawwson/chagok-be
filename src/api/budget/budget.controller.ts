import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SetMonthlyBudgetRequestParam } from './dto/set-monthly-budget-request-param.dto';
import { SetMonthlyBudgetRequestBody } from './dto/set-monthly-budget-request-body.dto';
import { SetMonthlyBudgetResponseData } from './dto/set-monthly-budget-response-data.dto';
import { GetMonthlyBudgetRecommendationRequestQuery } from './dto/get-monthly-budget-recommendation-request-query.dto';

import { BudgetService } from './service/budget.service';

import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';
import { GetMonthlyBudgetRecommendationRequestParam } from './dto/get-monthly-budget-recommendation-request-param.dto';
import { BudgetRecommendationService } from './service/budget-recommendation.service';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetRecommendationService: BudgetRecommendationService,
  ) {}

  @Put(':year/:month')
  async setMonthlyBudget(
    @Req() req: RequestWithUser,
    @Param() { year, month }: SetMonthlyBudgetRequestParam,
    @Body() { budgetsByCategory }: SetMonthlyBudgetRequestBody,
  ) {
    // NOTE: CQS 패턴 => Command는 상태 변경만 하고 값을 반환하지 않음 & Query는 값을 반환만 하고 상태를 변경하지 않음
    await this.budgetService.createOrUpdateBudget({
      userId: req.user.id,
      year,
      month,
      budgetsByCategory,
    });

    const budget = await this.budgetService.getBudgetByYearAndMonth({
      userId: req.user.id,
      year,
      month,
    });

    return {
      message: SuccessMessage.BUDGET_SET_MONTHLY,
      data: SetMonthlyBudgetResponseData.of(budget),
    };
  }

  @Get('/:year/:month/recommendation')
  async getMonthlyBudgetRecommendation(
    @Req() req: RequestWithUser,
    @Param() { year, month }: GetMonthlyBudgetRecommendationRequestParam,
    @Query() { totalAmount }: GetMonthlyBudgetRecommendationRequestQuery,
  ) {
    const budgetsByCategoryMap =
      await this.budgetRecommendationService.getBudgetRecommendation({
        userId: req.user.id,
        year,
        month,
        totalAmount,
      });
    const budgetsByCategory = [];
    budgetsByCategoryMap.forEach((amount, categoryId) =>
      budgetsByCategory.push({ categoryId, amount }),
    );

    return {
      message: SuccessMessage.BUDGET_GET_RECOMMENDATION,
      data: budgetsByCategory,
    };
  }
}
