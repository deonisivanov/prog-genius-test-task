import type { KeypressStatDetails } from "../model";

export async function fetchKeyData(key: string): Promise<KeypressStatDetails> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_KEYPRESS_SOCKET_URL}/${key}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch key data");

  return res.json();
}
