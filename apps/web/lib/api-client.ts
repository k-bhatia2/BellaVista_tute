import { createApiClient, type TokenManager } from '@nakshatra/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const serverApi = createApiClient({
  baseUrl: API_URL,
});

export function createBrowserApi(tokenManager: TokenManager) {
  return createApiClient({
    baseUrl: API_URL,
    tokenManager,
  });
}
