import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IncomeCategoryName, ExpenseCategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: IncomeCategoryName | ExpenseCategoryName;

  @Column({ type: 'varchar', length: 20 })
  type: TxType;

  static createIncomeCategory(name: IncomeCategoryName) {
    const category = new Category();
    category.name = name;
    category.type = TxType.INCOME;
    return category;
  }

  static createExpenseCategory(name: ExpenseCategoryName) {
    const category = new Category();
    category.name = name;
    category.type = TxType.EXPENSE;
    return category;
  }
}
