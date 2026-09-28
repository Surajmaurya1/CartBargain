import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
}

export function Select({
  options,
  value,
  onChange,
  className,
  leftIcon,
  disabled,
  label,
  helperText,
  error,
  ...props
}: SelectProps) {
  const selectId = React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-2xl border border-border bg-background px-4 py-3 pr-12 text-sm font-medium text-main transition-all duration-150 ease-spring-gentle h-12',
            'focus:outline-none focus:border-btn-bg focus:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-elevated/50',
            'hover:border-muted/60',
            leftIcon && 'pl-12',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background text-main py-2">
              {opt.label} {opt.sublabel ? ` (${opt.sublabel})` : ''}
            </option>
          ))}
        </select>
        <div className="absolute right-4 text-muted pointer-events-none flex items-center shrink-0">
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.5} />
        </div>
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