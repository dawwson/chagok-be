import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';

import { CategoryService } from './service/category.service';
import { CategoryShowResponse } from './dto/response/category-show.response';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategoryList() {
    const categories = await this.categoryService.getCategories();
    return CategoryShowResponse.from(categories);
  }
}
