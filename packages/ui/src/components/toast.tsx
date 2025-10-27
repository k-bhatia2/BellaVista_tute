import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export type ToastIntent = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  intent?: ToastIntent;
  duration?: number;
  id?: string;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface InternalToast extends ToastOptions {
  id: string;
  createdAt: number;
}

const colors: Record<ToastIntent, string> = {
  info: 'border-blue-500 bg-blue-600 text-white',
  success: 'border-emerald-500 bg-emerald-600 text-white',
  warning: 'border-amber-500 bg-amber-600 text-white',
  error: 'border-red-500 bg-red-600 text-white',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<InternalToast[]>([]);

  const show = React.useCallback((options: ToastOptions) => {
    setToasts((current) => {
      const id = options.id ?? crypto.randomUUID();
      const toast: InternalToast = {
        intent: 'info',
        duration: 3500,
        ...options,
        id,
        createdAt: Date.now(),
      };
      return [...current, toast];
    });
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  React.useEffect(() => {
    if (!toasts.length) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismiss(toast.id), toast.duration ?? 3500),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {typeof window !== 'undefined'
        ? createPortal(
            <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={cn('flex flex-col rounded-lg border p-4 shadow-lg', colors[toast.intent ?? 'info'])}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{toast.title}</p>
                      {toast.description ? <p className="mt-1 text-sm opacity-90">{toast.description}</p> : null}
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold uppercase"
                      onClick={() => dismiss(toast.id)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
};
