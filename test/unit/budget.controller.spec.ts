import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from '../../src/api/budget/budget.controller';
import { SetBudgetService } from '../../src/api/budget/service/set-budget.service';

describe('BudgetController', () => {
  let controller: BudgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [SetBudgetService],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
