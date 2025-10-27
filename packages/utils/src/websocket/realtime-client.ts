import EventEmitter from 'eventemitter3';
import type { TokenManager } from '../auth/token-manager';

export interface RealtimeClientOptions {
  url: string;
  tokenManager?: TokenManager;
  protocols?: string | string[];
  autoReconnect?: boolean;
  reconnectIntervalMs?: number;
}

export interface RealtimeMessage<T = unknown> {
  event: string;
  payload: T;
}

export class RealtimeClient extends EventEmitter {
  private socket?: WebSocket;
  private reconnectTimeout?: ReturnType<typeof setTimeout>;

  constructor(private readonly options: RealtimeClientOptions) {
    super();
  }

  async connect(): Promise<void> {
    const token = await this.options.tokenManager?.getTokens();
    const url = new URL(this.options.url);

    if (token?.accessToken) {
      url.searchParams.set('token', token.accessToken);
    }

    this.socket = new WebSocket(url.toString(), this.options.protocols);

    this.socket.addEventListener('open', () => this.emit('open'));
    this.socket.addEventListener('close', (event) => {
      this.emit('close', event);
      if (this.options.autoReconnect !== false) {
        this.scheduleReconnect();
      }
    });
    this.socket.addEventListener('error', (error) => this.emit('error', error));
    this.socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data as string) as RealtimeMessage;
        this.emit(data.event, data.payload);
      } catch (error) {
        this.emit('message', message.data);
      }
    });
  }

  send(event: string, payload: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Realtime connection is not ready');
    }

    this.socket.send(JSON.stringify({ event, payload }));
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = undefined;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    const interval = this.options.reconnectIntervalMs ?? 3000;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;
      this.connect().catch((error) => this.emit('error', error));
    }, interval);
  }
}
