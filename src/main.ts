import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ServerConfig } from './shared/interface/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);
  const { port } = configService.get<ServerConfig>('server');

  await app.listen(port);
}
bootstrap();
