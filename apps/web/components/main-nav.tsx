"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@nakshatra/ui';

const navItems = [
  { href: '/dashboard/user', label: 'Gym' },
  { href: '/featured', label: 'Featured' },
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
              isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
