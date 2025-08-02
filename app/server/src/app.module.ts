import { Module } from '@nestjs/common';

import { ConfigModule } from './core';

@Module({
  imports: [ConfigModule]
})
export class AppModule {}
