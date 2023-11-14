import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMonthlyBudgetRecommendationRequestQuery {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
