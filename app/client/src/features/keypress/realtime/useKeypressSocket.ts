import { useEffect, useRef, useCallback, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { KeypressClientToServerEvents, KeypressServerToClientEvents, KeypressStat } from "../model";
import { useStore } from "@/app/store";

const SOCKET_NAMESPACE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/keys`;

export function useKeypressSocket() {
  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const { keysStore } = useStore();

  const emitKey = useCallback(
    (key: string) => {
      if (isConnected && socketRef.current?.connected) {
        socketRef.current.emit("keypress", { key });
      }
    },
    [isConnected]
  );

  useEffect(() => {
    const socket: Socket<KeypressServerToClientEvents, KeypressClientToServerEvents> = io(SOCKET_NAMESPACE, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("stats", (data: KeypressStat[] | KeypressStat) => {
      if (Array.isArray(data)) {
        keysStore.setAll(data);
      } else {
        keysStore.updateOne(data);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("stats");
      socket.disconnect();
    };
  }, [keysStore]);

  return { emitKey, isConnected };
}
