import * as React from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  outline: 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <span
      className={cn('inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold uppercase', badgeStyles[variant], className)}
      {...props}
    />
  );
};
