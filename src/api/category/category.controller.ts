import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { GetCategoryListResponse } from './dto/get-category-list-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategoryList() {
    const categories = await this.categoryService.getCategories();
    return {
      message: SuccessMessage.CATEGORY_GET_ALL,
      data: GetCategoryListResponse.of(categories),
    };
  }
}
