import React, { useState } from 'react';
import { useBasket } from '../../context/BasketContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ShoppingBag01Icon,
  Location01Icon,
  Search01Icon,
  Store01Icon,
  InformationCircleIcon,
  PlusSignIcon,
  Delete02Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { ItemIcon } from '../ui/ItemIcon';
import { PROVIDERS_META } from '../../data/mockData';

export function GrocerySidebar() {
  const {
    items,
    location,
    searchEngine,
    selectedProviders,
    setCurrentScreen,
    setIsLocationModalOpen,
    removeItem,
    addItem,
  } = useBasket();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('1 unit');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addItem(newItemName.trim(), 1, newItemUnit.trim());
    setNewItemName('');
    setIsAddingItem(false);
  };

  const engineLabels: Record<string, string> = {
    google_shopping: 'Google Shopping',
    quick_aggregator: 'Quick Aggregator',
    serp_direct: 'SerpApi Direct',
  };

  return (
    <aside className="w-full space-y-3">

      {/* Back Button (Desktop) */}
      <Button
        variant="secondary"
        size="md"
        onClick={() => setCurrentScreen('home')}
        leftIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />}
        className="hidden lg:flex w-full justify-start text-xs px-4 h-10 rounded-2xl font-bold shadow-sm"
      >
        Back to Search
      </Button>

      {/* Grocery List Card */}
      <div className="bg-card rounded-[24px] border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={16} strokeWidth={1.5} className="text-sub" />
            <span className="text-sm font-bold text-main">Grocery List</span>
          </div>
          <Badge variant="neutral" size="sm">{items.length} items</Badge>
        </div>

        {/* Items */}
        <div className="px-3 py-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-card-item transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ItemIcon type={item.iconType} className="w-3.5 h-3.5 text-sub shrink-0" />
                <span className="text-xs font-semibold text-main truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-medium text-sub px-2.5 py-0.5 rounded-full bg-card-inner border border-border">
                  {item.unit}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-sub hover:text-red-400 transition-all p-1 rounded-lg"
                  aria-label={`Remove ${item.name}`}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item */}
        <div className="px-4 pb-4">
          {isAddingItem ? (
            <form onSubmit={handleAddItem} className="pt-2 border-t border-border space-y-2 mt-1">
              <Input
                type="text"
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="text-xs h-9"
                autoFocus
              />
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Unit (e.g. 500g)"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="text-xs h-9 flex-1"
                />
                <Button type="submit" size="sm" variant="primary" className="h-9 px-3 text-xs rounded-xl shrink-0">
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingItem(false)}
                  className="h-9 text-xs rounded-xl shrink-0"
                >
                  ✕
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingItem(true)}
              className="w-full mt-2 py-2 text-xs font-medium text-sub hover:text-main hover:bg-card-item rounded-xl border border-dashed border-border flex items-center justify-center gap-1.5 transition-colors"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2} /> Add item
            </button>
          )}
        </div>
      </div>

      {/* Meta Card */}
      <div className="bg-card rounded-[24px] border border-border overflow-hidden">
        {/* Location */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-status-green shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-sub">Delivery location</div>
              <div className="text-xs font-bold text-main truncate">
                {location.formatted || `${location.city}, ${location.pinCode}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-semibold text-sub hover:text-main transition-colors shrink-0 ml-2"
          >
            Edit
          </button>
        </div>

        {/* Engine */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} className="text-sub shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-sub">Search source</div>
              <div className="text-xs font-bold text-main truncate">
                {engineLabels[searchEngine] || searchEngine}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="text-xs font-semibold text-sub hover:text-main transition-colors shrink-0 ml-2"
          >
            Edit
          </button>
        </div>

        {/* Providers */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <HugeiconsIcon icon={Store01Icon} size={16} strokeWidth={1.5} className="text-sub shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-sub">Active stores</div>
              <div className="text-xs font-bold text-main capitalize truncate">
                {selectedProviders.map((p) => PROVIDERS_META[p]?.name || p).join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="text-xs font-semibold text-sub hover:text-main transition-colors shrink-0 ml-2"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Info pill */}
      <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-[18px] bg-card-inner border border-border text-xs text-sub">
        <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.5} className="mt-0.5 shrink-0" />
        <p className="leading-relaxed">Searched across providers to get best prices and fees in your locality.</p>
      </div>
    </aside>
  );
}

