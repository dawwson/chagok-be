export interface StatExpenseInput {
  userId: string;
  year: number;
  month: number;
  view: 'monthly' | 'yearly';
}
