import React from 'react';
import { Dialog } from '../ui/Dialog';
import { useBasket } from '../../context/BasketContext';
import { OptimizationStrategy } from '../../types';
import { OptimizationBreakdown } from './OptimizationBreakdown';
import { WhyThisBasket } from './WhyThisBasket';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Tick01Icon,
  Layers01Icon,
  CircleDollarSignIcon,
  Store01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';

const strategies: {
  id: OptimizationStrategy;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    id: 'split_lowest_cost',
    title: 'Lowest Total Cost',
    description: 'Split across stores to minimize spend.',
    icon: Layers01Icon,
  },
  {
    id: 'lowest_product_price',
    title: 'Lowest Item Price',
    description: 'Optimize strictly for unit prices.',
    icon: CircleDollarSignIcon,
  },
  {
    id: 'single_store_best',
    title: 'Single Store Best',
    description: 'One provider with full coverage.',
    icon: Store01Icon,
  },
  {
    id: 'minimize_delivery_fees',
    title: 'Minimize Fees',
    description: 'Balance stores for free delivery.',
    icon: Shield01Icon,
  },
  {
    id: 'nearby_cheaper',
    title: 'Nearby & Cheaper',
    description: 'Find nearby grocery stores where shopping locally could save money.',
    icon: Store01Icon,
  },
];

export function OptimizationModal() {
  const {
    isOptimizationModalOpen,
    setIsOptimizationModalOpen,
    selectedStrategy,
    setSelectedStrategy,
    optimizationResult,
    nearbyResult,
    nearbyLoading,
    nearbyError,
    nearbyRadiusKm,
    setNearbyRadiusKm,
  } = useBasket();

  return (
    <Dialog
      isOpen={isOptimizationModalOpen}
      onClose={() => setIsOptimizationModalOpen(false)}
      title="Optimize Basket"
      description="Choose an allocation strategy to maximize your savings."
      maxWidth="3xl"
    >
      <div className="space-y-5">

        {/* Strategy row — 4 cards side by side */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {strategies.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setSelectedStrategy(strat.id)}
                className={`relative p-3.5 rounded-[18px] text-left border transition-all flex flex-col gap-2.5 ${
                  isSelected
                    ? 'border-main bg-card-item shadow-md'
                    : 'border-border bg-card-inner hover:border-sub'
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-btn-bg' : 'bg-card-item border border-border'
                }`}>
                  <HugeiconsIcon
                    icon={strat.icon}
                    size={16}
                    strokeWidth={1.5}
                    className={isSelected ? 'text-btn-text' : 'text-sub'}
                  />
                </div>

                {/* Text */}
                <div>
                  <div className="text-xs font-bold text-main leading-snug">{strat.title}</div>
                  <p className="text-[11px] text-sub mt-0.5 leading-snug">{strat.description}</p>
                </div>

                {/* Selected tick */}
                {isSelected && (
                  <span className="absolute top-3 right-3">
                    <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2.5} className="text-status-green" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Breakdown + rationale */}
        {selectedStrategy === 'nearby_cheaper' ? (
          <NearbyCheaperPanel result={nearbyResult} loading={nearbyLoading} error={nearbyError} radiusKm={nearbyRadiusKm} onRadiusChange={setNearbyRadiusKm} />
        ) : <OptimizationBreakdown result={optimizationResult} />}
        {selectedStrategy !== 'nearby_cheaper' && <WhyThisBasket result={optimizationResult} />}
      </div>
    </Dialog>
  );
}

function NearbyCheaperPanel({ result, loading, error, radiusKm, onRadiusChange }: { result: import('../../types').NearbyResult | null; loading: boolean; error: string | null; radiusKm: number; onRadiusChange: (radius: number) => void }) {
  return (
    <div className="rounded-[18px] border border-border bg-card-inner p-4 sm:p-5 space-y-4 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-main text-sm">🚶 Nearby &amp; Cheaper</div>
          <p className="text-sub mt-1">Find nearby grocery stores where shopping locally could save money.</p>
        </div>
        <select value={radiusKm} onChange={(event) => onRadiusChange(Number(event.target.value))} className="rounded-xl border border-border bg-background text-main px-2.5 py-2 text-xs shrink-0">
          {[0.5, 1, 2, 3, 5].map((radius) => <option key={radius} value={radius}>{radius < 1 ? `${radius * 1000} m` : `${radius} km`}</option>)}
        </select>
      </div>
      {loading && <div className="rounded-xl border border-border bg-card px-3 py-3 text-sub">🚶 Finding nearby options…<div className="text-[11px] mt-1">Searching nearby grocery stores and comparing available data.</div></div>}
      {error && <div className="rounded-xl border border-border bg-card px-3 py-3 text-sub">Nearby store search unavailable. Existing optimization results are still available.</div>}
      {!loading && !error && result && <>
        <div className="text-sub">{result.message}</div>
        {result.currentBestTotal !== null && <div className="rounded-xl border border-border bg-card px-3 py-3 text-sub">Current best delivered total <span className="font-bold text-main">₹{result.currentBestTotal.toFixed(2)}</span></div>}
        {result.stores.length > 0 && <div className="space-y-2">
          {result.stores.map((store) => <div key={store.placeId ?? `${store.name}-${store.address}`} className="rounded-xl border border-border bg-card px-3.5 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0"><div className="font-bold text-main truncate">{store.name}</div><div className="text-sub mt-1">{store.distanceKm === null ? 'Distance unavailable' : `Approximately ${store.distanceKm.toFixed(1)} km away`}</div>{store.address && <div className="text-[11px] text-sub mt-1 truncate">{store.address}</div>}</div>
            <div className="text-right shrink-0"><div className="font-semibold text-main">Product pricing unavailable</div>{store.url && <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-sub hover:underline mt-1 inline-block">View Store</a>}</div>
          </div>)}
        </div>}
        {result.warnings.map((warning) => <div key={warning.code} className="text-[11px] text-sub">{warning.message}</div>)}
      </>}
    </div>
  );
}
