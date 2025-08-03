import type { KeypressEmitPayload, KeypressStat } from "@/features/keypress/model";

export type KeypressServerToClientEvents = {
  stats: (data: KeypressStat | KeypressStat[]) => void;
};

export type KeypressClientToServerEvents = {
  keypress: (payload: KeypressEmitPayload) => void;
};
