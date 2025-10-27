import type { AuthTokens } from '@nakshatra/types';

export interface TokenStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export interface TokenManager {
  getTokens(): Promise<AuthTokens | null>;
  setTokens(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
  isExpired(): Promise<boolean>;
}

const DEFAULT_KEY = 'nakshatra:auth-tokens';

export function createTokenManager(storage: TokenStorage, key: string = DEFAULT_KEY): TokenManager {
  async function getTokens(): Promise<AuthTokens | null> {
    const raw = await storage.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      const tokens = JSON.parse(raw) as AuthTokens & { expiresAt?: number };
      if (tokens.expiresIn && !tokens.expiresAt) {
        tokens.expiresIn = Number(tokens.expiresIn);
      }
      return tokens;
    } catch (error) {
      console.warn('[TokenManager] failed to parse tokens', error);
      await storage.removeItem(key);
      return null;
    }
  }

  async function setTokens(tokens: AuthTokens): Promise<void> {
    const expiresAt = Date.now() + tokens.expiresIn * 1000;
    await storage.setItem(key, JSON.stringify({ ...tokens, expiresAt }));
  }

  async function clear(): Promise<void> {
    await storage.removeItem(key);
  }

  async function isExpired(): Promise<boolean> {
    const raw = await storage.getItem(key);
    if (!raw) {
      return true;
    }

    try {
      const payload = JSON.parse(raw) as { expiresAt?: number };
      if (!payload.expiresAt) {
        return true;
      }

      return payload.expiresAt < Date.now() + 30_000; // 30s drift
    } catch (error) {
      console.warn('[TokenManager] failed to parse expiry info', error);
      await clear();
      return true;
    }
  }

  return {
    getTokens,
    setTokens,
    clear,
    isExpired,
  };
}
