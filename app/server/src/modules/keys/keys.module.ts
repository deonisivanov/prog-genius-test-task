import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Keys } from '@/entities';

import { KeysGateway } from './keys.gateway';
import { KeysService } from './keys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keys])],
  providers: [KeysService, KeysGateway]
})
export class KeysModule {}
