import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { BudgetMonth } from 'src/shared/enum/budget-month.enum';

interface BudgetByCategory {
  categoryId: number;
  amount: number;
}

export class BudgetRecommendResponse {
  @Exclude()
  private readonly _year: string;

  @Exclude()
  private readonly _month: BudgetMonth;

  @Exclude()
  private readonly _budgetsByCategory: BudgetByCategory[];

  constructor(_year: string, _month: BudgetMonth, _budgetsByCategory: BudgetByCategory[]) {
    this._year = _year;
    this._month = _month;
    this._budgetsByCategory = _budgetsByCategory;
  }

  @Expose()
  get year(): string {
    return this._year;
  }

  @Expose()
  get month(): BudgetMonth {
    return this._month;
  }

  @Expose()
  get budgetsByCategory(): BudgetByCategory[] {
    return this._budgetsByCategory;
  }

  static builder() {
    return new Builder();
  }
}

class Builder {
  private _year: string;
  private _month: BudgetMonth;
  private _budgetsByCategory: BudgetByCategory[];

  constructor() {}

  year(year: string) {
    this._year = year;
    return this;
  }

  month(month: BudgetMonth) {
    this._month = month;
    return this;
  }

  budgetsByCategory(budgetsByCategory: BudgetByCategory[]) {
    this._budgetsByCategory = budgetsByCategory;
    return this;
  }

  build() {
    return new BudgetRecommendResponse(this._year, this._month, this._budgetsByCategory);
  }
}
