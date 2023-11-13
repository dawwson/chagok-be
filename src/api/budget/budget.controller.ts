import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';

import { SetMonthlyBudgetRequestParam } from './dto/set-monthly-budget-request-param.dto';
import { SetMonthlyBudgetRequestBody } from './dto/set-monthly-budget-request-body.dto';
import { SetMonthlyBudgetResponseData } from './dto/set-monthly-budget-response-data.dto';

import { BudgetService } from './service/budget.service';

import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';
import { SuccessMessage } from '../../shared/enum/success-message.enum';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Put(':year/:month')
  async setMonthlyBudget(
    @Req() req: RequestWithUser,
    @Param() { year, month }: SetMonthlyBudgetRequestParam,
    @Body() { budgetsByCategory }: SetMonthlyBudgetRequestBody,
  ) {
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
}
