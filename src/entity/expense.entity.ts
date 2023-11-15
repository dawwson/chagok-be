import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Budget } from './budget.entity';
import { Category } from './category.entity';

@Entity('expenses')
@Check(`"amount" > 0`)
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Budget)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @Column()
  budgetId: number;

  @OneToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  categoryId: number;

  @Column({ type: 'varchar', length: 100 })
  content: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isExcluded: boolean;

  @Column({ type: 'timestamp with time zone' })
  expenseDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;
}
