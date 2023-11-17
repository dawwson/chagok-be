import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryName } from '../shared/enum/category-name.enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: CategoryName;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
