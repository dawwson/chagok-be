import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { NodeEnv, ServerConfig } from './config/server/server.type';
import { SERVER_CONFIG_TOKEN } from './config/server/server.constant';
import { AppModule } from './app.module';
import { setupRedoc } from './docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const { port, domain, nodeEnv } = configService.get<ServerConfig>(SERVER_CONFIG_TOKEN);

  app.enableCors({
    origin: domain, // 허용할 도메인
    credentials: true, // 쿠키 허용
  });
  app.use(cookieParser());

  if (nodeEnv !== NodeEnv.PROD) {
    await setupRedoc(app);
  }

  await app.listen(port);
}
bootstrap();
