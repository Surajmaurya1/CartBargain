import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon } from '@hugeicons/core-free-icons';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card-inner py-8 mt-16 transition-colors text-xs text-sub">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-btn-bg flex items-center justify-center text-btn-text">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={12} strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-main">
            CartBargain
          </span>
          <span className="text-[11px] text-sub">
            — Basket Price Comparison
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-sub">
          <span>Blinkit • Zepto • Instamart</span>
          <span>Powered by SerpApi</span>
        </div>
      </div>
    </footer>
  );
}

