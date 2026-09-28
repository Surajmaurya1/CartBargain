import React from 'react';
import { POPULAR_PRESETS } from '../../data/mockData';
import { useBasket } from '../../context/BasketContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export function PopularBaskets() {
  const { loadPreset } = useBasket();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card border border-border text-xs font-semibold text-sub mb-3">
          <HugeiconsIcon icon={SparklesIcon} size={15} strokeWidth={1.5} className="text-status-green" />
          <span>Quick Presets</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
          Preset Grocery Baskets
        </h3>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          Select any preset to instantly compare prices across Blinkit, Zepto, and Instamart.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {POPULAR_PRESETS.map((preset, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadPreset(preset.itemsString)}
            className="group p-7 rounded-[32px] border border-border bg-card hover:border-sub transition-all cursor-pointer flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-main">
                  {preset.name}
                </span>
                <span className="text-xs font-mono text-sub px-3 py-1 rounded-full bg-card-inner border border-border">
                  {preset.itemCount} items
                </span>
              </div>
              <p className="text-sm text-sub line-clamp-2 leading-relaxed">
                {preset.itemsString}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between text-xs">
              <span className="text-sub">
                Est. Savings: <strong className="text-status-green font-bold">{preset.estSavings}</strong>
              </span>
              <span className="font-bold text-main inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card-item group-hover:bg-btn-bg group-hover:text-btn-text transition-colors">
                Compare <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

