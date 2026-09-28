import React from 'react';
import { SearchPanel } from './SearchPanel';
import { LiveBasketPreview } from './LiveBasketPreview';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon, SparklesIcon } from '@hugeicons/core-free-icons';

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 space-y-6 sm:space-y-8">
      {/* Hero Headline & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-3xl space-y-3.5"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-heading leading-[1.2] sm:leading-[1.2] flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-2">
          <span>Compare.</span>

          {/* Cart yellow "Optimize." with shopping cart icon on the right side */}
          <span className="inline-flex items-center gap-1.5 sm:gap-2 text-amber-500 dark:text-amber-400">
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">
              Optimize
            </span>
            <HugeiconsIcon
              icon={ShoppingCart01Icon}
              size={32}
              strokeWidth={2.2}
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-amber-500 dark:text-amber-400 inline-block align-middle shrink-0"
            />
          </span>

          <span>Save on every order.</span>
        </h1>
        <p className="text-sm sm:text-base text-sub max-w-2xl leading-relaxed">
          Find where your grocery list is cheapest across Blinkit, Zepto, and Instamart. Compare total basket prices or split your cart to maximize savings.
        </p>
      </motion.div>


      {/* Side-by-Side Comparison Card & Hero Image Card (Aligned perfectly to each other) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* On Mobile: Image card first (order-1), on Desktop: right column (5 cols, order-2) */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col">
          <LiveBasketPreview />
        </div>

        {/* Search / Comparison Card (7 cols, order-2 on mobile, order-1 on desktop) */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col">
          <SearchPanel />
        </div>
      </div>
    </section>
  );
}