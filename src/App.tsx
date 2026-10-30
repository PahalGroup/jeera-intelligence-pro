import React, { useState, useEffect } from 'react';
import type { UnitType } from './utils/units';
import { TopGlobalBar } from './components/TopGlobalBar';
import { BottomNavBar, type AppTab } from './components/BottomNavBar';
import { Tab1LiveCharts } from './components/Tab1LiveCharts';
import { Tab2WeatherRadar } from './components/Tab2WeatherRadar';
import { Tab4PortalsLedger } from './components/Tab4PortalsLedger';
import { Tab5AgronomyBalanceSheet } from './components/Tab5AgronomyBalanceSheet';
import { refreshAllData, type SuddenShockAlert } from './services/scraper';
import { type DistrictWeather, getFallbackWeatherData } from './services/weatherService';

export const App: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState<UnitType>('maund');
  const [activeTab, setActiveTab] = useState<AppTab>('charts');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [alerts, setAlerts] = useState<SuddenShockAlert[]>([]);
  const [districts, setDistricts] = useState<DistrictWeather[]>(getFallbackWeatherData());

  // Dark & Light Mode state with persistence in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jeera_theme');
    if (saved) return saved === 'dark';
    return true; // default dark mode
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jeera_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jeera_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Load live data on startup
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const state = await refreshAllData();
      setAlerts(state.alerts);
      setDistricts(state.weatherDistricts);
      setLastRefreshed(state.lastRefreshed);
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Global Bar (1-Tap Unit Switcher, Theme Switcher, Shock Alert Banner, Live Status) */}
      <TopGlobalBar
        activeUnit={activeUnit}
        onUnitChange={setActiveUnit}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        lastRefreshed={lastRefreshed}
        alerts={alerts}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area: 4 High-Value Intelligence Tabs */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activeTab === 'charts' && (
          <Tab1LiveCharts activeUnit={activeUnit} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'weather' && (
          <Tab2WeatherRadar
            districts={districts}
            isRefreshing={isRefreshing}
            onRefreshWeather={handleRefresh}
          />
        )}
        {activeTab === 'portals' && <Tab4PortalsLedger />}
        {activeTab === 'agronomy' && (
          <Tab5AgronomyBalanceSheet activeUnit={activeUnit} />
        )}
      </main>

      {/* Bottom Thumb-Friendly Nav Bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
