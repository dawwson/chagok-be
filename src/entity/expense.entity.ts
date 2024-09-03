import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('expenses')
@Check(`"amount" > 0`)
export class Expense {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'content', type: 'varchar', length: 100 })
  content: string;

  @Column({ name: 'amount', type: 'integer' })
  amount: number;

  @Column({ name: 'is_excluded', type: 'boolean', default: false })
  isExcluded: boolean;

  @Column({ name: 'expense_date', type: 'timestamp with time zone' })
  expenseDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
  updatedAt?: Date;

  constructor(
    id: number,
    userId: string,
    categoryId: number,
    content: string,
    amount: number,
    isExcluded: boolean,
    expenseDate: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.categoryId = categoryId;
    this.content = content;
    this.amount = amount;
    this.isExcluded = isExcluded;
    this.expenseDate = expenseDate;
  }

  static builder() {
    return new Builder();
  }
}

class Builder {
  private _id: number;
  private _userId: string;
  private _categoryId: number;
  private _content: string;
  private _amount: number;
  private _isExcluded: boolean;
  private _expenseDate: Date;

  constructor() {}

  id(id: number) {
    this._id = id;
    return this;
  }

  userId(userId: string) {
    this._userId = userId;
    return this;
  }

  categoryId(categoryId: number) {
    this._categoryId = categoryId;
    return this;
  }

  content(content: string) {
    this._content = content;
    return this;
  }

  amount(amount: number) {
    this._amount = amount;
    return this;
  }

  isExcluded(isExcluded: boolean) {
    this._isExcluded = isExcluded;
    return this;
  }

  expenseDate(expenseDate: Date) {
    this._expenseDate = expenseDate;
    return this;
  }

  build() {
    return new Expense(
      this._id,
      this._userId,
      this._categoryId,
      this._content,
      this._amount,
      this._isExcluded,
      this._expenseDate,
    );
  }
}
