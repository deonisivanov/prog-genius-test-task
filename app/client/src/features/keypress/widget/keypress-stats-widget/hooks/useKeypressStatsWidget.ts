import { useKeypressSocket } from "@/features/keypress/realtime";
import { useEffect } from "react";

export const useKeypressStatsWidget = () => {
  const { emitKey, isConnected } = useKeypressSocket();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key.length === 1) emitKey(key);
    };

    if (!isConnected) return;

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [emitKey, isConnected]);

  return { state: { emitKey, isConnected } };
};
