import { makeAutoObservable } from "mobx";
import type { KeypressStat } from "../model";

export class KeysStore {
  stats: KeypressStat[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  hydrate(data: KeypressStat[]) {
    this.stats = data;
  }

  setAll(data: KeypressStat[]) {
    this.stats = data;
  }

  updateOne(stat: KeypressStat) {
    const existing = this.stats.find((s) => s.key === stat.key);
    if (existing) {
      existing.count = stat.count;
    } else {
      this.stats.push(stat);
    }
  }

  get maxCount() {
    return this.stats.reduce((max, s) => Math.max(max, s.count), 1);
  }
}
