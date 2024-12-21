import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ErrorMessage } from '../constant/error-message.constant';

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

interface ApiErrorResponseOption {
  status: number;
  description: string;
  errorCode: string;
}

export const ApiErrorResponse = (path: string, options: ApiErrorResponseOption[]) => {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ...options.map((option) => {
      const { status, description, errorCode } = option;

      return ApiResponse({
        status,
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
    }),
  );
};

// export const ApiErrorResponse = <TModel extends Type<any>>(dto: TModel) => {
//   return applyDecorators(
//     ApiResponse({
//       status: 400,
//       description: '잘못된 요청',
//       type: ErrorResponse,
//     }),
//     ApiResponse({
//       status: 500,
//       description: '서버 에러',
//       type: ErrorResponse,
//     }),
//   );
// };
