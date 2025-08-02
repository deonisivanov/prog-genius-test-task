import { NestFactory } from '@nestjs/core';

import { CoreModule } from './core';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
