import React, { useState } from 'react';
import { type UnitType, CROP_UNITS } from '../utils/units';
import type { SuddenShockAlert } from '../services/scraper';
import { RefreshCw, AlertTriangle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';

interface TopGlobalBarProps {
  activeUnit: UnitType;
  onUnitChange: (unit: UnitType) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastRefreshed: string;
  alerts: SuddenShockAlert[];
}

export const TopGlobalBar: React.FC<TopGlobalBarProps> = ({
  activeUnit,
  onUnitChange,
  isRefreshing,
  onRefresh,
  lastRefreshed,
  alerts,
}) => {
  const [activeAlertIdx, setActiveAlertIdx] = useState(0);
  const [isAlertExpanded, setIsAlertExpanded] = useState(false);

  const currentAlert = alerts[activeAlertIdx] || alerts[0];

  const getSeverityBadge = (severity: SuddenShockAlert['severity']) => {
    switch (severity) {
      case 'GREEN':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'RED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'AMBER':
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  const getSeverityIcon = (severity: SuddenShockAlert['severity']) => {
    switch (severity) {
      case 'GREEN':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'RED':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'AMBER':
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
      {/* 1. Main Header Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <span className="text-xl">🌿</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Jeera Intelligence Pro
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                HS 090931
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Unjha APMC Live
              </span>
              <span>•</span>
              <span className="hidden sm:inline">Synced {lastRefreshed}</span>
              <span className="sm:hidden">{lastRefreshed}</span>
            </div>
          </div>
        </div>

        {/* Live Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-medium text-slate-200 border border-slate-700 transition shadow-sm disabled:opacity-50 shrink-0"
          title="Fetch latest weather and arrivals from all 18 official endpoints"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Refreshing 18 Portals...' : 'Refresh All'}</span>
          <span className="sm:hidden">{isRefreshing ? '...' : 'Sync'}</span>
        </button>
      </div>

      {/* 2. 1-Tap Unit Switcher Strip (Always Visible & Thumb-Friendly) */}
      <div className="bg-slate-950/80 px-2 sm:px-4 py-1.5 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Active Unit:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
            {(Object.keys(CROP_UNITS) as UnitType[]).map((unitKey) => {
              const u = CROP_UNITS[unitKey];
              const isSelected = activeUnit === unitKey;
              return (
                <button
                  key={unitKey}
                  onClick={() => onUnitChange(unitKey)}
                  className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-150 flex flex-col sm:flex-row items-center gap-0 sm:gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span>{u.shortLabel}</span>
                  <span className={`text-[9px] opacity-75 font-normal ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                    ({u.id === 'maund' ? '20kg' : u.id === 'bag' ? '55kg' : u.id === 'quintal' ? '100kg' : u.id === 'kg' ? '1kg' : 'FOB'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Instant Sudden-Shock Alert Banner */}
      {currentAlert && (
        <div className={`px-3 sm:px-4 py-2 border-t text-xs transition-colors duration-200 ${
          currentAlert.severity === 'GREEN' ? 'bg-emerald-950/50 border-emerald-900/60' :
          currentAlert.severity === 'RED' ? 'bg-rose-950/50 border-rose-900/60' : 'bg-amber-950/50 border-amber-900/60'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <div className="mt-0.5">{getSeverityIcon(currentAlert.severity)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded uppercase border ${getSeverityBadge(currentAlert.severity)}`}>
                      {currentAlert.badgeText}
                    </span>
                    <span className="text-[11px] text-slate-400">{currentAlert.timestamp}</span>
                    <div className="flex items-center gap-1 ml-auto sm:ml-0 text-[10px] text-slate-400">
                      <span>Alert {activeAlertIdx + 1}/{alerts.length}</span>
                      <button
                        onClick={() => setActiveAlertIdx((prev) => (prev + 1) % alerts.length)}
                        className="text-amber-400 hover:text-amber-300 underline font-semibold ml-1"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>
                  
                  <p className="font-semibold text-slate-100 text-xs sm:text-sm mt-0.5 leading-snug">
                    {currentAlert.headline}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAlertExpanded(!isAlertExpanded)}
                className="p-1 rounded text-slate-400 hover:text-white shrink-0 mt-0.5"
                title={isAlertExpanded ? 'Collapse explanation' : 'Explain Like I\'m 10'}
              >
                {isAlertExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Expandable "Explain Like I'm 10" Card */}
            {isAlertExpanded && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Explain Like I'm 10 (Simple English):</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentAlert.plainEnglish10Yo}
                  </p>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
                    <span>Technical & Commodity Desk Rationale:</span>
                    <a
                      href={currentAlert.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>{currentAlert.sourcePortal}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                    {currentAlert.technicalDetails}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
