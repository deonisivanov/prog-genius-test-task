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

  async getAllSorted(): Promise<Keys[]> {
    return this.keysRepo.find({
      order: { count: 'DESC' },
      select: ['key', 'count']
    });
  }

  async getKeyPage(keyName: string): Promise<KeypressStatDetails> {
    const result = await this.dataSource.query<KeypressStatDetails[]>(
      `
		  SELECT
			current."key"   AS key,
			current."count" AS count,

			(SELECT prev."key"
			  FROM keys prev
			  WHERE prev."count" > current."count"
			  ORDER BY prev."count" ASC, prev."key" ASC
			  LIMIT 1
			) AS "prevKey",

			(SELECT next."key"
			  FROM keys next
			  WHERE next."count" < current."count"
			  ORDER BY next."count" DESC, next."key" ASC
			  LIMIT 1
			) AS "nextKey"

		  FROM keys current
		  WHERE current."key" = $1
		  LIMIT 1;
		`,
      [keyName]
    );

    if (result.length === 0) {
      throw new NotFoundException(`Key "${keyName}" not found`);
    }

    const row = result[0];
    return {
      key: row.key,
      count: Number(row.count),
      prevKey: row.prevKey,
      nextKey: row.nextKey
    };
  }
}
