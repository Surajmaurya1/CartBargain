import React, { useState } from 'react';
import { ComparisonTable } from './ComparisonTable';
import { GroceryListModal } from './GroceryListModal';
import { SearchSettingsModal } from './SearchSettingsModal';
import { motion } from 'framer-motion';
import { useBasket } from '../../context/BasketContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ShoppingBag01Icon, SlidersHorizontalIcon } from '@hugeicons/core-free-icons';

export function ResultsView() {
  const { setCurrentScreen, items, location, searchError, compareStatus } = useBasket();
  const [isGroceryListModalOpen, setIsGroceryListModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-8 sm:pb-12 space-y-6"
    >
      {/* Top Results Action Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5 pb-2 border-b border-border/70 overflow-x-auto no-scrollbar">
        {/* Back to Search (Icon only) */}
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className="w-10 h-10 rounded-2xl bg-card-item border border-border text-main hover:bg-hover hover:border-sub flex items-center justify-center shrink-0 transition-colors shadow-sm focus:outline-none"
          aria-label="Back to search"
          title="Back to search"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
        </button>

        {/* Grocery List Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsGroceryListModalOpen(true)}
          className="h-10 px-3.5 sm:px-4 rounded-2xl bg-card-item border border-border hover:bg-hover hover:border-sub text-main flex items-center gap-2 shrink-0 transition-colors shadow-sm text-xs font-bold focus:outline-none"
          title="View & edit grocery basket"
        >
          <HugeiconsIcon icon={ShoppingBag01Icon} size={16} strokeWidth={1.5} className="text-status-green shrink-0" />
          <span>Grocery List</span>
          <span className="px-2 py-0.5 rounded-full bg-btn-bg text-btn-text text-[11px] font-extrabold ml-0.5">
            {items.length}
          </span>
        </button>

        {/* Location & Stores Settings Trigger */}
        <button
          type="button"
          onClick={() => setIsSettingsModalOpen(true)}
          className="h-10 px-3.5 sm:px-4 rounded-2xl bg-card-item border border-border hover:bg-hover hover:border-sub text-main flex items-center gap-2 shrink-0 transition-colors shadow-sm text-xs font-bold focus:outline-none"
          title="Store and location settings"
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} size={16} strokeWidth={1.5} className="text-sub shrink-0" />
          <span className="max-w-[120px] sm:max-w-[180px] truncate">
            {location.pinCode || location.city}
          </span>
        </button>
      </div>

      {/* Main Results Content (Comparison Matrix, Store Totals, Optimize CTA) */}
      <div className="w-full">
        {searchError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchError}</div>}
        {compareStatus === 'partial' && !searchError && <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Some provider or item searches returned partial data. Unknown fees and unavailable items are shown as —.</div>}
        <ComparisonTable />
      </div>

      {/* Modals */}
      <GroceryListModal
        isOpen={isGroceryListModalOpen}
        onClose={() => setIsGroceryListModalOpen(false)}
      />
      <SearchSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </motion.div>
  );
}
