import { Exclude, Expose } from 'class-transformer';
import { Expense } from 'src/entity/expense.entity';

@Exclude()
export class ExpenseRegisterResponse {
  private readonly _id: number;
  private readonly _categoryId: number;
  private readonly _content: string;
  private readonly _amount: number;
  private readonly _isExcluded: boolean;
  private readonly _expenseDate: Date;
  private readonly _createdAt: Date;

  constructor(expense: Expense) {
    this._id = expense.id;
    this._categoryId = expense.categoryId;
    this._content = expense.content;
    this._amount = expense.amount;
    this._isExcluded = expense.isExcluded;
    this._expenseDate = expense.expenseDate;
    this._createdAt = expense.createdAt;
  }

  @Expose() get id() {
    return this._id;
  }

  @Expose()
  get categoryId() {
    return this._categoryId;
  }

  @Expose()
  get content() {
    return this._content;
  }

  @Expose()
  get amount() {
    return this._amount;
  }

  @Expose()
  get expenseDate() {
    return this._expenseDate;
  }

  @Expose()
  get isExcluded() {
    return this._isExcluded;
  }

  @Expose()
  get createdAt() {
    return this._createdAt;
  }
}
