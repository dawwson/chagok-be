export class GetExpensesCondition {
  userId: string;
  startDate: Date;
  endDate: Date;
  categoryId?: number;
  minAmount?: number;
  maxAmount?: number;
}
