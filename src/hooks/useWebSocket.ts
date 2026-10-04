import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    function doConnect() {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(WS_BASE_URL);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          console.error('[WebSocket] Failed to parse message', err);
        }
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected. Reconnecting in 5s...');
        setIsConnected(false);
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN) {
            doConnect();
          }
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error', error);
        ws.close();
      };

      wsRef.current = ws;
    }

    doConnect();
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message, socket not open');
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
