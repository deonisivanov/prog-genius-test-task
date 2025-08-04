import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Keys } from '@/entities';

import { KeypressStatDetails } from './dto';
import { KeysCounterService } from './keys-counter.service';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(Keys)
    private readonly keysRepo: Repository<Keys>,
    private readonly counter: KeysCounterService,
    private readonly dataSource: DataSource
  ) {}

  get onKeyUpdate() {
    return this.counter.onUpdate;
  }

  increment(key: string): number {
    return this.counter.increment(key);
  }

  getAll(): { key: string; count: number }[] {
    return this.counter.getAllInMemory();
  }

  async getByKey(key: string) {
    return this.keysRepo.findOne({
      where: { key },
      select: ['key', 'count']
    });
  }

  getKeyPage(keyName: string): KeypressStatDetails {
    const memoryStats = this.counter.getAllInMemory();

    // Находим текущую клавишу
    const current = memoryStats.find((k) => k.key === keyName);
    if (!current) {
      throw new NotFoundException(`Key "${keyName}" not found`);
    }

    // Сортируем по убыванию count (чтобы "назад" — это больше count)
    const sorted = [...memoryStats].sort(
      (a, b) => (b.count !== a.count ? b.count - a.count : a.key.localeCompare(b.key)) // стабильность при одинаковом count
    );

    const index = sorted.findIndex((k) => k.key === keyName);
    const prevKey = index > 0 ? sorted[index - 1].key : null;
    const nextKey = index < sorted.length - 1 ? sorted[index + 1].key : null;

    return {
      key: current.key,
      count: current.count,
      prevKey,
      nextKey
    };
  }
}
