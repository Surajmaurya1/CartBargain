import React from 'react';
import { HugeiconsIcon, HugeiconsProps } from '@hugeicons/react';

export interface HugeIconProps extends Omit<HugeiconsProps, 'icon'> {
  icon: any;
}

export function HugeIcon({
  icon,
  size = 16,
  strokeWidth = 1.5,
  className,
  ...props
}: HugeIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}

export { HugeiconsIcon };
export * from '@hugeicons/core-free-icons';
