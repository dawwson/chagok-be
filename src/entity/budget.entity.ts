import {
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
import { BudgetMonth } from '../shared/enum/budget-month.enum';

@Entity('budgets')
@Unique('UQ_USER_ID_YEAR_MONTH', ['user', 'year', 'month'])
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
    cascade: ['insert'],
  })
  budgetCategories: BudgetCategory[];

  @Column({ type: 'varchar', length: 10 })
  year: string;

  @Column({ type: 'varchar', length: 10 })
  month: BudgetMonth;

  @Column({ type: 'integer' })
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;
}
