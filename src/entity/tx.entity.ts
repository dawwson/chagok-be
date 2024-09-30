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
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';

@Entity('txs')
@Check(`"amount" > 0`)
export class Tx {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  categoryId: number;

  @Column({ type: 'varchar', length: 20 })
  txType: TxType;

  @Column({ type: 'varchar', length: 20 })
  txMethod: TxMethod;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column({ type: 'varchar', length: 100, default: '' })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isExcluded: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  static builder() {
    return new Builder();
  }
}

class Builder {
  private transaction: Tx;

  constructor() {
    this.transaction = new Tx();
  }

  userId(userId: string) {
    this.transaction.userId = userId;
    return this;
  }

  categoryId(categoryId: number) {
    this.transaction.categoryId = categoryId;
    return this;
  }

  txType(txType: TxType) {
    this.transaction.txType = txType;
    return this;
  }

  txMethod(txMethod: TxMethod) {
    this.transaction.txMethod = txMethod;
    return this;
  }

  amount(amount: number) {
    this.transaction.amount = amount;
    return this;
  }

  date(date: Date) {
    this.transaction.date = date;
    return this;
  }

  description(description: string): this {
    this.transaction.description = description;
    return this;
  }

  isExcluded(isExcluded: boolean): this {
    this.transaction.isExcluded = isExcluded;
    return this;
  }

  build() {
    return this.transaction;
  }
}
