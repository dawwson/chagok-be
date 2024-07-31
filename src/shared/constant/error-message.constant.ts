import { ErrorCode } from '../enum/error-code.enum';

export const ErrorMessage: Record<ErrorCode, string> = {
  // 400
  [ErrorCode.MISSING_PARAMETER]: '필수 파라미터가 지정되지 않았습니다.',
  [ErrorCode.INVALID_EMAIL]: '유효하지 않은 이메일입니다.',
  [ErrorCode.INVALID_PASSWORD]: '유효하지 않은 비밀번호입니다.',
  [ErrorCode.INVALID_CATEGORY_ID]: '카테고리 ID가 유효하지 않습니다.',
  [ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE]:
    'minAmount와 maxAmount는 함께 포함되어야 합니다.',
  [ErrorCode.EXPENSE_MIN_AMOUNT_MORE_THAN_MAX]:
    'minAmount는 maxAmount보다 작아야 합니다.',

  // 401
  [ErrorCode.AUTH_INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ErrorCode.USER_PASSWORD_IS_WRONG]: '비밀번호가 일치하지 않습니다.',

  // 404
  [ErrorCode.USER_NOT_FOUND]: '존재하지 않는 사용자입니다.',
  [ErrorCode.USER_EMAIL_DO_NOT_EXIST]: '존재하지 않는 이메일입니다.',
  [ErrorCode.EXPENSE_NOT_FOUND]: '지출이 존재하지 않습니다.',

  // 409
  [ErrorCode.USER_EMAIL_IS_DUPLICATED]: '사용할 수 없는 이메일입니다.',
};
