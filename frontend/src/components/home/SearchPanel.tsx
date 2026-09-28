import React, { useState, useEffect } from 'react';
import { useBasket } from '../../context/BasketContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Location01Icon,
  ShoppingCart01Icon,
  Search01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  Store01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { ProviderId, SearchEngineType } from '../../types';
import { ThinkingOrb } from 'thinking-orbs';

export function SearchPanel() {
  const {
    rawSearchInput,
    setRawSearchInput,
    location,
    searchEngine,
    setSearchEngine,
    selectedProviders,
    toggleProvider,
    handleSearchSubmit,
    isLoadingSearch,
    setIsLocationModalOpen,
    setLocation,
  } = useBasket();

  const [inputVal, setInputVal] = useState(rawSearchInput);
  const [pinVal, setPinVal] = useState(location.pinCode);

  useEffect(() => {
    setInputVal(rawSearchInput);
  }, [rawSearchInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setRawSearchInput(e.target.value);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPinVal(val);
    if (val.length === 6) setLocation({ ...location, pinCode: val, formatted: `${location.city}, ${val}` });
  };

  const addQuickItem = (itemName: string) => {
    const current = inputVal.trim();
    if (!current) {
      setInputVal(itemName);
      setRawSearchInput(itemName);
    } else if (!current.toLowerCase().includes(itemName.toLowerCase())) {
      const newText = `${current}, ${itemName}`;
      setInputVal(newText);
      setRawSearchInput(newText);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(inputVal);
  };

  const engineOptions = [
    { value: 'google_shopping', label: 'Google Shopping' },
    { value: 'quick_aggregator', label: 'Quick Aggregator' },
    { value: 'serp_direct', label: 'SerpApi Direct' },
  ];

  const providerOptions: { id: ProviderId; name: string }[] = [
    { id: 'blinkit', name: 'Blinkit' },
    { id: 'zepto', name: 'Zepto' },
    { id: 'instamart', name: 'Instamart' },
  ];

  const popularSuggestions = ['Atta 5kg', 'Rice 2kg', 'Milk 1L', 'Eggs 12', 'Bread 1 pc', 'Butter 500g', 'Oil 1L'];

  return (
    <div className="w-full bg-card rounded-[32px] border border-border p-6 sm:p-8 shadow-xl transition-all space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Row 1: Location & PIN */}
        <div>
          <label className="text-sm font-bold text-main flex items-center gap-2 mb-2.5">
            <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-sub" />
            Delivery Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center justify-between px-5 py-3 h-12 rounded-2xl border border-border bg-background hover:bg-hover/40 text-sm text-main transition-colors text-left font-medium"
            >
              <div className="flex items-center gap-2 truncate">
                <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-status-green shrink-0" />
                <span className="truncate">{location.formatted || `${location.city}, ${location.pinCode}`}</span>
              </div>
              <span className="text-xs text-sub shrink-0">Change</span>
            </button>

            <Input
              type="text"
              placeholder="Enter PIN code (e.g. 560001)"
              value={pinVal}
              onChange={handlePinChange}
              maxLength={6}
              leftIcon={<HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} />}
              className="h-12"
            />
          </div>
        </div>

        {/* Row 2: What do you need? */}
        <div>
          <label className="text-sm font-bold text-main flex items-center gap-2 mb-2.5">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={16} strokeWidth={1.5} className="text-sub" />
            What do you need?
          </label>
          <Input
            type="text"
            placeholder="e.g. atta 5kg, rice 2kg, milk 1L, eggs 12, bread"
            value={inputVal}
            onChange={handleInputChange}
            className="h-12"
          />

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-sub">
            <span className="font-semibold text-sub shrink-0">Popular:</span>
            {popularSuggestions.map((suggest) => (
              <button
                key={suggest}
                type="button"
                onClick={() => addQuickItem(suggest)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border hover:bg-hover hover:border-sub/40 text-main text-xs font-medium transition-all"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={12} strokeWidth={2} className="text-sub" />
                {suggest}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Search Engine & Providers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-sm font-bold text-main flex items-center gap-2 mb-2.5">
              <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} className="text-sub" />
              Search Source
            </label>
            <Select
              options={engineOptions}
              value={searchEngine}
              onChange={(v) => setSearchEngine(v as SearchEngineType)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-main flex items-center gap-2 mb-2.5">
              <HugeiconsIcon icon={Store01Icon} size={16} strokeWidth={1.5} className="text-sub" />
              Stores to Compare
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {providerOptions.map((provider) => {
                const isSelected = selectedProviders.includes(provider.id);
                const brandColors: Record<ProviderId, string> = {
                  blinkit: '#EAB308',
                  zepto: '#A855F7',
                  instamart: '#F97316',
                  bbnow: '#14B8A6',
                };
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => toggleProvider(provider.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-btn-bg text-btn-text border-btn-bg shadow-sm'
                        : 'bg-elevated text-sub border-border hover:border-muted hover:bg-hover'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: brandColors[provider.id] }}
                    />
                    {provider.name}
                    {isSelected && <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2.5} className="text-btn-text ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search CTA Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm font-extrabold h-12 rounded-full"
            disabled={isLoadingSearch}
            rightIcon={!isLoadingSearch ? <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} className="text-btn-text" /> : undefined}
          >
            {isLoadingSearch ? (
              <span className="inline-flex items-center gap-2.5">
                <ThinkingOrb state="searching" size={20} theme="dark" aria-hidden="true" />
                <span>Comparing Stores…</span>
              </span>
            ) : (
              'Search & Compare Prices'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
