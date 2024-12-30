import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

class SuccessResponse<T> {
  @ApiProperty()
  data?: T;
}

interface ApiSuccessResponseOption {
  status: number;
  type?: Type<any>;
  isArray?: boolean;
}

export const ApiSuccessResponse = (option: ApiSuccessResponseOption) => {
  const { status, type, isArray = false } = option;

  if (!type) {
    return applyDecorators(
      ApiResponse({
        status,
        description: '성공',
      }),
    );
  }

  const schema = isArray
    ? {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      }
    : {
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
      };

  return applyDecorators(
    ApiExtraModels(SuccessResponse, type),
    ApiResponse({
      status,
      description: '성공',
      schema,
    }),
  );
};
