import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject, Subscription } from 'rxjs';
import { bufferTime } from 'rxjs/operators';
import { DataSource, Repository } from 'typeorm';

import { Keys } from '@/entities';

import { KEYS_CONSTANTS } from './keys.constant';

@Injectable()
export class KeysCounterService implements OnModuleInit, OnModuleDestroy {
  private readonly increment$ = new Subject<string>();
  private readonly memoryCounts = new Map<string, number>();
  private readonly updates$ = new Subject<{ key: string; count: number }>();
  private sub?: Subscription;

  constructor(
    @InjectRepository(Keys)
    private readonly repo: Repository<Keys>,
    private readonly dataSource: DataSource
  ) {}

  get onUpdate() {
    return this.updates$.asObservable();
  }

  getAllInMemory(): { key: string; count: number }[] {
    return Array.from(this.memoryCounts.entries()).map(([key, count]) => ({ key, count }));
  }

  increment(key: string): number {
    const next = (this.memoryCounts.get(key) ?? 0) + 1;
    this.memoryCounts.set(key, next);
    this.increment$.next(key);
    this.updates$.next({ key, count: next });
    return next;
  }

  async onModuleInit() {
    const all = await this.repo.find();
    all.forEach(({ key, count }) => this.memoryCounts.set(key, Number(count)));

    this.sub = this.increment$
      .pipe(bufferTime(KEYS_CONSTANTS.BATCH_FLUSH_INTERVAL_MS))
      .subscribe((batch) => void this.flush(batch));
  }

  onModuleDestroy() {
    this.sub?.unsubscribe();
  }

  private async flush(batch: string[]) {
    if (batch.length === 0) return;

    const agg = new Map<string, number>();
    for (const k of batch) {
      agg.set(k, (agg.get(k) ?? 0) + 1);
    }
    const entries = Array.from(agg).map(([key, count]) => ({ key, count }));

    const values = entries.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(',');
    const params = entries.flatMap((e) => [e.key, e.count]);

    await this.dataSource.query(
      `
      INSERT INTO "keys"("key","count")
      VALUES ${values}
      ON CONFLICT("key") DO UPDATE
        SET "count" = "keys"."count" + EXCLUDED."count"
      `,
      params
    );
  }
}
