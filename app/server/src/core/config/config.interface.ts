import type { ConfigType } from '@nestjs/config';

import type { app, typeorm } from './configs';

export interface Config {
  app: ConfigType<typeof app>;
  typeorm: ConfigType<typeof typeorm>;
}
