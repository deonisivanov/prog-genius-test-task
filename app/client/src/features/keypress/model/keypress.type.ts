export type KeypressStat = {
  key: string;
  count: number;
};

export type KeypressStatDetails = {
  key: string;
  count: number;
  prevKey: string | null;
  nextKey: string | null;
};

export type KeypressEmitPayload = {
  key: string;
};
