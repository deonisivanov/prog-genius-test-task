import { Module } from '@nestjs/common';

import { ConfigModule } from './core';
import { TypeormModule } from './core/typeorm';
import { KeysModule } from './modules';

@Module({
  imports: [TypeormModule, ConfigModule, KeysModule]
})
export class AppModule {}
