import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { MainNav } from '@/components/main-nav';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nakshatra Fitness',
  description: 'Unified fitness experience across web, mobile, and connected gyms.',
};

const roles = [
  { label: 'User', href: '/dashboard/user' },
  { label: 'Manager', href: '/dashboard/manager' },
  { label: 'Admin', href: '/dashboard/admin' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
                  Nakshatra Fitness
                </Link>
                <MainNav />
                <div className="flex items-center gap-3">
                  {roles.map((role) => (
                    <Link key={role.href} href={role.href} className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      {role.label}
                    </Link>
                  ))}
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
