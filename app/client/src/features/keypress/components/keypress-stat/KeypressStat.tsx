"use client";

import Link from "next/link";
import type { KeypressStatDetails } from "../../model";

type KeypressStatProps = {
  keyData: KeypressStatDetails;
};

export const KeypressStat = ({ keyData }: KeypressStatProps) => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="self-start">
          <Link
            href="/keypress"
            className="inline-block px-4 py-2 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition font-mono text-sm"
          >
            ← Back to list
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center">
          Key <span className="text-blue-600 font-mono">“{keyData.key}</span> pressed{" "}
          <span className="text-blue-600 font-mono">{keyData.count}</span> times
        </h1>

        <div className="flex justify-between items-center">
          {keyData.prevKey && (
            <Link
              href={`/keypress/${keyData.prevKey}`}
              className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition font-mono"
            >
              ← {keyData.prevKey}
            </Link>
          )}

          {keyData.nextKey && (
            <Link
              href={`/keypress/${keyData.nextKey}`}
              className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition font-mono"
            >
              {keyData.nextKey} →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};
