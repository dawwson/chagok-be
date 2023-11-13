import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { BudgetService } from './service/budget.service';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { SetMonthlyBudgetRequestParam } from './dto/set-monthly-budget-request-param.dto';
import { SetMonthlyBudgetRequestBody } from './dto/set-monthly-budget-request-body.dto';
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
    await this.budgetService.createOrUpdateBudget({
      userId: req.user.id,
      year,
      month,
      budgetsByCategory,
    });

    return { message: '', data: '' };
  }
}
