import React, { useState } from 'react';
import { OptimizationResult } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { PROVIDERS_META } from '../../data/mockData';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  LinkSquare01Icon,
  Copy01Icon,
  Tick01Icon,
  Clock01Icon,
  TrendingDownIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '../ui/Button';
import { ItemIcon } from '../ui/ItemIcon';

interface OptimizationBreakdownProps {
  result: OptimizationResult;
}

export function OptimizationBreakdown({ result }: OptimizationBreakdownProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyList = () => {
    const lines: string[] = [`CartBargain Optimized Basket — Total: ${formatCurrency(result.estimatedTotal)}`];
    result.orders.forEach((order) => {
      lines.push(`\n[${order.providerName}] - Subtotal: ${formatCurrency(order.subtotal)}`);
      order.items.forEach((item) => {
        lines.push(`  • ${item.item.name} (${item.item.unit}) - ${formatCurrency(item.offer.price)}`);
      });
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 text-xs">

      {/* ── Total bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 rounded-[18px] bg-card-inner border border-border">
        <div>
          <span className="text-xs text-sub font-semibold block mb-0.5">
            Optimized checkout total
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-main tabular-nums">
              {formatCurrency(result.estimatedTotal)}
            </span>
            <span className="text-sm text-sub line-through tabular-nums">
              {formatCurrency(result.singleStoreBaselineTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-btn-bg text-btn-text text-xs font-bold shadow-sm shrink-0">
          <HugeiconsIcon icon={TrendingDownIcon} size={15} strokeWidth={2} />
          <span>Save ~{formatCurrency(result.savings)} ({result.savingsPercent}%)</span>
        </div>
      </div>

      {/* ── Store Allocation ───────────────────────────────────── */}
      <div>
        <div className="text-xs font-bold text-sub mb-2 px-0.5">
          Split across {result.orders.length} {result.orders.length === 1 ? 'store' : 'stores'}
        </div>

        {/* Cards side by side when multiple stores */}
        <div className={`grid gap-3 ${result.orders.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {result.orders.map((order) => {
            const meta = PROVIDERS_META[order.provider];
            return (
              <div
                key={order.provider}
                className="rounded-[18px] border border-border bg-card-inner overflow-hidden shadow-sm"
              >
                {/* Store header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: meta?.brandColor || '#94A3B8' }}
                    />
                    <span className="font-bold text-main capitalize text-sm">{order.providerName}</span>
                  </div>
                  <span className="font-bold text-main text-sm tabular-nums">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                {/* Item rows */}
                <div className="px-4 py-2.5 space-y-1.5">
                  {order.items.map(({ item, offer }) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs text-sub"
                    >
                      <div className="flex items-center gap-1.5 truncate min-w-0">
                        <ItemIcon type={item.iconType} className="w-3 h-3 shrink-0 text-sub" />
                        <span className="truncate text-main">{item.name}</span>
                        <span className="text-[11px] text-sub shrink-0">({item.unit})</span>
                      </div>
                      <span className="font-semibold text-main shrink-0 ml-2 tabular-nums">
                        {formatCurrency(offer.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                  <span className="text-sub flex items-center gap-1 text-xs">
                    <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} className="text-sub" />
                    ~{meta?.estimatedTimeMin || 10}–{meta?.estimatedTimeMax || 15}m delivery
                  </span>
                  <a
                    href={order.items[0]?.offer.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-main hover:underline text-xs"
                  >
                    Open store <HugeiconsIcon icon={LinkSquare01Icon} size={14} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────── */}
      <div className="flex justify-end pt-0.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyList}
          leftIcon={
            copied
              ? <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2.5} className="text-status-green" />
              : <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={1.5} />
          }
          className="text-xs h-9 px-4 rounded-full"
        >
          {copied ? 'Copied!' : 'Copy Split List'}
        </Button>
      </div>
    </div>
  );
}

