import { IsNumber, IsPositive } from 'class-validator';

export class BudgetByCategory {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}
