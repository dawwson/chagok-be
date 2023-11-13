import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';

import { SetMonthlyBudgetRequestParam } from './dto/set-monthly-budget-request-param.dto';
import { SetMonthlyBudgetRequestBody } from './dto/set-monthly-budget-request-body.dto';
import { SetMonthlyBudgetResponseData } from './dto/set-monthly-budget-response-data.dto';

import { BudgetService } from './service/budget.service';

import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';

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
}
