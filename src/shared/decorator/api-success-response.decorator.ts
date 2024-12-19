import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

class SuccessResponse<T> {
  @ApiProperty()
  data?: T;
}

interface ApiSuccessResponseOption {
  status: number;
  type?: Type<any>;
}

export const ApiSuccessResponse = (option: ApiSuccessResponseOption) => {
  const { status, type } = option;

  return type
    ? applyDecorators(
        ApiExtraModels(SuccessResponse, type),
        ApiResponse({
          status,
          description: '성공',
          schema: {
            allOf: [
              { $ref: getSchemaPath(SuccessResponse) },
              {
                properties: {
                  data: {
                    $ref: getSchemaPath(type),
                  },
                },
              },
            ],
          },
        }),
      )
    : applyDecorators(
        ApiResponse({
          status,
          description: '성공',
        }),
      );
};
