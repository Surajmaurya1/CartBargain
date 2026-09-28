import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cheapest' | 'alternative' | 'missing' | 'neutral' | 'success' | 'accent';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const base = cn(
    'inline-flex items-center gap-1.5 font-bold select-none rounded-full',
    'transition-all duration-150 ease-spring-gentle'
  );

  const variants = {
    default: 'bg-hover text-main border border-border',
    cheapest: 'bg-btn-bg text-btn-text font-extrabold',
    success: 'bg-btn-bg/15 text-btn-text border border-btn-bg/30',
    accent: 'bg-hover text-sub border border-border',
    alternative: 'bg-elevated text-sub border border-border/50',
    missing: 'bg-elevated text-muted border border-dashed border-border',
    neutral: 'bg-card text-main border border-border',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3.5 py-1',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}