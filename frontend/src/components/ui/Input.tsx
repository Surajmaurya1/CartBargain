import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface InputProps extends HTMLMotionProps<'input'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightIcon, error, label, helperText, ...props }, ref) => {
    const inputId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-main mb-2 flex items-center gap-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-muted pointer-events-none flex items-center shrink-0">
              {leftIcon}
            </div>
          )}
          <motion.input
            type={type}
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-background border border-border px-4 py-3 text-sm text-main placeholder:text-muted transition-all duration-150 ease-spring-gentle',
              'rounded-2xl h-12',
              'focus:outline-none focus:border-btn-bg focus:ring-0',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-elevated/50',
              'hover:border-muted/60',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            whileFocus={{ scale: 1.002, transition: { stiffness: 300, damping: 25 } }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-muted flex items-center shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-500 flex items-center gap-1.5"
            role="alert"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-xs text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';