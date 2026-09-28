import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, GitForkIcon, ShoppingBag01Icon } from '@hugeicons/core-free-icons';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Enter Items',
      description: 'Type items with quantities. We parse units automatically.',
    },
    {
      step: '02',
      icon: <HugeiconsIcon icon={GitForkIcon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Compare Stores',
      description: 'Find matching products, stock, and fees across stores in real-time.',
    },
    {
      step: '03',
      icon: <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Optimize Total',
      description: 'Check out single store or split items for maximum grocery savings.',
    },
  ];

  return (
    <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
          How It Works
        </h3>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          Simple 3-step basket comparison and optimization workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="block-card p-6 flex flex-col items-start shadow-md"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-2xl bg-btn-bg flex items-center justify-center">
                {step.icon}
              </div>
              <span className="text-sm font-mono font-bold text-sub">
                {step.step}
              </span>
            </div>
            <h4 className="text-base font-bold text-main mb-1.5">
              {step.title}
            </h4>
            <p className="text-xs text-sub leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

