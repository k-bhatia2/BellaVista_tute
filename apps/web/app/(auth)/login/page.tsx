"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequestSchema, AuthTokensSchema } from '@nakshatra/types';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@nakshatra/ui';
import { useTokenManager } from '@/hooks/use-token-manager';
import { createBrowserApi } from '@/lib/api-client';
import { useToast } from '@nakshatra/ui';

export default function LoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const tokenManager = useTokenManager();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = LoginRequestSchema.safeParse(form);
    if (!parsed.success) {
      show({ title: 'Invalid credentials', description: parsed.error.errors[0]?.message, intent: 'error' });
      return;
    }

    if (!tokenManager) {
      show({ title: 'Please wait', description: 'Initialising secure storage…', intent: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const api = createBrowserApi(tokenManager);
      const response = await api.post('/auth/login', parsed.data, { useAuth: false });
      const tokens = AuthTokensSchema.parse(response);
      await tokenManager.setTokens(tokens);
      show({ title: 'Welcome back!', intent: 'success' });
      router.push('/dashboard/user');
    } catch (error) {
      show({ title: 'Login failed', description: (error as Error).message, intent: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <Button type="submit" loading={loading} disabled={loading}>
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
