import { Controller } from '@nestjs/common';
import { BudgetService } from './service/budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}
}
