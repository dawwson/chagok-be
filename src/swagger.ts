import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

const path = 'docs'; // /docs로 접근

const description = [
  '- 이 문서는 `차곡 가계부(Chagok)` 의 `REST API` 사용법을 안내합니다.',
  '- 로그인 성공시 `Set-Cookie` 헤더로 `JWT`가 발급됩니다.',
  '- 회원가입과 로그인을 제외한 모든 요청에는 `Cookie` 헤더로 `JWT`를 포함합니다.',
  '- 모든 엔드포인트에서 요청 파라미터, 경로변수, 본문에 대한 유효성 검사를 진행합니다. 유효하지 않은 데이터일 경우 `400 Bad Request` 로 반환합니다.',
  '- 날짜/시간 데이터는 모두 `UTC` 기준 `ISO string` 으로 주고 받습니다.',
].join('\n\n');

const config = new DocumentBuilder()
  .setTitle('Chagok RESTful API Documentation')
  .setDescription(description)
  .setVersion('1.0')
  .build();

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

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      withCredentials: true, // 요청에 cookie를 포함하여 전송
    },
  };

  SwaggerModule.setup(path, app, documentFactory, options);
};

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

  const redocOptions: RedocOptions = {
    title: 'test',
    sortPropsAlphabetically: false,
    expandResponses: 'all',
  };

  await RedocModule.setup(path, app, document, redocOptions);
};
