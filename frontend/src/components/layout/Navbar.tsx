import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasket } from '../../context/BasketContext';
import { useTheme } from '../../context/ThemeContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Location01Icon,
  ArrowDown01Icon,
  Sun01Icon,
  Moon01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

interface NavbarProps {
  activeTab?: string;
  onTabClick?: (tab: string) => void;
}

export function Navbar({ activeTab = 'Home', onTabClick }: NavbarProps) {
  const { currentScreen, setCurrentScreen, location, setIsLocationModalOpen } = useBasket();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setIsMobileMenuOpen(false);
    if (tab === 'Home') {
      setCurrentScreen('home');
    }
    if (onTabClick) onTabClick(tab);
  };

  const navItems = [
    { id: 'Home', label: 'Home' },
    { id: 'How It Works', label: 'How It Works' },
    { id: 'About', label: 'About' },
  ];

  return (
    <div className="sticky top-3 sm:top-4 z-40 w-full px-3.5 sm:px-6 pb-2.5 sm:pb-3.5 pointer-events-none">
      <header className="max-w-5xl mx-auto bg-card/75 dark:bg-card/70 backdrop-blur-2xl backdrop-saturate-150 border border-border/80 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-elevated dark:shadow-elevated pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 transition-all duration-200">
        {/* Left: Brand + Desktop Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <motion.button
            onClick={() => {
              setCurrentScreen('home');
              setIsMobileMenuOpen(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center text-left focus-visible:outline-none rounded-full"
            aria-label="CartBargain Home"
          >
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-main">
              CartBargain
            </span>
          </motion.button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-3" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isSelected =
                (item.id === 'Home' && currentScreen === 'home') ||
                activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs sm:text-sm font-medium transition-colors duration-150 py-1.5 px-3 rounded-full ${
                    isSelected
                      ? 'text-main font-semibold bg-hover'
                      : 'text-sub hover:text-main hover:bg-hover/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Desktop: Location + Theme Toggle */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Location Selector */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-elevated/70 border border-border/80 hover:bg-hover hover:border-muted text-xs sm:text-sm font-medium text-main transition-all duration-150"
            title="Change Location"
          >
            <HugeiconsIcon icon={Location01Icon} size={15} strokeWidth={1.5} className="text-status-green shrink-0" />
            <span className="max-w-[150px] truncate">
              {location.formatted || `${location.city}, ${location.pinCode}`}
            </span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.5} className="text-muted shrink-0" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-elevated/70 border border-border/80 hover:bg-hover hover:border-muted text-sub hover:text-main transition-all duration-150"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <HugeiconsIcon icon={Moon01Icon} size={16} strokeWidth={1.5} />
            ) : (
              <HugeiconsIcon icon={Sun01Icon} size={16} strokeWidth={1.5} className="text-btn-bg" />
            )}
          </button>
        </div>

        {/* Right Mobile: Quick Location / Theme / Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {/* Mobile Theme Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-elevated/70 border border-border/80 text-sub hover:text-main transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <HugeiconsIcon icon={Moon01Icon} size={15} strokeWidth={1.5} />
            ) : (
              <HugeiconsIcon icon={Sun01Icon} size={15} strokeWidth={1.5} className="text-btn-bg" />
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-elevated/70 border border-border/80 text-main transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} className="text-main" />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} size={16} strokeWidth={1.5} className="text-main" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="max-w-5xl mx-auto mt-2 rounded-[24px] bg-card/95 backdrop-blur-2xl border border-border/90 p-5 shadow-2xl space-y-4 pointer-events-auto"
          >
            {/* Delivery Location Row */}
            <div className="p-3.5 rounded-2xl bg-card-inner border border-border">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center border border-border shrink-0">
                    <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} className="text-status-green" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-sub">Delivery Location</div>
                    <div className="text-xs font-bold text-main truncate">
                      {location.formatted || `${location.city}, ${location.pinCode}`}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-main hover:bg-hover shrink-0"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-1" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const isSelected =
                  (item.id === 'Home' && currentScreen === 'home') ||
                  activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'bg-hover text-main font-bold'
                        : 'text-sub hover:text-main hover:bg-hover/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} className="text-main" />}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}