import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ErrorMessage } from '../constant/error-message.constant';
import { ErrorCode } from '../enum/error-code.enum';

class ErrorResponse {
  @ApiProperty({ description: '에러 발생 경로' })
  path: string;

  @ApiProperty({ description: '에러 코드' })
  errorCode: string;

  @ApiProperty({ description: '에러 세부 내용' })
  detail: string;

  @ApiProperty({ description: '에러 발생 시간 (ISO string)' })
  timestamp: string;
}

export const ApiErrorResponse = (endpoint: Endpoint) => {
  const { path, ...statusCodes } = ErrorResponseExample[endpoint];

  const apiResponses = Object.entries(statusCodes).map(([status, errors]) => {
    const isMultipleExample = errors.length > 1;

    // 1. 동일한 HTTP 상태 코드에 여러 예시가 있을 경우
    if (isMultipleExample) {
      const examples: Record<string, { value: ErrorResponse }> = {};

      errors.forEach(({ description, errorCode }, index) => {
        examples[`${index + 1}. ${description}`] = {
          value: {
            path,
            errorCode,
            detail: ErrorMessage[errorCode],
            timestamp: '2024-09-30T08:24:26.516Z',
          },
        };
      });

      return ApiResponse({
        status: Number(status),
        description: '실패',
        content: {
          'application/json': {
            schema: { $ref: getSchemaPath(ErrorResponse) },
            examples,
          },
        },
      });
    }

    // 2. 하나의 HTTP 상태 코드에 하나의 예시만 있을 경우
    const { description, errorCode } = errors[0];

    return ApiResponse({
      status: Number(status),
      description: '실패 : ' + description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponse) },
          {
            properties: {
              path: { example: path },
              errorCode: { example: errorCode },
              detail: { example: ErrorMessage[errorCode] },
              timestamp: { example: '2024-09-30T08:24:26.516Z' },
            },
          },
        ],
      },
    });
  });

  return applyDecorators(ApiExtraModels(ErrorResponse), ...apiResponses);
};

export const ENDPOINTS = {
  AUTH: {
    SIGN_UP: 'POST /auth/sign-up',
    SIGN_IN: 'POST /auth/sign-in',
    DELETE_ACCOUNT: 'POST /auth/delete-account',
  },
  USER: {
    UPDATE_PASSWORD: 'PATCH /users/password',
  },
  CATEGORY: {},
  BUDGET: {
    CREATE_BUDGET: 'POST /budgets',
    UPDATE_BUDGET: 'PUT /budgets/{id}',
  },
  TX: {
    CREATE_TX: 'POST /txs',
    UPDATE_TX: 'PUT /txs/{id}',
    // DELETE_TX: 'DELETE /txs/{id}',
  },
} as const;

type NestedValues<T> = T extends object ? NestedValues<T[keyof T]> : T;
type Endpoint = NestedValues<typeof ENDPOINTS>;

interface ErrorResponseExample {
  path: string;
  [status: number]: Array<{
    description: string;
    errorCode: ErrorCode;
  }>;
}

// key : path, value: Response example array
const ErrorResponseExample: Record<Endpoint, ErrorResponseExample> = {
  // 회원가입
  'POST /auth/sign-up': {
    path: 'POST /auth/sign-up',
    409: [
      {
        description: '이미 사용중인 이메일',
        errorCode: ErrorCode.USER_EMAIL_IS_DUPLICATED,
      },
    ],
  },
  // 로그인
  'POST /auth/sign-in': {
    path: 'POST /auth/sign-in',
    401: [
      {
        description: '존재하지 않는 이메일',
        errorCode: ErrorCode.USER_EMAIL_DO_NOT_EXIST,
      },
      {
        description: '비밀번호 불일치', //
        errorCode: ErrorCode.USER_PASSWORD_IS_WRONG,
      },
    ],
  },
  // 회원탈퇴
  'POST /auth/delete-account': {
    path: 'POST /auth/delete-account',
    401: [
      {
        description: '이메일 불일치',
        errorCode: ErrorCode.USER_EMAIL_DO_NOT_EXIST,
      },
    ],
  },
  // 사용자 비밀번호 수정
  'PATCH /users/password': {
    path: 'PATCH /users/password',
    401: [
      {
        description: '비밀번호 불일치',
        errorCode: ErrorCode.USER_PASSWORD_IS_WRONG,
      },
    ],
  },
  // 예산 생성
  'POST /budgets': {
    path: 'POST /budgets',
    400: [
      {
        description: '예산의 총액이 서버에서 정의한 범위를 벗어남',
        errorCode: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE,
      },
    ],
    404: [
      {
        description: 'categoryId가 지출 카테고리가 아닌 경우',
        errorCode: ErrorCode.CATEGORY_NOT_FOUND,
      },
    ],
    409: [
      {
        description: '이미 등록된 예산',
        errorCode: ErrorCode.BUDGET_IS_DUPLICATED,
      },
    ],
  },
  // 예산 수정
  'PUT /budgets/{id}': {
    path: 'PUT /budgets/1',
    400: [
      {
        description: '예산의 총액이 서버에서 정의한 범위를 벗어남',
        errorCode: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE,
      },
    ],
    404: [
      {
        description: 'categoryId가 지출 카테고리가 아닌 경우',
        errorCode: ErrorCode.CATEGORY_NOT_FOUND,
      },
    ],
  },
  // 내역 생성
  'POST /txs': {
    path: 'POST /txs',
    404: [
      {
        description: '존재하지 않는 categoryId',
        errorCode: ErrorCode.CATEGORY_NOT_FOUND,
      },
    ],
  },
  // 내역 수정
  'PUT /txs/{id}': {
    path: 'PUT /txs/1',
    403: [
      {
        description: '존재하지 않거나 접근 권한이 없음',
        errorCode: ErrorCode.TX_FORBIDDEN,
      },
    ],
    404: [
      {
        description: '존재하지 않는 categoryId',
        errorCode: ErrorCode.CATEGORY_NOT_FOUND,
      },
    ],
  },
};
