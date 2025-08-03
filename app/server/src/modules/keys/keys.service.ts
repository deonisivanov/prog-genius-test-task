import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bufferTime, Subject } from 'rxjs';
import { DataSource, Repository } from 'typeorm';

import { Keys } from '@/entities';

@Injectable()
export class KeysService implements OnModuleInit, OnModuleDestroy {
  private readonly keyStream$ = new Subject<string>();
  private readonly keyCounts = new Map<string, number>();
  private readonly updates$ = new Subject<{ key: string; count: number }>();
  private subscription?: ReturnType<(typeof this.keyStream$)['subscribe']>;

  constructor(
    @InjectRepository(Keys)
    private readonly keysRepo: Repository<Keys>,
    private readonly dataSource: DataSource
  ) {}

  get onKeyUpdate() {
    return this.updates$.asObservable();
  }

  async onModuleInit() {
    const storedKeys = await this.keysRepo.find();
    storedKeys.forEach(({ key, count }) => this.keyCounts.set(key, Number(count)));

    this.subscription = this.keyStream$.pipe(bufferTime(1000)).subscribe((batch) => void this.flushToDb(batch));
  }

  onModuleDestroy() {
    this.subscription?.unsubscribe();
  }

  increment(key: string): number {
    const current = this.keyCounts.get(key) ?? 0;
    const next = current + 1;

    this.keyCounts.set(key, next);
    this.keyStream$.next(key);
    this.updates$.next({ key, count: next });

    return next;
  }

  getAll(): { key: string; count: number }[] {
    return Array.from(this.keyCounts.entries()).map(([key, count]) => ({ key, count }));
  }

  private async flushToDb(batch: string[]) {
    if (!batch.length) return;

    const aggregate = new Map<string, number>();
    for (const key of batch) {
      aggregate.set(key, (aggregate.get(key) ?? 0) + 1);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const [key, count] of aggregate.entries()) {
        await queryRunner.manager.upsert(Keys, { key, count }, ['key']);
      }

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
