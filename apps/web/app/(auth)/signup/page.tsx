"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupRequestSchema, AuthTokensSchema } from '@nakshatra/types';
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@nakshatra/ui';
import { useTokenManager } from '@/hooks/use-token-manager';
import { createBrowserApi } from '@/lib/api-client';
import { useToast } from '@nakshatra/ui';

const roleTabs = [
  { value: 'USER', label: 'Member' },
  { value: 'MANAGER', label: 'Manager' },
];

export default function SignupPage() {
  const router = useRouter();
  const { show } = useToast();
  const tokenManager = useTokenManager();
  const [role, setRole] = useState<'USER' | 'MANAGER'>('USER');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gymId: '',
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = SignupRequestSchema.safeParse({ ...form, role, gymId: form.gymId || undefined });
    if (!parsed.success) {
      show({ title: 'Form error', description: parsed.error.errors[0]?.message, intent: 'error' });
      return;
    }

    if (!tokenManager) {
      show({ title: 'Please wait', description: 'Initialising secure storage…', intent: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const api = createBrowserApi(tokenManager);
      const response = await api.post('/auth/signup', parsed.data, { useAuth: false });
      const tokens = AuthTokensSchema.parse(response);
      await tokenManager.setTokens(tokens);
      show({ title: 'Account created', intent: 'success' });
      router.push(role === 'MANAGER' ? '/dashboard/manager' : '/dashboard/user');
    } catch (error) {
      show({ title: 'Signup failed', description: (error as Error).message, intent: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={role} onValueChange={(value) => setRole(value as 'USER' | 'MANAGER')}>
            <TabsList>
              {roleTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {roleTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <form className="grid gap-4" onSubmit={onSubmit}>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">First name</label>
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Last name</label>
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  {tab.value === 'MANAGER' ? (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Gym ID</label>
                      <input
                        value={form.gymId}
                        onChange={(event) => setForm((prev) => ({ ...prev, gymId: event.target.value }))}
                        placeholder="Enter your assigned gym ID"
                        className="rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  ) : null}
                  <Button type="submit" loading={loading} disabled={loading}>
                    Sign up as {tab.label}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
