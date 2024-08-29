import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Budget } from '../../../entity/budget.entity';
import { BudgetCategory } from '../../../entity/budget-category.entity';
import { Category } from '../../../entity/category.entity';

import { CreateBudgetInput } from './dto/input/budget-create.input';
import { FindBudgetInput } from './dto/input/budget-find.input';
import { UpdateBudgetInput } from './dto/input/budget-update.input';

@Injectable()
export class SetBudgetService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findBudget(dto: FindBudgetInput): Promise<Budget> {
    return this.budgetRepo.findOneBy({
      userId: dto.userId,
      year: dto.year,
      month: dto.month,
    });
  }

  async createBudget(dto: CreateBudgetInput) {
    // 모든 카테고리 조회
    const categories = await this.categoryRepo.find();

    // BudgetCategory 생성
    const budgetCategories = categories.reduce((budgetCategories, category) => {
      const budgetCategory = new BudgetCategory();

      const budgetByCategory = dto.budgetsByCategory.find(({ categoryId }) => categoryId === category.id);

      // 사용자가 설정하지 않은 카테고리의 예산은 0으로 설정
      budgetCategory.categoryId = category.id;
      budgetCategory.amount = budgetByCategory?.amount ?? 0;
      budgetCategories.push(budgetCategory);

      return budgetCategories;
    }, [] as BudgetCategory[]);

    // Budget 생성
    const newBudget = new Budget();
    newBudget.year = dto.year;
    newBudget.month = dto.month;
    newBudget.userId = dto.userId;
    newBudget.totalAmount = dto.calculateTotalAmount();
    newBudget.budgetCategories = budgetCategories;

    return this.budgetRepo.save(newBudget);
  }

  async updateBudget(dto: UpdateBudgetInput) {
    // 모든 카테고리 조회
    const categories = await this.categoryRepo.find();

    // BudgetCategory 생성
    const newBudgetCategories = categories.reduce((budgetCategories, category) => {
      const budgetCategory = new BudgetCategory();

      const budgetByCategory = dto.budgetsByCategory.find(({ categoryId }) => categoryId === category.id);

      // 사용자가 설정하지 않은 카테고리의 예산은 0으로 설정
      budgetCategory.budgetId = dto.budgetId;
      budgetCategory.categoryId = category.id;
      budgetCategory.amount = budgetByCategory?.amount ?? 0;
      budgetCategory.updatedAt = new Date();
      budgetCategories.push(budgetCategory);

      return budgetCategories;
    }, [] as BudgetCategory[]);

    // === START TRANSACTION ===
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1. Budget totalAmount 업데이트
      await qr.manager.update(Budget, dto.budgetId, {
        totalAmount: dto.calculateTotalAmount(),
      });
      // 2. 기존 BudgetCategory에 덮어쓰기
      await qr.manager.upsert(BudgetCategory, newBudgetCategories, ['budgetId', 'categoryId']);

      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await qr.release();
    }
  }

  getBudgetWithCategory(budgetId: number) {
    return this.budgetRepo.findOne({
      where: { id: budgetId },
      relations: { budgetCategories: true },
    });
  }
}
