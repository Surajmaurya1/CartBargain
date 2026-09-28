import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShoppingBasket01Icon,
  TrendingDownIcon,
  Clock01Icon,
  ShieldCheckIcon,
} from '@hugeicons/core-free-icons';

export function LiveBasketPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full h-full max-w-lg mx-auto flex flex-col items-center justify-center"
    >
      <div className="relative w-full h-full rounded-[32px] bg-card/75 backdrop-blur-xl border border-border p-5 sm:p-6 shadow-xl overflow-hidden flex flex-col items-center justify-between text-center">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-btn-bg/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-background border border-border text-xs font-semibold text-sub mb-2 shadow-sm">
          <HugeiconsIcon icon={ShoppingBasket01Icon} size={15} strokeWidth={1.5} className="text-status-green" />
          <span>Real-time Quick Commerce Comparison</span>
        </div>

        {/* Basket Hero Image */}
        <div className="relative w-full flex items-center justify-center my-2">
          <motion.img
            src={`${import.meta.env.BASE_URL}basket-hero.png`}
            alt="Compare Quick Commerce Baskets across Blinkit, Zepto, and Instamart"
            className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] h-auto object-contain drop-shadow-lg select-none"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          />
        </div>

        {/* Bottom Feature Badges */}
        <div className="grid grid-cols-3 gap-2 w-full pt-3.5 border-t border-border/80 text-xs">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-card-inner border border-border/60 flex flex-col items-center">
            <HugeiconsIcon icon={TrendingDownIcon} size={16} strokeWidth={2} className="text-status-green mb-0.5" />
            <span className="font-bold text-main text-[11px] sm:text-xs">Save ~₹45–₹180</span>
            <span className="text-[10px] text-sub">Per Basket</span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-2xl bg-card-inner border border-border/60 flex flex-col items-center">
            <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.5} className="text-amber-500 mb-0.5" />
            <span className="font-bold text-main text-[11px] sm:text-xs">8–15 Mins</span>
            <span className="text-[10px] text-sub">Fast Delivery</span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-2xl bg-card-inner border border-border/60 flex flex-col items-center">
            <HugeiconsIcon icon={ShieldCheckIcon} size={16} strokeWidth={1.5} className="text-blue-500 mb-0.5" />
            <span className="font-bold text-main text-[11px] sm:text-xs">4 Top Stores</span>
            <span className="text-[10px] text-sub">Compared Live</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

