import React from 'react';
import { Dialog } from '../ui/Dialog';
import { useBasket } from '../../context/BasketContext';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ProviderId, SearchEngineType } from '../../types';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Location01Icon,
  Search01Icon,
  Store01Icon,
  Tick01Icon,
  SlidersHorizontalIcon,
} from '@hugeicons/core-free-icons';

interface SearchSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchSettingsModal({ isOpen, onClose }: SearchSettingsModalProps) {
  const {
    location,
    searchEngine,
    setSearchEngine,
    selectedProviders,
    toggleProvider,
    setIsLocationModalOpen,
  } = useBasket();

  const engineOptions = [
    { value: 'google_shopping', label: 'Google Shopping' },
    { value: 'quick_aggregator', label: 'Quick Aggregator' },
    { value: 'serp_direct', label: 'SerpApi Direct' },
  ];

  const providerOptions: { id: ProviderId; name: string; brandColor: string }[] = [
    { id: 'blinkit', name: 'Blinkit', brandColor: '#EAB308' },
    { id: 'zepto', name: 'Zepto', brandColor: '#A855F7' },
    { id: 'instamart', name: 'Instamart', brandColor: '#F97316' },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SlidersHorizontalIcon} size={20} strokeWidth={1.5} className="text-main" />
          <span>Location &amp; Search Settings</span>
        </div>
      }
      description="Update delivery address, comparison sources, and active quick commerce stores."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Delivery Location Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-main flex items-center gap-2">
            <HugeiconsIcon icon={Location01Icon} size={15} strokeWidth={1.5} className="text-sub" />
            Delivery Location
          </label>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card-inner border border-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-status-green shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-main truncate">
                  {location.formatted || `${location.city}, ${location.pinCode}`}
                </div>
                <div className="text-[11px] text-sub">PIN: {location.pinCode}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsLocationModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-main hover:bg-hover transition-colors shrink-0"
            >
              Change Location
            </button>
          </div>
        </div>

        {/* Search Engine Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-main flex items-center gap-2">
            <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.5} className="text-sub" />
            Search Source Engine
          </label>
          <Select
            options={engineOptions}
            value={searchEngine}
            onChange={(v) => setSearchEngine(v as SearchEngineType)}
          />
        </div>

        {/* Stores Selection Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-main flex items-center gap-2">
            <HugeiconsIcon icon={Store01Icon} size={15} strokeWidth={1.5} className="text-sub" />
            Active Quick Commerce Stores
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {providerOptions.map((provider) => {
              const isSelected = selectedProviders.includes(provider.id);
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => toggleProvider(provider.id)}
                  className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'border-main bg-card shadow-sm ring-1 ring-main/15'
                      : 'border-border bg-card-inner hover:border-sub'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: provider.brandColor }}
                    />
                    <span className="text-xs font-bold text-main">{provider.name}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-btn-bg text-btn-text' : 'border border-border bg-card'
                    }`}
                  >
                    {isSelected && <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2.5} className="text-btn-text" />}
                  </div>
                </button>
              );
            })}
          </div>
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
            Apply Settings
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
