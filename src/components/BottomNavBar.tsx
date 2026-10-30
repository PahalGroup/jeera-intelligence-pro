import React from 'react';
import { LineChart, CloudRain, Store, Globe2, Sprout } from 'lucide-react';

export type AppTab = 'charts' | 'weather' | 'kirana' | 'portals' | 'agronomy';

interface BottomNavBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'charts' as AppTab,
      label: 'Live Charts',
      shortLabel: 'Charts',
      icon: LineChart,
      badge: '4 Core',
    },
    {
      id: 'weather' as AppTab,
      label: 'Weather Radar',
      shortLabel: 'Weather',
      icon: CloudRain,
      badge: 'El Niño',
    },
    {
      id: 'kirana' as AppTab,
      label: 'Kirana Pulse',
      shortLabel: 'Kirana',
      icon: Store,
      badge: 'Durg Calc',
    },
    {
      id: 'portals' as AppTab,
      label: 'Portals & Trade',
      shortLabel: 'Portals',
      icon: Globe2,
      badge: '18 URLs',
    },
    {
      id: 'agronomy' as AppTab,
      label: 'Agronomy S/D',
      shortLabel: 'Agronomy',
      icon: Sprout,
      badge: '4-Season',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur border-t border-slate-800 shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5 sm:py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative ${
                isActive
                  ? 'text-amber-400 font-bold bg-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {tab.shortLabel}
              </span>
              <span className={`text-[8px] font-normal leading-none px-1 rounded-full ${
                isActive ? 'text-amber-300' : 'text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

