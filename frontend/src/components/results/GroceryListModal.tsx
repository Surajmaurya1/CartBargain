import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { useBasket } from '../../context/BasketContext';
import { ItemIcon } from '../ui/ItemIcon';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, PlusSignIcon, ShoppingBag01Icon, Tick01Icon } from '@hugeicons/core-free-icons';

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GroceryListModal({ isOpen, onClose }: GroceryListModalProps) {
  const { items, addItem, removeItem } = useBasket();
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('1 unit');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addItem(newItemName.trim(), 1, newItemUnit.trim());
    setNewItemName('');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.5} className="text-main" />
          <span>Your Grocery Basket ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </div>
      }
      description="Add or remove items to update live comparison prices across stores."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="p-3.5 rounded-2xl bg-card-inner border border-border space-y-2.5">
          <div className="text-xs font-bold text-main">Add item to basket</div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Item name (e.g. Curd)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="text-xs h-10 flex-1"
            />
            <Input
              type="text"
              placeholder="Unit (e.g. 400g)"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="text-xs h-10 w-28 shrink-0"
            />
            <Button type="submit" size="sm" variant="primary" className="h-10 px-4 text-xs rounded-xl shrink-0 font-bold">
              <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2} className="mr-1" /> Add
            </Button>
          </div>
        </form>

        {/* Item List */}
        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-card-item border border-border/80 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center border border-border shrink-0">
                  <ItemIcon type={item.iconType} className="w-3.5 h-3.5 text-sub" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-main truncate">{item.name}</div>
                  <div className="text-[11px] text-sub">{item.unit}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-sub hover:text-red-400 hover:bg-hover rounded-xl transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.5} />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-8 text-center text-xs text-sub">
              Your grocery basket is currently empty.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-border">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="h-10 px-6 text-xs font-bold rounded-full"
            leftIcon={<HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2} />}
          >
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

