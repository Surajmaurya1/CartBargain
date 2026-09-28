import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'subtle' | 'elevated' | 'interactive';
  hoverable?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const base = cn(
    'rounded-[24px] border transition-all duration-200 ease-spring-gentle',
    'bg-card'
  );

  const variants = {
    default: 'border-border',
    subtle: 'border-border/50 bg-elevated/50',
    elevated: 'border-border shadow-elevated dark:shadow-elevated light:shadow-elevated-light',
    interactive: 'border-border hover:border-muted hover:shadow-card-hover dark:hover:shadow-card-hover light:hover:shadow-card-hover-light cursor-pointer',
  };

  const hoverStyles = hoverable && variant !== 'elevated'
    ? 'hover:border-muted hover:shadow-card-hover dark:hover:shadow-card-hover light:hover:shadow-card-hover-light hover:-translate-y-0.5'
    : '';

  return (
    <motion.div
      className={cn(base, variants[variant], hoverStyles, className)}
      whileHover={hoverable ? { y: -2, transition: { stiffness: 300, damping: 25 } } : undefined}
      whileTap={hoverable ? { scale: 0.99, transition: { stiffness: 400, damping: 30 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-5 border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-base sm:text-lg font-bold text-main tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 sm:p-7', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-elevated/50 border-t border-border text-xs text-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* Interactive card for list items, feature cards, etc. */
export interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  onClick?: () => void;
}

export function InteractiveCard({
  className,
  onClick,
  children,
  ...props
}: InteractiveCardProps) {
  return (
    <motion.div
      className={cn(
        'card-base cursor-pointer',
        className
      )}
      whileHover={{ y: -2, transition: { stiffness: 300, damping: 25 } }}
      whileTap={{ scale: 0.99, transition: { stiffness: 400, damping: 30 } }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}