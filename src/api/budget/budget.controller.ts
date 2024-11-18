import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { BudgetCreateRequest } from './dto/request/budget-create.request';
import { BudgetCreateResponse } from './dto/response/budget-create.response';
import { BudgetFindRequest } from './dto/request/budget-find.request';
import { BudgetFindResponse } from './dto/response/budget-find.response';
import { BudgetUpdateRequest } from './dto/request/budget-update.request';
import { BudgetUpdateResponse } from './dto/response/budget-update.response';
import { BudgetRecommendRequestParam, BudgetRecommendRequestQuery } from './dto/request/budget-recommend.request';
import { BudgetRecommendResponse } from './dto/response/budget-recommend.response';
import { OwnBudgetGuard } from './guard/own-budget.guard';
import { BudgetService } from './service/budget.service';

import { CategoryLib } from '../category/service/category.lib';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly categoryLib: CategoryLib,
  ) {}

  @Post()
  async registerBudget(@Req() req: RequestWithUser, @Body() dto: BudgetCreateRequest) {
    const userId = req.user.id;
    const budget = await this.budgetService.createBudget({ userId, ...dto });

    return BudgetCreateResponse.from(budget);
  }

  @UseGuards(OwnBudgetGuard)
  @Put(':id')
  async updateBudget(@Param('id') budgetId: number, @Body() dto: BudgetUpdateRequest) {
    await this.budgetService.updateBudget(budgetId, dto);
    const budget = await this.budgetService.getBudgetById(budgetId);

    return BudgetUpdateResponse.from(budget);
  }

  @Get(':year/:month')
  async findBudget(@Req() req: RequestWithUser, @Param() { year, month }: BudgetFindRequest) {
    const userId = req.user.id;
    const budget = await this.budgetService.getOwnBudgetByYearAndMonth(userId, year, month);

    if (!budget) {
      const categories = await this.categoryLib.getExpenseCategories();
      return BudgetFindResponse.emptyBudgetFrom(year, month, categories);
    }

    return BudgetFindResponse.from(budget);
  }

  @Get(':year/:month/recommendation')
  async recommendBudget(
    @Req() req: RequestWithUser,
    @Param() param: BudgetRecommendRequestParam,
    @Query() query: BudgetRecommendRequestQuery,
  ) {
    const userId = req.user.id;
    const recommendation = await this.budgetService.getBudgetRecommendation({
      userId,
      year: param.year,
      month: param.month,
      totalAmount: query.totalAmount,
    });

    return BudgetRecommendResponse.from(param.year, param.month, recommendation);
  }
}
