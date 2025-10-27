import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { Button } from './button';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const ModalContent: React.FC<ModalProps> = ({ open, onClose, title, children, footer }) => {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            {title ? <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2> : null}
          </div>
          {onClose ? (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
              ×
            </Button>
          ) : null}
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
};

export const Modal: React.FC<ModalProps> = (props) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(<ModalContent {...props} />, document.body);
};
