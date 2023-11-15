import { Test, TestingModule } from '@nestjs/testing';
import { SetBudgetService } from '../../src/api/budget/service/set-budget.service';

describe('BudgetService', () => {
  let service: SetBudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetBudgetService],
    }).compile();

    service = module.get<SetBudgetService>(SetBudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
