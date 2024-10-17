import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BudgetCategory } from './budget-category.entity';

const MAX_AMOUNT = 200000000; // 20억

@Entity('budgets')
@Unique('UQ_USER_ID_YEAR_MONTH', ['user', 'year', 'month'])
@Check(`"total_amount" >= 0 AND "total_amount" <= ${MAX_AMOUNT}`)
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  // 양방향 : Budget -> BudgetCategory
  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.budget, {
    // eager: true, // budget 조회할 때 budgetCategory를 자동 load
    cascade: ['insert'], // budget 삽입할 때 budgetCategory를 자동 insert
  })
  budgetCategories: BudgetCategory[];

  @Column({ type: 'smallint' })
  year: number;

  @Column({ type: 'smallint' })
  month: number;

  @Column({ type: 'integer' }) // -2147483648 ~ +2147483647
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  static maxTotalAmount() {
    return MAX_AMOUNT;
  }

  static builder() {
    return new Builder();
  }
}

class Builder {
  private budget: Budget;

  constructor() {
    this.budget = new Budget();
  }

  id(id: number) {
    this.budget.id = id;
    return this;
  }

  userId(userId: string) {
    this.budget.userId = userId;
    return this;
  }

  budgetCategories(budgetCategories: BudgetCategory[]) {
    this.budget.budgetCategories = budgetCategories;
    this.budget.totalAmount = budgetCategories.reduce((acc, bc) => (acc += bc.amount), 0);
    return this;
  }

  year(year: number) {
    this.budget.year = year;
    return this;
  }

  month(month: number) {
    this.budget.month = month;
    return this;
  }

  build() {
    return this.budget;
  }
}
