import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  WheatIcon,
  RiceBowl01Icon,
  MilkBottleIcon,
  EggIcon,
  Bread01Icon,
  PackageIcon,
  DropletIcon,
  Coffee01Icon,
  Package01Icon,
} from '@hugeicons/core-free-icons';
import { ItemIconType } from '../../types';

interface ItemIconProps {
  type?: ItemIconType | string;
  className?: string;
  size?: number;
}

export function ItemIcon({ type, className = 'w-4 h-4', size = 16 }: ItemIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'wheat':
        return WheatIcon;
      case 'rice':
        return RiceBowl01Icon;
      case 'milk':
        return MilkBottleIcon;
      case 'egg':
        return EggIcon;
      case 'bread':
        return Bread01Icon;
      case 'butter':
        return PackageIcon;
      case 'oil':
        return DropletIcon;
      case 'coffee':
        return Coffee01Icon;
      default:
        return Package01Icon;
    }
  };

  return <HugeiconsIcon icon={getIcon()} size={size} className={className} strokeWidth={1.5} />;
}

