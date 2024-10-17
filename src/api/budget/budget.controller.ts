import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request-with-user.interface';

import { BudgetCreateRequest } from './dto/request/budget-create.request';
import { BudgetCreateResponse } from './dto/response/budget-create.response';
import { BudgetFindRequest } from './dto/request/budget-find.request';
import { BudgetFindResponse } from './dto/response/budget-find.response';
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

  // TODO: 🚧 예산 수정
  @UseGuards(OwnBudgetGuard)
  @Put(':id')
  updateBudget(@Req() req: RequestWithUser, @Param('id') budgetId: number, @Body() dto) {
    return 'update budget';
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

  // TODO: 🚧 예산 추천
  @Get(':year/:month/recommendation')
  recommendBudget() {
    return 'recommend budget';
  }

  /*
  @Put(':year/:month')
  async setMonthlyBudget(
    @Req() req: RequestWithUser,
    @Param() param: BudgetUpdateRequestParam,
    @Body() body: BudgetUpdateRequestBody,
  ) {
    let budget = await this.setBudgetService.findBudget({
      userId: req.user.id,
      year: param.year,
      month: param.month,
    });

    // 이미 있으면 업데이트, 없으면 새로 생성
    if (budget) {
      const updateBudgetInput = new UpdateBudgetInput();
      updateBudgetInput.budgetId = budget.id;
      updateBudgetInput.budgetsByCategory = body.budgetsByCategory;

      await this.setBudgetService.updateBudget(updateBudgetInput);
    } else {
      const createBudgetInput = new CreateBudgetInput();
      createBudgetInput.userId = req.user.id;
      createBudgetInput.year = param.year;
      createBudgetInput.month = param.month;
      createBudgetInput.budgetsByCategory = body.budgetsByCategory;

      budget = await this.setBudgetService.createBudget(createBudgetInput);
    }

    budget = await this.setBudgetService.getBudgetWithCategory(budget.id);
    return BudgetUpdateResponse.from(budget);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:year/:month/recommendation')
  async recommendMonthlyBudget(
    @Req() req: RequestWithUser,
    @Param() param: BudgetRecommendRequestParam,
    @Query() query: BudgetRecommendRequestQuery,
  ) {
    const budgetRecommendInput = new BudgetRecommendInput();
    budgetRecommendInput.userId = req.user.id;
    budgetRecommendInput.year = param.year;
    budgetRecommendInput.month = param.month;
    budgetRecommendInput.totalAmount = query.totalAmount;

    const { budgetsByCategory } = await this.recommendBudgetService.recommendBudgetByCategory(budgetRecommendInput);

    return BudgetRecommendResponse.builder()
      .year(param.year)
      .month(param.month)
      .budgetsByCategory(budgetsByCategory)
      .build();
  }
      */
}
