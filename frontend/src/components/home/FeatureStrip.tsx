import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  BalanceScaleIcon,
  CpuIcon,
  PiggyBankIcon,
  ShieldCheckIcon,
} from '@hugeicons/core-free-icons';

export function FeatureStrip() {
  const features = [
    {
      icon: <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Multiple Stores',
      description: 'Blinkit, Zepto, Instamart, BB Now.',
    },
    {
      icon: <HugeiconsIcon icon={BalanceScaleIcon} size={16} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Full Basket Pricing',
      description: 'Compare products and delivery fees.',
    },
    {
      icon: <HugeiconsIcon icon={CpuIcon} size={16} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Cart Optimization',
      description: 'Split cart calculation for lower total.',
    },
    {
      icon: <HugeiconsIcon icon={PiggyBankIcon} size={16} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Real Savings',
      description: 'Transparent price delta breakdown.',
    },
    {
      icon: <HugeiconsIcon icon={ShieldCheckIcon} size={16} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Live SerpApi',
      description: 'Verified public merchant data.',
    },
  ];

  return (
    <div className="feature-strip-bg py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="block-card flex flex-col items-start p-5"
            >
              <div className="w-10 h-10 rounded-2xl bg-btn-bg flex items-center justify-center mb-3 shrink-0">
                {feature.icon}
              </div>
              <h4 className="text-sm font-bold text-main">
                {feature.title}
              </h4>
              <p className="text-xs text-sub mt-1 leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

