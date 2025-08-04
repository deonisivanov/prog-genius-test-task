"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/app/store";
import Link from "next/link";

export const KeypressStatsChart = observer(() => {
  const { keysStore } = useStore();

  return (
    <div className="w-full max-w-xl flex flex-col gap-2">
      {keysStore.stats.map(({ key, count }) => (
        <Link
          key={key}
          href={`/keypress/${encodeURIComponent(key)}`}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-6 text-right font-mono group-hover:text-blue-400">{key}</span>
          <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 h-5 rounded overflow-hidden">
            <div
              className="bg-blue-500 h-5 rounded transition-all duration-300 group-hover:bg-blue-600"
              style={{ width: `${(count / keysStore.maxCount) * 100}%` }}
            />
          </div>
          <span className="w-8 text-left font-mono group-hover:text-blue-400">{count}</span>
        </Link>
      ))}
    </div>
  );
});
