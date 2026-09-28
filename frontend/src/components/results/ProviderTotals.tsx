import React from 'react';
import { useBasket } from '../../context/BasketContext';
import { Badge } from '../ui/Badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { formatCurrency } from '../../lib/utils';
import { PROVIDERS_META } from '../../data/mockData';

export function ProviderTotals() {
  const { providerSummaries } = useBasket();

  return (
    <aside className="w-full space-y-3">

      {/* Header label */}
      <div className="px-1">
        <h3 className="text-sm font-bold text-main">Store Price Summary</h3>
        <p className="text-xs text-sub mt-0.5">Item subtotal and fees breakdown</p>
      </div>

      {/* Provider cards */}
      <div className="space-y-3">
        {providerSummaries.map((summary) => {
          const meta = PROVIDERS_META[summary.provider];
          return (
            <div
              key={summary.provider}
              className="rounded-[24px] border border-border bg-card overflow-hidden transition-all shadow-sm"
            >
              {/* Provider name row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta?.brandColor || '#94A3B8' }}
                  />
                  <span className="text-sm font-bold text-main capitalize">{summary.name}</span>
                </div>
                {summary.isCheapestOverall && (
                  <Badge variant="cheapest" size="sm" className="text-xs font-semibold px-2.5 py-0.5">
                    Best Price
                  </Badge>
                )}
              </div>

              {/* Breakdown */}
              <div className="px-5 py-4 space-y-2 text-xs">
                <div className="flex justify-between text-sub">
                  <span>Products</span>
                  <span className="font-semibold text-main tabular-nums">{formatCurrency(summary.itemTotal)}</span>
                </div>
                <div className="flex justify-between text-sub">
                  <span>Delivery &amp; Fees</span>
                  <span className="tabular-nums font-medium">
                    {summary.deliveryFee !== null ? formatCurrency(summary.deliveryFee) : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sub">
                  <span>Handling</span>
                  <span className="tabular-nums font-medium">
                    {summary.handlingFee !== null ? formatCurrency(summary.handlingFee) : '—'}
                  </span>
                </div>
              </div>

              {/* Total row */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-card-inner border-t border-border">
                <span className="text-xs font-semibold text-sub">Estimated Total</span>
                <span className="text-xl font-extrabold text-main tabular-nums">
                  {formatCurrency(summary.estimatedTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-[18px] bg-card-inner border border-border text-xs text-sub">
        <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.5} className="mt-0.5 shrink-0" />
        <p className="leading-relaxed">Prices and availability may vary at merchant checkout.</p>
      </div>
    </aside>
  );
}

