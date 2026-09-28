import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon, CalculateIcon } from '@hugeicons/core-free-icons';
import { OptimizationResult } from '../../types';

interface WhyThisBasketProps {
  result: OptimizationResult;
}

export function WhyThisBasket({ result }: WhyThisBasketProps) {
  const [isOpen, setIsOpen] = useState(false); // collapsed by default to keep modal compact

  return (
    <div className="rounded-[18px] border border-border bg-card-inner overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-card-item transition-colors"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={CalculateIcon} size={15} strokeWidth={1.5} className="text-sub" />
          <span className="font-bold text-main text-xs">Why split this order?</span>
          <span className="text-[11px] text-sub">(Savings calculation)</span>
        </div>
        {isOpen
          ? <HugeiconsIcon icon={ArrowUp01Icon} size={14} strokeWidth={1.5} className="text-sub" />
          : <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.5} className="text-sub" />
        }
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-1.5 border-t border-border">
          {result.rationale.map((line, idx) => (
            <p key={idx} className="leading-relaxed flex items-start gap-2 text-sub">
              <span className="text-status-green font-bold select-none mt-px">•</span>
              <span>{line}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

