"use client";

import * as React from 'react';
import { createTokenManager, type TokenManager } from '@nakshatra/utils';

const storage = {
  async getItem(key: string) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

export function useTokenManager(): TokenManager | null {
  const [manager, setManager] = React.useState<TokenManager | null>(null);

  React.useEffect(() => {
    setManager(createTokenManager(storage));
  }, []);

  return manager;
}
