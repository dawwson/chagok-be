export class GetExpensesCondition {
  userId: string;
  startDate: number;
  endDate: number;
  categoryId?: number;
  minAmount?: number;
  maxAmount?: number;
}
