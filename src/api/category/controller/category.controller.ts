import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../../shared/guard/jwt-auth.guard';

import { CategoryService } from '../service/category.service';
import { CategoryShowResponse } from './dto/response/category-show.response';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategoryList() {
    const categories = await this.categoryService.getCategories();
    return CategoryShowResponse.from(categories);
  }
}
