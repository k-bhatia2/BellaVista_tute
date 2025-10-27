import * as React from 'react';
import { cn } from '../utils/cn';

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn('w-full table-auto border-collapse text-sm text-slate-700 dark:text-slate-200', className)}
      {...props}
    />
  ),
);
Table.displayName = 'Table';

export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-slate-50 text-left uppercase tracking-wide text-slate-500 dark:bg-slate-900', className)} {...props} />
  ),
);
TableHead.displayName = 'TableHead';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('divide-y divide-slate-200 dark:divide-slate-700', className)} {...props} />,
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('hover:bg-slate-100 dark:hover:bg-slate-800', className)} {...props} />
  ),
);
TableRow.displayName = 'TableRow';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-3 align-middle', className)} {...props} />
  ),
);
TableCell.displayName = 'TableCell';

export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wide', className)} {...props} />
  ),
);
TableHeaderCell.displayName = 'TableHeaderCell';
