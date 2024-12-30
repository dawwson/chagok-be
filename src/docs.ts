import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from '@jozefazz/nestjs-redoc';

const path = 'docs'; // /docs로 접근

const title = '차곡(Chagok)💰 REST API Documentation';

const description = [
  '## 1. 개요',
  '- 이 문서는 `차곡 가계부(Chagok)` 의 `REST API` 사용법을 안내합니다.\n',
  '- 로그인 성공시 `Set-Cookie` 헤더로 `JWT`가 발급됩니다.\n',
  '- 회원가입과 로그인을 제외한 모든 요청에는 `Cookie` 헤더로 `JWT`를 포함합니다.\n',
  '- 모든 엔드포인트에서 요청 파라미터, 경로변수, 본문에 대한 유효성 검사를 진행합니다. 유효하지 않은 데이터일 경우 `400 Bad Request` 로 반환합니다.\n',
  '- HTTP 요청에 대한 모든 응답 형식은 `JSON` 입니다.\n',
  '- 날짜/시간 데이터는 모두 `UTC` 기준 `ISO string` 으로 주고 받습니다.\n',
  '- `tx`는 `transaction` 을 의미합니다.\n',
  '\n',
  '## 2. 주요 상태 코드',
  '| HTTP Status Code | 상태 | Description |',
  '| :---: | --- | --- |',
  '| 200<br>OK | 성공 | 서버가 클라이언트의 요청을 성공적으로 수행하였음을 의미합니다. |',
  '| 201<br>Created | 성공 | 서버가 클라이언트의 요청을 성공적으로 수행 후 리소스가 생성되었음을 의미합니다. |',
  '| 204<br>No Content | 성공 | 서버가 클라이언트의 요청을 성공적으로 수행했지만, 추가로 반환할 데이터가 없음을 의미합니다. |',
  '| 400<br>Bad Request | 실패 | 서버가 클라이언트 오류(잘못된 요청 구문 등)를 감지해 요청을 처리할 수 없거나, 하지 않는다는 것을 의미합니다. |',
  '| 401<br>Unauthorized | 실패 | 클라이언트 오류 상태 응답 코드는 해당 리소스에 유효한 인증 자격 증명이 없기 때문에 요청이 수행되지 않았음을 나타냅니다. |',
  '| 403<br>Forbidden | 실패 | 서버에 요청이 전달되었지만, 권한 때문에 거절되었음을 의미합니다. |',
  '| 404<br>Not Found | 실패 | 서버가 요청받은 리소스를 찾을 수 없다는 것을 의미합니다. |',
  '| 409<br>Conflict | 실패 | 서버의 현재 상태와 요청이 충돌했음을 나타냅니다. 이미 존재하는 자원에 대해 다시 생성하고자 할 때 발생할 수 있습니다.  |',
  '| 500<br>Internal Server Error | 실패 | 요청을 처리하는 과정에서 서버가 예상하지 못한 상황에 놓였다는 것을 나타냅니다. |',
  '\n',
  '## 3. 응답 형식',
  '### 성공 응답',
  '| Name | Type | Description | Required |',
  '| --- | --- | --- | :---: |',
  '| data | JSON \\| JSON [ ] | 데이터 | X |',
  '#### 예시',
  '```http',
  'HTTP/1.1 201 Created',
  'Content-Type: application/json; charset=utf-8',
  '\n',
  '{',
  '  "data": {',
  '    "id": 11,',
  '    "txType": "expense",',
  '    "txMethod": "credit card",',
  '    "amount": 6800,',
  '    "categoryId": 1,',
  '    "date": "2024-09-30T04:22:17.531Z",',
  '    "description": "커피",',
  '    "isExcluded": true,',
  '    "createdAt": "2024-09-30T08:13:35.780Z"',
  '  }',
  '}',
  '```',
  '### 실패 응답',
  '| Name | Type | Description | Required |',
  '| --- | --- | --- | :---: |',
  '| path | string | 에러 발생 경로 | O |',
  '| errorCode | string | 에러 코드 | O |',
  '| detail | string | 에러 세부 내용 | O |',
  '| timestamp | string | 에러 발생 시간 (ISO String) | O |',
  '#### 예시',
  '```http',
  'HTTP/1.1 400 Bad Request',
  'Content-Type: application/json; charset=utf-8',
  '\n',
  '{',
  '  "path": "POST /txs",',
  '  "errorCode": "MISSING_PARAMETER",',
  '  "detail": "필수 파라미터가 지정되지 않았습니다.",',
  '  "timestamp": "2024-09-30T08:24:26.516Z"',
  '}',
  '```',
  '\n',
  '## 4. 에러 코드',
  '| Error Code | HTTP Status Code | Message |',
  '| :---: | :---: | --- |',
  '| `MISSING_PARAMETER` | `400` | 필수 파라미터가 지정되지 않았습니다. |',
  '| `BUDGET_YEAR_OUT_OF_RANGE` | `400` | "year"의 타입/범위를 확인해주세요. |',
  '| `BUDGET_MONTH_OUT_OF_RANGE` | `400` | "month"의 타입/범위를 확인해주세요. |',
  '| `BUDGET_INVALID_BUDGETS` | `400` | "budgets"의 타입을 확인해주세요. |',
  '| `BUDGET_BUDGETS_OUT_OF_RANGE` | `400` | "amount"의 타입/범위를 확인해주세요. |',
  '| `BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE` | `400` | "budgets"의 길이를 확인해주세요. |',
  '| `BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE` | `400` | 총 예산의 범위를 벗어났습니다. |',
  '| `CATEGORY_INVALID_ID` | `400` | "categoryId"의 타입을 확인해주세요. |',
  '| `STAT_INVALID_VIEW` | `400` | "view"의 타입을 확인해주세요. |',
  '| `TX_INVALID_TX_TYPE` | `400` | "txType"의 타입을 확인해주세요. |',
  '| `TX_INVALID_TX_METHOD` | `400` | "txMethod"의 타입을 확인해주세요. |',
  '| `TX_INVALID_AMOUNT` | `400` | "amount"의 타입을 확인해주세요. |',
  '| `TX_INVALID_DATE` | `400` | "date"의 타입을 확인해주세요. |',
  '| `TX_INVALID_DESCRIPTION` | `400` | "description"의 타입을 확인해주세요. |',
  '| `TX_INVALID_IS_EXCLUDED` | `400` | "isExcluded"의 타입을 확인해주세요. |',
  '| `TX_AMOUNT_OUT_OF_RANGE` | `400` | "amount"의 범위를 확인해주세요. |',
  '| `TX_DESCRIPTION_OUT_OF_LENGTH` | `400` | "description"의 길이를 확인해주세요. |',
  '| `TX_INVALID_START_DATE` | `400` | "startDate"의 타입을 확인해주세요. |',
  '| `TX_INVALID_END_DATE` | `400` | "endDate"의 타입를 확인해주세요. |',
  '| `USER_INVALID_EMAIL` | `400` | "email"이 이메일 형식인지 확인해주세요. |',
  '| `USER_INVALID_PASSWORD` | `400` | "password"의 타입을 확인해주세요. |',
  '| `USER_INVALID_NICKNAME` | `400` | "nickname"의 타입을 확인해주세요. |',
  '| `USER_NICKNAME_OUT_OF_RANGE` | `400` | "nickname"의 길이를 확인해주세요. |',
  '| `AUTH_INVALID_TOKEN` | `401` | 유효하지 않은 토큰입니다. |',
  '| `USER_EMAIL_DO_NOT_EXIST` | `401` | 존재하지 않는 이메일입니다. |',
  '| `USER_PASSWORD_IS_WRONG` | `401` | 비밀번호가 일치하지 않습니다. |',
  '| `BUDGET_FORBIDDEN` | `403` | 예산에 대한 권한이 없습니다. |',
  '| `TX_FORBIDDEN` | `403` | 트랜잭션에 대한 권한이 없습니다. |',
  '| `USER_NOT_FOUND` | `404` | 존재하지 않는 사용자입니다. |',
  '| `EXPENSE_NOT_FOUND` | `404` | 지출이 존재하지 않습니다. |',
  '| `CATEGORY_NOT_FOUND` | `404` | 카테고리가 존재하지 않습니다. |',
  '| `USER_EMAIL_IS_DUPLICATED` | `409` | 사용할 수 없는 이메일입니다. |',
  '| `BUDGET_IS_DUPLICATED` | `409` | 이미 예산이 등록되었습니다. |',
].join('\n');

