import { AuthTokensSchema } from '@nakshatra/types';
import { z } from 'zod';
import type { AuthTokens } from '@nakshatra/types';
import type { TokenManager } from '../auth/token-manager';

export interface ApiClientOptions {
  baseUrl: string;
  tokenManager?: TokenManager;
  fetchImpl?: typeof fetch;
  onUnauthorized?: () => void;
}

export interface ApiRequestOptions extends RequestInit {
  useAuth?: boolean;
  schema?: z.ZodTypeAny;
}

export const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function createApiClient(options: ApiClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;

  async function withAuth(init?: RequestInit): Promise<RequestInit> {
    if (!options.tokenManager) {
      return init ?? {};
    }

    const expired = await options.tokenManager.isExpired();
    let tokens: AuthTokens | null = null;

    if (!expired) {
      tokens = await options.tokenManager.getTokens();
    } else {
      tokens = await refreshTokens();
    }

    if (!tokens) {
      options.onUnauthorized?.();
      return init ?? {};
    }

    return {
      ...init,
      headers: {
        ...defaultHeaders,
        ...(init?.headers || {}),
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    } satisfies RequestInit;
  }

  async function refreshTokens(): Promise<AuthTokens | null> {
    if (!options.tokenManager) {
      return null;
    }

    const existing = await options.tokenManager.getTokens();
    if (!existing?.refreshToken) {
      await options.tokenManager.clear();
      return null;
    }

    try {
      const response = await fetchImpl(`${options.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ refreshToken: existing.refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const payload = AuthTokensSchema.parse(await response.json());
      await options.tokenManager.setTokens(payload);
      return payload;
    } catch (error) {
      console.warn('[ApiClient] refresh failed', error);
      await options.tokenManager.clear();
      options.onUnauthorized?.();
      return null;
    }
  }

  async function request<T = unknown>(path: string, init: ApiRequestOptions = {}): Promise<T> {
    const url = `${options.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const { useAuth = true, schema, ...rest } = init;
    let requestInit: RequestInit = {
      headers: defaultHeaders,
      ...rest,
    };

    if (useAuth) {
      requestInit = await withAuth(requestInit);
    }

    const response = await fetchImpl(url, requestInit);

    if (response.status === 401) {
      options.onUnauthorized?.();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`[ApiClient] ${response.status} ${response.statusText}: ${body}`);
    }

    const data = (await response.json()) as T;

    if (schema) {
      return schema.parse(data) as T;
    }

    return data;
  }

  return {
    request,
    get: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, {
        ...options,
        method: 'GET',
      }),
    post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>(path, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>(path, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),
    patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>(path, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      }),
    delete: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, {
        ...options,
        method: 'DELETE',
      }),
    refreshTokens,
  };
}
