import { ErrorCode } from '../enum/error-code.enum';

export const ErrorMessage: Record<ErrorCode, string> = {
  // 400
  [ErrorCode.MISSING_PARAMETER]: '필수 파라미터가 지정되지 않았습니다.',
  [ErrorCode.OUT_OF_RANGE]: '파라미터가 유효 범위를 벗어났습니다.',
  [ErrorCode.INVALID_EMAIL]: '유효하지 않은 email 입니다.',
  [ErrorCode.INVALID_PASSWORD]: '유효하지 않은 password 입니다.',
  [ErrorCode.INVALID_NICKNAME_TYPE]: '유효하지 않은 nickname 형식입니다.',
  [ErrorCode.INVALID_NICKNAME_LENGTH]: 'nickname은 최소 2글자 입니다.',

  // budget
  [ErrorCode.BUDGET_YEAR_OUT_OF_RANGE]: '"year"의 타입/범위를 확인해주세요.',
  [ErrorCode.BUDGET_MONTH_OUT_OF_RANGE]: '"month"의 타입/범위를 확인해주세요.',
  [ErrorCode.BUDGET_INVALID_BUDGETS]: '"budgets"의 타입을 확인해주세요.',
  [ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE]: '"amount"의 타입/범위를 확인해주세요.',
  [ErrorCode.BUDGET_BUDGETS_OUT_OF_RANGE]: '"budgets"의 길이를 확인해주세요.',
  [ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE]: '총 예산의 범위를 벗어났습니다.',

  // category
  [ErrorCode.CATEGORY_INVALID_ID]: '"categoryId"의 타입을 확인해주세요.',

  // stat
  [ErrorCode.STAT_INVALID_VIEW]: '"view"의 타입을 확인해주세요.',

  // tx
  [ErrorCode.TX_INVALID_TX_TYPE]: '"txType"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_TX_METHOD]: '"txMethod"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_AMOUNT]: '"amount"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_DATE]: '"date"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_DESCRIPTION]: '"description"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_IS_EXCLUDED]: '"isExcluded"의 타입을 확인해주세요.',
  [ErrorCode.TX_AMOUNT_OUT_OF_RANGE]: '"amount"의 범위를 확인해주세요.',
  [ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH]: '"description"의 길이를 확인해주세요.',
  [ErrorCode.TX_INVALID_START_DATE]: '"startDate"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_END_DATE]: '"endDate"의 타입를 확인해주세요.',

  // user
  [ErrorCode.USER_INVALID_NICKNAME]: '"nickname"의 타입을 확인해주세요.',
  [ErrorCode.USER_NICKNAME_OUT_OF_RANGE]: '"nickname"의 길이를 확인해주세요.',

  // 401
  [ErrorCode.AUTH_INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ErrorCode.USER_EMAIL_DO_NOT_EXIST]: '존재하지 않는 이메일입니다.',
  [ErrorCode.USER_PASSWORD_IS_WRONG]: '비밀번호가 일치하지 않습니다.',

  // 403
  [ErrorCode.TX_FORBIDDEN]: '트랜잭션에 대한 권한이 없습니다.',
  [ErrorCode.BUDGET_FORBIDDEN]: '예산에 대한 권한이 없습니다.',

  // 404
  [ErrorCode.USER_NOT_FOUND]: '존재하지 않는 사용자입니다.',
  [ErrorCode.EXPENSE_NOT_FOUND]: '지출이 존재하지 않습니다.',
  [ErrorCode.CATEGORY_NOT_FOUND]: '카테고리가 존재하지 않습니다.',

  // 409
  [ErrorCode.USER_EMAIL_IS_DUPLICATED]: '사용할 수 없는 이메일입니다.',
  [ErrorCode.BUDGET_IS_DUPLICATED]: '이미 예산이 등록되었습니다.',
};
