import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { IServerConfig } from './shared/interface/server-config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const { nodeEnv, port } = configService.get<IServerConfig>('server');

  await app.listen(port);
}
bootstrap();
