import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';

import { RequestWithUser } from '@src/shared/interface/request-with-user.interface';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

import { ExpenseLib } from '../service/expense.lib';

/**
 * 지출에 대한 권한 검사를 하는 가드
 * 사용자 본인이 생성한 지출에 대해서만 접근 가능
 */
@Injectable()
export class OwnExpenseGuard implements CanActivate {
  constructor(
    // TODO: databaseService로 분리
    private readonly expenseLib: ExpenseLib,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;
    const expenseId = parseInt(request.params.id);

    const isOwnExpense = await this.expenseLib.isOwnExpense(expenseId, user.userId);

    if (!isOwnExpense) {
      // NOTE: 보안 상의 이유로 403이 아니라 404로 응답합니다.
      throw new NotFoundException(ErrorCode.EXPENSE_NOT_FOUND);
    }
    return true;
  }
}
