import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { RequestWithBudget } from '@src/shared/interface/request-with-user.interface';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { BudgetLib } from '../service/budget.lib';

@Injectable()
export class OwnBudgetGuard implements CanActivate {
  constructor(private readonly budgetLib: BudgetLib) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithBudget>();

    const userId = request.user.id;
    const budgetId = parseInt(request.params.id);

    const budget = await this.budgetLib.getOwnBudget(budgetId, userId);

    if (!budget) {
      throw new ForbiddenException(ErrorCode.BUDGET_FORBIDDEN);
    }

    request.budget = budget;

    return true;
  }
}
