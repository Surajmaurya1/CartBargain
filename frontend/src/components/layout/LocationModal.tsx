import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { useBasket } from '../../context/BasketContext';
import { LOCATIONS_LIST } from '../../data/mockData';
import { LocationDetails } from '../../types';

export function LocationModal() {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation } = useBasket();
  const [pinInput, setPinInput] = useState('');
  const [customLocality, setCustomLocality] = useState('');

  const handleSelectPredefined = (loc: LocationDetails) => {
    setLocation(loc);
    setIsLocationModalOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    const formatted = customLocality.trim()
      ? `${customLocality.trim()}, ${pinInput.trim()}`
      : `Area, ${pinInput.trim()}`;

    setLocation({
      city: customLocality.trim() || 'Custom Locality',
      locality: 'Delivery Area',
      pinCode: pinInput.trim(),
      formatted,
    });
    setIsLocationModalOpen(false);
  };

  return (
    <Dialog
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title="Select Location"
      description="Compare stock and prices for your locality."
      maxWidth="md"
    >
      <div className="space-y-5">
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="PIN code (e.g. 560001)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              leftIcon={<HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} />}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Locality (optional)"
              value={customLocality}
              onChange={(e) => setCustomLocality(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full h-11 font-bold rounded-full"
            disabled={!pinInput.trim()}
          >
            Apply Location
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-3 text-xs text-sub uppercase tracking-wider font-semibold absolute">
            Popular Cities
          </span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {LOCATIONS_LIST.map((loc) => {
            const isSelected = loc.pinCode === location.pinCode;
            return (
              <button
                key={loc.pinCode}
                type="button"
                onClick={() => handleSelectPredefined(loc)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all border text-xs ${
                  isSelected
                    ? 'border-main bg-card-item font-bold text-main'
                    : 'border-border hover:border-sub bg-card-inner text-main'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-status-green" />
                  <div>
                    <span className="text-main font-bold text-sm">
                      {loc.city}
                    </span>
                    <span className="text-sub ml-2 text-xs">
                      ({loc.locality})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sub text-xs">{loc.pinCode}</span>
                  {isSelected && <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={2} className="text-status-green" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
}

