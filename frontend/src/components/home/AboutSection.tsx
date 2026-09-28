import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon, Database01Icon, SparklesIcon } from '@hugeicons/core-free-icons';

export function AboutSection() {
  const features = [
    {
      tag: 'LIVE',
      icon: <HugeiconsIcon icon={Database01Icon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'SerpApi Data Feeds',
      description: 'Real-time search queries against actual merchant catalogs and current delivery fees.',
    },
    {
      tag: '100%',
      icon: <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Unbiased Algorithms',
      description: 'Deterministic unit-cost math with zero store bias, affiliate manipulation, or hidden fees.',
    },
    {
      tag: 'DIRECT',
      icon: <HugeiconsIcon icon={SparklesIcon} size={20} strokeWidth={1.5} className="text-btn-text" />,
      title: 'Seamless Checkout',
      description: 'One-tap store redirection to complete your optimized basket directly in your preferred app.',
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
          About CartBargain
        </h3>
        <p className="text-sm sm:text-base text-sub mt-1.5 max-w-2xl leading-relaxed">
          An independent grocery price intelligence platform aggregating verified quick commerce listings across Blinkit, Zepto, and Instamart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="block-card p-6 flex flex-col items-start shadow-md"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-2xl bg-btn-bg flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-sm font-mono font-bold text-sub">
                {item.tag}
              </span>
            </div>
            <h4 className="text-base font-bold text-main mb-1.5">
              {item.title}
            </h4>
            <p className="text-xs text-sub leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

