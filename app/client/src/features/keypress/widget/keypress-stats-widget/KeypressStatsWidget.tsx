"use client";

import { KeypressStatsChart } from "@/features/keypress/components";
import { useKeypressStatsWidget } from "./hooks/useKeypressStatsWidget";

export function KeypressStatsWidget() {
  useKeypressStatsWidget();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-xl font-bold">Keypress Stats</h1>
      <KeypressStatsChart />
      <p className="text-sm text-neutral-500">Press any key to see updates</p>
    </main>
  );
}
