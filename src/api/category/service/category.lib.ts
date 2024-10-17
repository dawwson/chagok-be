import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Category } from '@src/entity/category.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { ExpenseCategoryName } from '@src/shared/enum/category-name.enum';

@Injectable()
export class CategoryLib {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async validateCategoryId(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
    }
  }

  async validateExpenseCategory(ids: number[]) {
    const found = await this.categoryRepo.findBy({ id: In(ids), type: TxType.EXPENSE });

    if (found.length !== Object.keys(ExpenseCategoryName).length) {
      throw new NotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
    }
  }

  getExpenseCategories() {
    return this.categoryRepo.findBy({ type: TxType.EXPENSE });
  }
}
