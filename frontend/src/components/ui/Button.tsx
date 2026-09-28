import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-bold rounded-full',
      'transition-all duration-150 ease-spring-gentle',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-bg focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-40 disabled:pointer-events-none select-none',
      'text-xs'
    );

    const variants = {
      primary: cn(
        'bg-btn-bg text-btn-text border-none',
        'active:scale-[0.97]'
      ),
      secondary: cn(
        'bg-elevated text-main border border-border',
        'hover:bg-hover hover:border-muted',
        'active:scale-[0.97]'
      ),
      outline: cn(
        'border border-border bg-transparent text-main',
        'hover:bg-hover hover:border-muted',
        'active:scale-[0.97]'
      ),
      subtle: cn(
        'bg-card text-main border border-border',
        'hover:bg-hover hover:border-muted',
        'active:scale-[0.97]'
      ),
      ghost: cn(
        'text-sub hover:text-main',
        'hover:bg-hover',
        'active:scale-[0.97]'
      ),
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs gap-1.5',
      md: 'h-10 px-5 text-xs gap-2',
      lg: 'h-12 px-7 text-sm gap-2.5 font-bold',
      icon: 'h-10 w-10 p-0',
    };

    // Spring config for tactile feel
    const springConfig = { stiffness: 300, damping: 25 };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.01, transition: springConfig }}
        whileTap={{ scale: 0.97, transition: { stiffness: 400, damping: 30 } }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} className="animate-spin shrink-0" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';