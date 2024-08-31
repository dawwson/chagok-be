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
  private _id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  private _user: User;

  @Column({ name: 'user_id' })
  private _userId: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  private _category: Category;

  @Column({ name: 'category_id' })
  private _categoryId: number;

  @Column({ name: 'content', type: 'varchar', length: 100 })
  private _content: string;

  @Column({ name: 'amount', type: 'integer' })
  private _amount: number;

  @Column({ name: 'is_excluded', type: 'boolean', default: false })
  private _isExcluded: boolean;

  @Column({ name: 'expense_date', type: 'timestamp with time zone' })
  private _expenseDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  private _createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
  private _updatedAt?: Date;

  constructor(
    userId: string,
    categoryId: number,
    content: string,
    amount: number,
    isExcluded: boolean,
    expenseDate: Date,
  ) {
    this._userId = userId;
    this._categoryId = categoryId;
    this._content = content;
    this._amount = amount;
    this._isExcluded = isExcluded;
    this._expenseDate = expenseDate;
  }

  static builder() {
    return new Builder();
  }

  get id() {
    return this._id;
  }

  get user() {
    return this._user;
  }

  get userId() {
    return this._userId;
  }

  get category() {
    return this._category;
  }

  get categoryId() {
    return this._categoryId;
  }

  get content() {
    return this._content;
  }

  get amount() {
    return this._amount;
  }

  get isExcluded() {
    return this._isExcluded;
  }

  get expenseDate() {
    return this._expenseDate;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

class Builder {
  private _userId: string;
  private _categoryId: number;
  private _content: string;
  private _amount: number;
  private _isExcluded: boolean;
  private _expenseDate: Date;

  constructor() {}

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
      this._userId,
      this._categoryId,
      this._content,
      this._amount,
      this._isExcluded,
      this._expenseDate,
    );
  }
}
