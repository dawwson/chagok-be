import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { BudgetService } from './service/budget.service';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { SetMonthlyBudgetRequestParam } from './dto/set-monthly-budget-request-param.dto';
import { SetMonthlyBudgetRequestBody } from './dto/set-monthly-budget-request-body.dto';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Put(':year/:month')
  setMonthlyBudget(
    @Param() { year, month }: SetMonthlyBudgetRequestParam,
    @Body() budgetByCategory: SetMonthlyBudgetRequestBody,
  ) {
    return budgetByCategory;
  }
}
