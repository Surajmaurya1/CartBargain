import React from 'react';
import { useBasket } from '../../context/BasketContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, SparklesIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { formatCurrency } from '../../lib/utils';
import { PROVIDERS_META } from '../../data/mockData';
import { ItemIcon } from '../ui/ItemIcon';
import { motion } from 'framer-motion';
import { BorderBeam } from 'border-beam';
import { useTheme } from '../../context/ThemeContext';

export function ComparisonTable() {
  const { theme } = useTheme();
  const {
    comparisonRows,
    providerSummaries,
    selectedProviders,
    setIsOptimizationModalOpen,
    items,
  } = useBasket();

  // Product col width shrinks as more providers are selected
  const providerCount = selectedProviders.length;
  const productColWidth =
    providerCount >= 4 ? '30%' :
    providerCount === 3 ? '34%' :
    providerCount === 2 ? '40%' : '50%';

  return (
    <div className="space-y-6">

      {/* ── Table Card ──────────────────────────────────────────── */}
      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">

        {/* Card Header — clean and grounded */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-heading tracking-tight leading-tight">
                Live Store Price Comparison
              </h2>
              <p className="text-xs text-sub mt-1">
                Comparing item rates and availability across quick delivery stores.
              </p>
            </div>
            <Badge
              variant="neutral"
              size="sm"
              className="self-start text-xs font-semibold px-3 py-1 shrink-0"
            >
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        {/* Table — Responsive horizontal swipe on mobile with comfortable column widths */}
        <div className="overflow-x-auto scrollbar-none sm:scrollbar-thin">
          <table className="w-full min-w-[480px] sm:min-w-full border-collapse">
            <colgroup>
              <col style={{ width: '40%', minWidth: '160px' }} />
              {selectedProviders.map((pId) => (
                <col
                  key={pId}
                  style={{ width: `${60 / providerCount}%`, minWidth: '95px' }}
                />
              ))}
            </colgroup>

            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 sm:px-5 py-3 text-xs font-semibold text-sub bg-card-inner">
                  Item
                </th>
                {selectedProviders.map((pId) => {
                  const meta = PROVIDERS_META[pId];
                  return (
                    <th key={pId} className="px-3 py-3 text-center text-xs font-semibold text-sub bg-card-inner">
                      <div className="inline-flex items-center gap-1.5 font-bold text-main">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: meta?.brandColor || '#94A3B8' }}
                        />
                        <span className="capitalize">{meta?.name || pId}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {comparisonRows.map((row) => (
                <tr
                  key={row.item.id}
                  className="group hover:bg-card-inner/60 transition-colors"
                >
                  {/* Product Column */}
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-card-item flex items-center justify-center shrink-0 border border-border group-hover:border-sub transition-colors">
                        <ItemIcon type={row.item.iconType} className="w-3.5 h-3.5 text-sub" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-main leading-snug whitespace-nowrap">
                          {row.item.name}{' '}
                          <span className="font-normal text-sub text-xs">({row.item.unit})</span>
                        </div>
                        <div className="text-[11px] text-sub">Qty: {row.item.quantity}</div>
                      </div>
                    </div>
                  </td>

                  {/* Provider Cells */}
                  {selectedProviders.map((pId) => {
                    const offer = row.offers[pId];

                    if (!offer || !offer.available) {
                      return (
                        <td key={pId} className="px-3 py-4 text-center">
                          <span className="text-base text-sub/40 font-semibold">—</span>
                          <div className="text-[10px] text-sub/50 mt-0.5 whitespace-nowrap">Not in stock</div>
                        </td>
                      );
                    }

                    return (
                      <td key={pId} className="px-3 py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="text-base font-extrabold text-main tabular-nums">
                            {formatCurrency(offer.price)}
                          </span>
                          {offer.isCheapest ? (
                            <Badge variant="cheapest" size="sm" className="text-[10px] px-2 py-px whitespace-nowrap">
                              Best price
                            </Badge>
                          ) : (
                            <Badge variant="alternative" size="sm" className="text-[10px] px-2 py-px whitespace-nowrap">
                              Alt
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Provider Summary Grid ────────────────────────────────── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-heading">Store Totals at a Glance</h3>
          <span className="text-xs text-sub hidden sm:inline">Estimated totals with delivery fees</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2.5">
          {providerSummaries.map((summary) => {
            const meta = PROVIDERS_META[summary.provider];
            return (
              <div
                key={summary.provider}
                className={`relative p-5 rounded-[22px] border transition-all shadow-card flex flex-col justify-between ${
                  summary.isCheapestOverall
                    ? 'border-main bg-card shadow-md ring-1 ring-main/15'
                    : 'border-border bg-card-inner'
                }`}
              >
                {/* Floating Cheapest Store Tag on Top */}
                {summary.isCheapestOverall && (
                  <div className="absolute -top-3 left-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-btn-bg text-btn-text text-[11px] font-bold shadow-sm whitespace-nowrap">
                      <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2.5} className="text-btn-text" /> Cheapest Store
                    </span>
                  </div>
                )}

                <div>
                  {/* Store Name & Delivery ETA */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: meta?.brandColor || '#94A3B8' }}
                      />
                      <span className="text-sm font-bold text-main capitalize truncate">{summary.name}</span>
                    </div>
                    <span className="text-[11px] text-sub font-medium shrink-0">
                      ~{meta?.estimatedTimeMin || 10}–{meta?.estimatedTimeMax || 15}m
                    </span>
                  </div>

                  {/* Main Estimated Total */}
                  <div className="mb-4">
                    <span className="text-xs text-sub font-medium block mb-0.5">Total with delivery</span>
                    <span className="text-2xl font-extrabold text-main tabular-nums leading-none">
                      {formatCurrency(summary.estimatedTotal)}
                    </span>
                  </div>
                </div>

                {/* Subtotals Footer */}
                <div className="space-y-1.5 text-xs text-sub border-t border-border pt-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <span>Items subtotal</span>
                    <span className="text-main font-semibold tabular-nums">{formatCurrency(summary.itemTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery &amp; handling</span>
                    <span className="tabular-nums font-medium">
                      {summary.deliveryFee !== null ? formatCurrency(summary.deliveryFee) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Optimize CTA ─────────────────────────────────────────── */}
      <div
        className="px-5 sm:px-7 py-5 sm:py-6 rounded-[24px] border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-status-green">
            <HugeiconsIcon icon={SparklesIcon} size={15} strokeWidth={1.5} />
            <span>Split &amp; Save Algorithm</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-main leading-snug">
            Split your cart across stores to save the most
          </h3>
          <p className="text-xs text-sub">
            Automatically calculates the best item allocations to beat single-store checkout totals.
          </p>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex">
          <BorderBeam
            size="pulse-inner"
            colorVariant="ocean"
            theme={theme}
            strength={1}
            className="w-full sm:w-auto rounded-full overflow-hidden"
          >
            <Button
              onClick={() => setIsOptimizationModalOpen(true)}
              variant="outline"
              size="md"
              className="w-full sm:w-auto font-extrabold px-6 h-12 text-sm rounded-full shadow-md justify-center bg-card/40 dark:bg-card-inner/50 backdrop-blur-xl border border-border/80 hover:bg-hover/70 text-main active:scale-[0.98] transition-all"
              rightIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} className="text-status-green" />}
            >
              Optimize My Cart
            </Button>
          </BorderBeam>
        </div>
      </div>
    </div>
  );
}


