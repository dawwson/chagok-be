import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BudgetMonth } from '../shared/enum/budget-month.enum';
import { Category } from './category.entity';

@Entity('expenses')
@Check(`"amount" > 0`)
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 100 })
  content: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isExcluded: boolean;

  @Column({ type: 'varchar', length: 10 })
  year: string;

  @Column({ type: 'varchar', length: 10 })
  month: BudgetMonth;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date;
}
