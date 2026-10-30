import React, { useState, useEffect } from 'react';
import type { UnitType } from './utils/units';
import { TopGlobalBar } from './components/TopGlobalBar';
import { BottomNavBar, type AppTab } from './components/BottomNavBar';
import { Tab1LiveCharts } from './components/Tab1LiveCharts';
import { Tab2WeatherRadar } from './components/Tab2WeatherRadar';
import { Tab3KiranaDurg } from './components/Tab3KiranaDurg';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Global Bar (1-Tap Unit Switcher, Shock Alert Banner, Live Status) */}
      <TopGlobalBar
        activeUnit={activeUnit}
        onUnitChange={setActiveUnit}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        lastRefreshed={lastRefreshed}
        alerts={alerts}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'charts' && <Tab1LiveCharts activeUnit={activeUnit} />}
        {activeTab === 'weather' && (
          <Tab2WeatherRadar
            districts={districts}
            isRefreshing={isRefreshing}
            onRefreshWeather={handleRefresh}
          />
        )}
        {activeTab === 'kirana' && <Tab3KiranaDurg activeUnit={activeUnit} />}
        {activeTab === 'portals' && <Tab4PortalsLedger />}
        {activeTab === 'agronomy' && <Tab5AgronomyBalanceSheet activeUnit={activeUnit} />}
      </main>

      {/* Bottom Thumb-Friendly Nav Bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
