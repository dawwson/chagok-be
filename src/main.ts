import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  QueryFailedFilter,
} from './shared/filter/custom-exception.filter';
import { IServerConfig } from './shared/interface/server-config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter(), new QueryFailedFilter());
  const { port } = configService.get<IServerConfig>('server');

  await app.listen(port);
}
bootstrap();
