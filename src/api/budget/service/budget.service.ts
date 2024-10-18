import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CategoryLib } from '@src/api/category/service/category.lib';
import { Budget } from '@src/entity/budget.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

import { BudgetCreateInput } from '../dto/input/budget-create.input';
import { BudgetUpdateInput } from '../dto/input/budget-update.input';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    private readonly categoryLib: CategoryLib,
    private readonly dataSource: DataSource,
  ) {}

  getBudgetById(id: number) {
    return this.budgetRepo.findOne({
      where: { id },
      relations: { budgetCategories: true },
    });
  }

  getOwnBudgetByYearAndMonth(userId: string, year: number, month: number) {
    return this.budgetRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.budgetCategories', 'bc')
      .leftJoinAndSelect('bc.category', 'c')
      .where('b.userId = :userId', { userId })
      .andWhere('b.year = :year', { year })
      .andWhere('b.month = :month', { month })
      .orderBy('bc.categoryId', 'ASC')
      .getOne();
    // return this.budgetRepo.findOne({
    //   where: { userId, year, month },
    //   relations: ['budgetCategories', 'budgetCategories.category'],
    // });

    // query: SELECT "Budget"."id" AS "Budget_id", "Budget"."user_id" AS "Budget_user_id", "Budget"."year" AS "Budget_year", "Budget"."month" AS "Budget_month", "Budget"."total_amount" AS "Budget_total_amount", "Budget"."created_at" AS "Budget_created_at", "Budget"."updated_at" AS "Budget_updated_at", "Budget__Budget_budgetCategories"."id" AS "Budget__Budget_budgetCategories_id", "Budget__Budget_budgetCategories"."budget_id" AS "Budget__Budget_budgetCategories_budget_id", "Budget__Budget_budgetCategories"."category_id" AS "Budget__Budget_budgetCategories_category_id", "Budget__Budget_budgetCategories"."amount" AS "Budget__Budget_budgetCategories_amount", "Budget__Budget_budgetCategories"."created_at" AS "Budget__Budget_budgetCategories_created_at", "Budget__Budget_budgetCategories"."updated_at" AS "Budget__Budget_budgetCategories_updated_at", "9aa4f9967660128cbb3a0ed5befb832266421473"."id" AS "9aa4f9967660128cbb3a0ed5befb832266421473_id", "9aa4f9967660128cbb3a0ed5befb832266421473"."name" AS "9aa4f9967660128cbb3a0ed5befb832266421473_name", "9aa4f9967660128cbb3a0ed5befb832266421473"."type" AS "9aa4f9967660128cbb3a0ed5befb832266421473_type" FROM "budgets" "Budget" LEFT JOIN "budget_category" "Budget__Budget_budgetCategories" ON "Budget__Budget_budgetCategories"."budget_id"="Budget"."id"  LEFT JOIN "categories" "9aa4f9967660128cbb3a0ed5befb832266421473" ON "9aa4f9967660128cbb3a0ed5befb832266421473"."id"="Budget__Budget_budgetCategories"."category_id" WHERE ( ("Budget"."user_id" = $1 AND "Budget"."year" = $2 AND "Budget"."month" = $3) ) AND ( "Budget"."id" IN (30) ) -- PARAMETERS: ["f131cfc0-0fb0-4208-804b-1b0f7b8aac38",2024,11]
  }

  async createBudget(dto: BudgetCreateInput) {
    const { userId, year, month, budgets } = dto;

    // 모두 지출 카테고리인지 검증
    await this.categoryLib.validateExpenseCategory(budgets.map((b) => b.categoryId));

    const budget = Budget.builder()
      .userId(userId)
      .year(year)
      .month(month)
      .totalAmount(budgets.reduce((acc, { amount }) => (acc += amount), 0))
      .budgetCategories(
        budgets.map((b) => {
          return BudgetCategory.builder() //
            .categoryId(b.categoryId) //
            .amount(b.amount)
            .build();
        }),
      )
      .build();

    try {
      return await this.budgetRepo.save(budget);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ErrorCode.BUDGET_IS_DUPLICATED);
      }
    }
  }

  async updateBudget(id: number, dto: BudgetUpdateInput) {
    const { budgets } = dto;

    // 모두 지출 카테고리인지 검증
    await this.categoryLib.validateExpenseCategory(budgets.map((b) => b.categoryId));

    // === START OF TRANSACTION ===
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalAmount = 0;

      const current = new Map(
        (await qr.manager.findBy(BudgetCategory, { budgetId: id })).map((bc) => [bc.categoryId, bc]),
      );
      const queries = [];

      budgets.forEach((b) => {
        const bc = current.get(b.categoryId);
        const isModified = bc.amount !== b.amount;

        if (isModified) {
          queries.push(qr.manager.update(BudgetCategory, bc.id, { amount: b.amount }));
        }
        totalAmount += b.amount;
      });

      if (queries.length > 0) {
        // Budget, BudgetCategory 업데이트
        await Promise.all([...queries, qr.manager.update(Budget, { id }, { totalAmount })]);
      }

      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();

      if (error.code === '23514') {
        // 23514: violates check constraint
        throw new BadRequestException(ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE);
      }
      throw error;
    } finally {
      await qr.release();
    }
    // === END OF TRANSACTION ===
  }
}
