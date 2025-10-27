import { createApiClient } from '@nakshatra/utils';
import { tokenManager } from './token-manager';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = createApiClient({
  baseUrl: API_URL,
  tokenManager,
});
