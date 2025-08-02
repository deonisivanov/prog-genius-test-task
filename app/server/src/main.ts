import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Configs>);

  const port = configService.getOrThrow('app.port', { infer: true });

  await app.listen(port);
}

void bootstrap();
