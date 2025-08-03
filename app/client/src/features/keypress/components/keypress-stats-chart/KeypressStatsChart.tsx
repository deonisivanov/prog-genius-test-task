"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/app/store";

export const KeypressStatsChart = observer(() => {
  const { keysStore } = useStore();

  return (
    <div className="w-full max-w-xl flex flex-col gap-2">
      {keysStore.stats.map(({ key, count }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-6 text-right font-mono">{key}</span>
          <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 h-5 rounded">
            <div
              className="bg-blue-500 h-5 rounded transition-all duration-300"
              style={{ width: `${(count / keysStore.maxCount) * 100}%` }}
            />
          </div>
          <span className="w-8 text-left font-mono">{count}</span>
        </div>
      ))}
    </div>
  );
});
