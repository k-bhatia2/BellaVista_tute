import { useEffect, useMemo, useState } from 'react';
import { RealtimeClient } from '@nakshatra/utils';
import { tokenManager } from '@/lib/token-manager';

const WS_URL = process.env.WEBSOCKET_URL ?? 'ws://localhost:3001/realtime';

export function useRealtime(event: string) {
  const [payload, setPayload] = useState<any>(null);
  const client = useMemo(() => new RealtimeClient({ url: WS_URL, tokenManager, autoReconnect: true }), []);

  useEffect(() => {
    client.connect().catch(console.error);
    const handler = (data: any) => setPayload(data);
    client.on(event, handler);
    return () => {
      client.off(event, handler);
      client.disconnect();
    };
  }, [client, event]);

  return payload;
}