const config = new DocumentBuilder()
  .setTitle(title) //
  .setDescription(description) //
  .setVersion('1.0') //
  .setContact('API Support', '', 'shines1427@gmail.com')
  .build();

/**
 * Swagger UI로 설정
 */
export const setupSwagger = (app: INestApplication) => {
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config);

    // tag 순서 지정
    document.tags = [
      { name: 'Auth', description: '인증 API' },
      { name: 'User', description: '사용자 API' },
      { name: 'Category', description: '카테고리 API' },
      { name: 'Budget', description: '예산 API' },
      { name: 'Tx', description: '내역 API' },
      { name: 'Stat', description: '통계 API' },
    ];

    return document;
  };

  SwaggerModule.setup(path, app, documentFactory, {
    swaggerOptions: {
      withCredentials: true, // 요청에 cookie를 포함하여 전송
    },
  });
};

/**
 * Redoc UI로 설정
 */
export const setupRedoc = async (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config);

  // tag 순서 지정
  document.tags = [
    { name: 'Auth', description: '인증 API' },
    { name: 'User', description: '사용자 API' },
    { name: 'Category', description: '카테고리 API' },
    { name: 'Budget', description: '예산 API' },
    { name: 'Tx', description: '내역 API' },
    { name: 'Stat', description: '통계 API' },
  ];

  await RedocModule.setup(path, app, document, {
    title: 'test',
    sortPropsAlphabetically: false,
    expandResponses: 'all',
    requiredPropsFirst: false,
  });
};
