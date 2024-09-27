import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: CategoryName;

  @Column({ type: 'varchar', length: 20 })
  type: TxType;
}
