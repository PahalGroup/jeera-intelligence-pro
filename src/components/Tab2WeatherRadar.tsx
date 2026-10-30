import React, { useState } from 'react';
import type { DistrictWeather } from '../services/weatherService';
import { EL_NINO_TELEMETRY } from '../services/weatherService';
import {
  CloudSun,
  CloudRain,
  Thermometer,
  Droplets,
  AlertTriangle,
  Flame,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface Tab2WeatherRadarProps {
  districts: DistrictWeather[];
  isRefreshing: boolean;
  onRefreshWeather: () => void;
}

export const Tab2WeatherRadar: React.FC<Tab2WeatherRadarProps> = ({
  districts,
  isRefreshing,
  onRefreshWeather,
}) => {
  const [filterRegion, setFilterRegion] = useState<'ALL' | 'Gujarat' | 'Rajasthan' | 'Xinjiang (China)'>('ALL');

  const filteredDistricts = districts.filter((d) => {
    if (filterRegion === 'ALL') return true;
    return d.state === filterRegion;
  });

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 sm:px-4 pt-3">
      {/* 1. Super El Niño Tracker Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  2026 Super El Niño & Reservoir Water Deficit Tracker
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Critical Alert
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pacific Equatorial SST: <strong className="text-rose-400">{EL_NINO_TELEMETRY.pacificSST}°C</strong> | WMO Peak Anomaly: <strong className="text-rose-400">+{EL_NINO_TELEMETRY.wmoAnomalyC}°C</strong>
              </p>
            </div>
          </div>

          <a
            href="https://cdnbbsr.s3waas.gov.in/s3a70dc40477bc2adceef4d2c90f47eb82/uploads/2026/10/20261016552212653.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold self-start sm:self-auto transition"
          >
            <span>CWC Reservoir Bulletin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pacific SST</span>
            <div className="text-base sm:text-lg font-black text-rose-400">30.06°C</div>
            <span className="text-[10px] text-slate-400">Normal is 27.5°C (+2.5°C anomaly)</span>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">WMO Dec 2026 Peak</span>
            <div className="text-base sm:text-lg font-black text-amber-400">+3.7°C</div>
            <span className="text-[10px] text-slate-400">Super El Niño classification</span>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">CWC 150 Dams Storage</span>
            <div className="text-base sm:text-lg font-black text-sky-400">132.734 BCM</div>
            <span className="text-[10px] text-rose-400 font-bold">-20.45% YoY storage deficit</span>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">2026 Monsoon Rain</span>
            <div className="text-base sm:text-lg font-black text-amber-400">87.4% LPA</div>
            <span className="text-[10px] text-slate-400">Below normal (IMD report)</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <strong className="text-white">Agronomic Impact:</strong> Lower reservoir levels reduce winter tube-well recharge across Rajasthan (Barmer, Jalore, Nagaur). If El Niño keeps December–January night temperatures above <strong className="text-rose-300">20°C</strong>, flowering umbels will not set seeds properly, causing severe yield penalties.
        </p>
      </section>

      {/* 2. The 45-Day Danger Window (Feb 1 – Mar 20) Override Card */}
      <section className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white">
                The 45-Day Danger Window (Feb 1 – Mar 20)
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                Where Pure AI Fails by 18%
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Standard time-series or AI prediction models fail completely during this 45-day seed-filling window. Even with 100% record acreage, cumin yields can drop <strong className="text-white">20% to 35% in just 72 hours</strong> if any of these 3 weather triggers strike:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                  <CloudRain className="w-4 h-4" />
                  <span>Unseasonal Rain (&gt; 2 mm)</span>
                </div>
                <p className="text-slate-400">
                  Washes off pollen during flowering and permanently blackens the seed tip (*Kalio*).
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                  <Droplets className="w-4 h-4" />
                  <span>Humidity &gt; 75% (Black Blight)</span>
                </div>
                <p className="text-slate-400">
                  Overcast skies + warm humidity spark rapid *Alternaria burnsii* fungal epidemic.
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span>Night Temps &gt; 20°C (El Niño)</span>
                </div>
                <p className="text-slate-400">
                  Jeera requires cold nights (9°C–20°C). Premature heat aborts grain filling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Open-Meteo District Weather Grid */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                Live Open-Meteo Weather Feed (Gujarat, Rajasthan & Xinjiang China)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live district temperature, rain sum, and humidity telemetry from Open-Meteo JSON API
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Region Filters */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['ALL', 'Gujarat', 'Rajasthan', 'Xinjiang (China)'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(r)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                    filterRegion === r
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'Xinjiang (China)' ? 'China' : r}
                </button>
              ))}
            </div>

            <button
              onClick={onRefreshWeather}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh Open-Meteo JSON"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* District Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDistricts.map((d) => (
            <div
              key={d.id}
              className={`rounded-xl p-3.5 border transition-all ${
                d.statusColor === 'red'
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : d.statusColor === 'yellow'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white text-sm">{d.name}</h4>
                    <span className="text-[10px] text-slate-400">({d.state})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {d.lat.toFixed(2)}°N, {d.lng.toFixed(2)}°E
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    d.statusColor === 'red'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : d.statusColor === 'yellow'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {d.statusBadge}
                </span>
              </div>

              {/* Weather Stats Row */}
              <div className="grid grid-cols-3 gap-1.5 my-2.5 bg-slate-900/90 rounded-lg p-2 border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-semibold">Current</span>
                  <span className="font-bold text-amber-300 text-sm">{d.tempCurrentC}°C</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-semibold">Min / Max</span>
                  <span className="font-semibold text-slate-200">
                    {d.tempMinC}° / {d.tempMaxC}°
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-semibold">Rain / RH</span>
                  <span className="font-semibold text-sky-400">
                    {d.rainMm}mm / {d.humidityPct}%
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                <strong className="text-slate-300">Agronomy:</strong> {d.agronomicNote}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
