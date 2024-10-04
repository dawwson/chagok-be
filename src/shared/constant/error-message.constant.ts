import { ErrorCode } from '../enum/error-code.enum';

export const ErrorMessage: Record<ErrorCode, string> = {
  // 400
  [ErrorCode.MISSING_PARAMETER]: '필수 파라미터가 지정되지 않았습니다.',
  [ErrorCode.OUT_OF_RANGE]: '파라미터가 유효 범위를 벗어났습니다.',
  [ErrorCode.INVALID_EMAIL]: '유효하지 않은 email 입니다.',
  [ErrorCode.INVALID_PASSWORD]: '유효하지 않은 password 입니다.',
  [ErrorCode.INVALID_NICKNAME_TYPE]: '유효하지 않은 nickname 형식입니다.',
  [ErrorCode.INVALID_NICKNAME_LENGTH]: 'nickname은 최소 2글자 입니다.',
  [ErrorCode.INVALID_YEAR]: '유효하지 않은 year 형식입니다.',
  [ErrorCode.INVALID_MONTH]: '유효하지 않은 month 형식입니다.',
  [ErrorCode.INVALID_TOTAL_AMOUNT]: '유효하지 않은 totalAmount 입니다.',
  [ErrorCode.INVALID_CATEGORY_ID]: '유효하지 않은 categoryId 입니다.',
  [ErrorCode.INVALID_BUDGET_BY_CATEGORY]: '유효하지 않은 budgetByCategory 입니다.',
  [ErrorCode.INVALID_AMOUNT]: '유효하지 않은 amount 입니다.',
  [ErrorCode.INVALID_CONTENT]: '유효하지 않은 content 입니다.',
  [ErrorCode.INVALID_DATE]: '유효하지 않은 날짜 형식입니다.',
  [ErrorCode.INVALID_IS_EXCLUDED]: '유효하지 않은 isExcluded 입니다.',
  [ErrorCode.EMPTY_CONTENT]: 'content가 비어있습니다.',
  [ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE]: 'minAmount와 maxAmount는 함께 포함되어야 합니다.',
  [ErrorCode.EXPENSE_MIN_AMOUNT_MORE_THAN_MAX]: 'minAmount는 maxAmount보다 작아야 합니다.',

  // tx
  [ErrorCode.TX_INVALID_TX_TYPE]: '"txType"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_TX_METHOD]: '"txMethod"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_AMOUNT]: '"amount"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_DATE]: '"date"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_DESCRIPTION]: '"description"의 타입을 확인해주세요.',
  [ErrorCode.TX_INVALID_IS_EXCLUDED]: '"isExcluded"의 타입을 확인해주세요.',
  [ErrorCode.TX_AMOUNT_OUT_OF_RANGE]: '"amount"의 범위를 확인해주세요."',
  [ErrorCode.TX_DESCRIPTION_OUT_OF_LENGTH]: '"description"의 길이를 확인해주세요."',
  [ErrorCode.TX_INVALID_START_DATE]: '"startDate"의 타입을 확인해주세요."',
  [ErrorCode.TX_INVALID_END_DATE]: '"endDate"의 타입를 확인해주세요."',
  // category
  [ErrorCode.CATEGORY_INVALID_ID]: '"categoryId"의 타입을 확인해주세요.',

  // 401
  [ErrorCode.AUTH_INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ErrorCode.USER_EMAIL_DO_NOT_EXIST]: '존재하지 않는 이메일입니다.',
  [ErrorCode.USER_PASSWORD_IS_WRONG]: '비밀번호가 일치하지 않습니다.',

  // 403
  [ErrorCode.TX_FORBIDDEN]: '트랜잭션에 대한 권한이 없습니다.',

  // 404
  [ErrorCode.USER_NOT_FOUND]: '존재하지 않는 사용자입니다.',
  [ErrorCode.EXPENSE_NOT_FOUND]: '지출이 존재하지 않습니다.',
  [ErrorCode.CATEGORY_NOT_FOUND]: '카테고리가 존재하지 않습니다.',

  // 409
  [ErrorCode.USER_EMAIL_IS_DUPLICATED]: '사용할 수 없는 이메일입니다.',
};
