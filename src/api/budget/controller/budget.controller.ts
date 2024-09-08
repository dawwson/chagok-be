import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request-with-user.interface';

import { BudgetUpdateRequestBody, BudgetUpdateRequestParam } from './dto/request/budget-update.request';
import { BudgetRecommendRequestParam, BudgetRecommendRequestQuery } from './dto/request/budget-recommend.request';
import { BudgetUpdateResponse } from './dto/response/budget-update.response';
import { BudgetRecommendResponse } from './dto/response/budget-recommend.response';

import { CreateBudgetInput } from '../service/dto/input/budget-create.input';
import { UpdateBudgetInput } from '../service/dto/input/budget-update.input';
import { BudgetRecommendInput } from '../service/dto/input/budget-recommend.input';
import { SetBudgetService } from '../service/set-budget.service';
import { RecommendBudgetService } from '../service/recommend-budget.service';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(
    private readonly setBudgetService: SetBudgetService,
    private readonly recommendBudgetService: RecommendBudgetService,
  ) {}

  // TODO: 생성, 수정 API 분리
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
}
