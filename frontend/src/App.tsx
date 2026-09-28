import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LocationModal } from './components/layout/LocationModal';
import { OptimizationModal } from './components/optimization/OptimizationModal';
import { HeroSection } from './components/home/HeroSection';
import { FeatureStrip } from './components/home/FeatureStrip';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { AboutSection } from './components/home/AboutSection';
import { ResultsView } from './components/results/ResultsView';
import { useBasket } from './context/BasketContext';
import { AnimatePresence, motion } from 'framer-motion';

export function App() {
  const { currentScreen, setCurrentScreen } = useBasket();
  const [activeNavTab, setActiveNavTab] = useState('Home');

  const handleTabClick = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'Home') {
      setCurrentScreen('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'How It Works') {
      setCurrentScreen('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (tab === 'About') {
      setCurrentScreen('home');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background text-main flex flex-col transition-colors duration-200">
      <Navbar activeTab={activeNavTab} onTabClick={handleTabClick} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeroSection />
              <FeatureStrip />
              <HowItWorksSection />
              <AboutSection />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ResultsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <LocationModal />
      <OptimizationModal />
    </div>
  );
}
