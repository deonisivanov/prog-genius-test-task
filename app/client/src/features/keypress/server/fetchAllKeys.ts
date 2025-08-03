import { KeypressEmitPayload } from "../model";

export async function fetchAllKeys(): Promise<KeypressEmitPayload[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_KEYPRESS_SOCKET_URL}`, {
    cache: "no-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch keys");

  return res.json();
}
