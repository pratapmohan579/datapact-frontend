'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function GlobalWebSocketListener() {
  const { lastMessage, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected) {
      toast.success('Real-time connection established', { position: 'bottom-left' });
    } else {
      toast.error('Disconnected from real-time server', { position: 'bottom-left' });
    }
  }, [isConnected]);

  useEffect(() => {
    if (!lastMessage) return;
    const msg = lastMessage as any;

    // Handle generic system events
    switch (msg.type) {
      case 'validation.completed':
        toast.success(`Validation finished for contract ${msg.payload?.contract_id}`);
        // Invalidate contracts/dashboard queries
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        break;
      case 'incident.created':
        toast.error(`New Incident: ${msg.payload?.title}`);
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
        break;
      case 'worker.online':
        toast.info(`Worker ${msg.payload?.worker_id} came online`);
        queryClient.invalidateQueries({ queryKey: ['workers'] });
        break;
      default:
        console.log('[WebSocket Event]', lastMessage);
    }
  }, [lastMessage, queryClient]);

  return null; // This is a headless component
}
