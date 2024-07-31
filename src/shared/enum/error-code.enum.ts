export enum ErrorCode {
  // 400
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_YEAR = 'INVALID_YEAR',
  INVALID_MONTH = 'INVALIED_MONTH',
  INVALID_TOTAL_AMOUNT = 'INVALID_TOTAL_AMOUNT',
  INVALID_CATEGORY_ID = 'INVALID_CATEGORY_ID',
  INVALID_BUDGET_BY_CATEGORY = 'INVALID_BUDGET_BY_CATEGORY',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_CONTENT = 'INVALID_CONTENT',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_IS_EXCLUDED = 'INVALID_IS_EXCLUDED',
  EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE = 'EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE',
  EXPENSE_MIN_AMOUNT_MORE_THAN_MAX = 'EXPENSE_MIN_AMOUNT_MORE_THAN_MAX',

  // 401
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  USER_EMAIL_DO_NOT_EXIST = 'USER_EMAIL_DO_NOT_EXIST',
  USER_PASSWORD_IS_WRONG = 'USER_PASSWORD_IS_WRONG',

  // 404
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EXPENSE_NOT_FOUND = 'EXPENSE_NOT_FOUND',

  // 409
  USER_EMAIL_IS_DUPLICATED = 'USER_EMAIL_IS_DUPLICATED',
}
