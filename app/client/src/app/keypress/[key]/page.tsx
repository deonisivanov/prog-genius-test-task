import { notFound } from "next/navigation";

import { KeypressStat } from "@/features/keypress/components";
import { fetchKeyData } from "@/features/keypress/server";

export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_KEYPRESS_SOCKET_URL}`, { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to fetch keys");
  const keys = (await res.json()) as Array<{ key: string }>;

  return keys.map((k) => ({ key: k.key }));
}

export default async function KeyPage({ params }: { params: { key: string } }) {
  const keyData = await fetchKeyData(params.key).catch(() => notFound());

  return <KeypressStat keyData={keyData} />;
}
