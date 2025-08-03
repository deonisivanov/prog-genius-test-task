import { Controller, Get, Param } from '@nestjs/common';

import { KeyDetailsDto } from './dto';
import { KeysService } from './keys.service';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get()
  async getAll() {
    return this.keysService.getAllSorted();
  }

  @Get(':key')
  async getOne(@Param('key') key: string): Promise<KeyDetailsDto> {
    return this.keysService.getKeyPage(key);
  }
}
