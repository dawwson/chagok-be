import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';

import { CategoryService } from './service/category.service';
import { CategoryShowResponse } from './dto/response/category-show.response';
import { ApiSuccessResponse } from '@src/shared/decorator/api-success-response.decorator';

@ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ✅ 카데고리 목록 조회
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '서비스에서 제공하는 기본 카테고리와 사용자 지정 카테고리를 포함하여 모든 카테고리 목록을 조회합니다.',
  })
  @ApiSuccessResponse({ status: 200, type: CategoryShowResponse, isArray: true })
  @Get()
  async getCategoryList() {
    const categories = await this.categoryService.getCategories();
    return CategoryShowResponse.from(categories);
  }
}
