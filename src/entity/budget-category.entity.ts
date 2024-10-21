import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { Category } from './category.entity';

const MAX_AMOUNT = 1000000000; // 10억

@Entity('budget_category')
@Unique('UQ_BUDGET_ID_CATEGORY_ID', ['budget', 'category'])
@Check(`"amount" >= 0 AND "amount" <= ${MAX_AMOUNT}`)
export class BudgetCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Budget, (budget) => budget.budgetCategories, { nullable: false })
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @Column()
  budgetId: number;

  @ManyToOne(() => Category, {
    // eager: true, // budgetCatogory 조회할 때 category를 자동 load
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ unique: false })
  categoryId: number;

  @Column({ type: 'integer' })
  amount: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  static getMaxAmount() {
    return MAX_AMOUNT;
  }

  static builder() {
    return new Builder();
  }
}

class Builder {
  private budgetCategory: BudgetCategory;

  constructor() {
    this.budgetCategory = new BudgetCategory();
  }

  categoryId(categoryId: number) {
    this.budgetCategory.categoryId = categoryId;
    return this;
  }

  amount(amount: number) {
    this.budgetCategory.amount = amount;
    return this;
  }

  build(): BudgetCategory {
    return this.budgetCategory;
  }
}
