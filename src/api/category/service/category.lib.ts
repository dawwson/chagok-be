import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '@src/entity/category.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

@Injectable()
export class CategoryLib {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // TODO: 제거
  async isExist(id: number) {
    return !!(await this.categoryRepo.findOneBy({ id }));
  }

  async validateCategoryId(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
    }
  }
}
