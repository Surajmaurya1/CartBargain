import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  className,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  } as Record<string, string>;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Centering Wrapper */}
          <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-center">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'relative w-full bg-card text-main text-left rounded-[28px] border border-border shadow-elevated dark:shadow-elevated light:shadow-elevated-light z-10 my-4 sm:my-8 flex flex-col max-h-[88vh] overflow-hidden',
                maxWidths[maxWidth],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'dialog-title' : undefined}
              aria-describedby={description ? 'dialog-description' : undefined}
            >
              {/* Header */}
              {(title || description) && (
                <div className="flex items-start justify-between px-6 sm:px-7 pt-5 pb-4 border-b border-border shrink-0 bg-card">
                  <div>
                    {title && (
                      <h2 id="dialog-title" className="text-base sm:text-lg font-bold text-main tracking-tight">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p id="dialog-description" className="text-xs sm:text-sm text-sub mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="text-sub hover:text-main rounded-full p-1.5 hover:bg-hover transition-all duration-150 ease-spring-gentle shrink-0 -mr-1"
                    aria-label="Close dialog"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="px-6 sm:px-7 py-5 overflow-y-auto flex-1 overscroll-contain">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}