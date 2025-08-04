import { Controller, Get, Param } from '@nestjs/common';

import { KeypressStatDetails } from './dto';
import { KeysService } from './keys.service';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get(':key')
  getOne(@Param('key') key: string): KeypressStatDetails {
    return this.keysService.getKeyPage(key);
  }
}
