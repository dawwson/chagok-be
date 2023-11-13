import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from '../../src/api/budget/budget.controller';
import { BudgetService } from '../../src/api/budget/service/budget.service';

describe('BudgetController', () => {
  let controller: BudgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [BudgetService],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
