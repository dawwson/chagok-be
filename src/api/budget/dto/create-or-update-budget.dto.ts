import { BudgetByCategory } from './set-monthly-budget-request-body.dto';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

export class CreateOrUpdateBudgetDto {
  userId: string;
  year: string;
  month: BudgetMonth;
  budgetsByCategory: BudgetByCategory[];
}
