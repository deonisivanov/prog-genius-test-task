import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Keys } from '@/entities';

import { KeysController } from './keys.controller';
import { KeysGateway } from './keys.gateway';
import { KeysService } from './keys.service';
import { KeysCounterService } from './keys-counter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keys])],
  providers: [KeysService, KeysCounterService, KeysGateway],
  controllers: [KeysController]
})
export class KeysModule {}
