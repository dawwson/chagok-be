import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

export class GetBudgetByYearAndMonthDto {
  year: string;
  month: BudgetMonth;
  userId: string;
}
