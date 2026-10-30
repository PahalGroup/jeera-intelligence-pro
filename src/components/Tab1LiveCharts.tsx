import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { type UnitType, convertFromKg, formatPriceByUnit, CROP_UNITS } from '../utils/units';
import {
  DAILY_ARRIVALS_SERIES,
  GLOBAL_FOB_SPREAD_SERIES,
  STOCK_BURN_TRAJECTORY_SERIES,
  NCDEX_OI_TRUTH_SERIES,
  type NcdexOiPoint,
} from '../data/jeeraVerifiedData';
import { Zap, TrendingUp } from 'lucide-react';

interface Tab1LiveChartsProps {
  activeUnit: UnitType;
}

export const Tab1LiveCharts: React.FC<Tab1LiveChartsProps> = ({ activeUnit }) => {
  const [selectedOiPoint, setSelectedOiPoint] = useState<NcdexOiPoint>(
    NCDEX_OI_TRUTH_SERIES[NCDEX_OI_TRUTH_SERIES.length - 1]
  );

  // Transform arrivals data with active unit price conversions
  const arrivalChartData = DAILY_ARRIVALS_SERIES.map((d) => ({
    date: d.date.slice(5), // '08-01'
    fullDate: d.date,
    unjhaBags: d.unjhaBags,
    rajasthanBags: d.rajasthanBags,
    totalArrivalBags: d.totalArrivalBags,
    spotPrice: Math.round(convertFromKg(d.spotPriceRsKg, activeUnit)),
    ncdexPrice: Math.round(convertFromKg(d.ncdexPriceRsKg, activeUnit)),
    holdingFloor: Math.round(convertFromKg(d.holdingFloorRsKg, activeUnit)),
    commentary: d.commentary,
  }));

  // Transform FOB data
  const fobChartData = GLOBAL_FOB_SPREAD_SERIES.map((d) => ({
    month: d.month,
    india: d.indiaFobUSD,
    china: d.chinaFobUSD,
    syria: d.syriaFobUSD,
    turkey: d.turkeyFobUSD,
    discountVsChina: d.indiaDiscountVsChinaUSD,
  }));

  // Transform OI data
  const oiChartData = NCDEX_OI_TRUTH_SERIES.map((d) => ({
    date: d.date.slice(5),
    fullDate: d.date,
    price: Math.round(convertFromKg(d.priceRsKg, activeUnit)),
    oiContracts: d.openInterestContracts,
    oiChangePct: d.oiChangePct,
    signal: d.signal,
    rawPoint: d,
  }));

  const activeUnitConfig = CROP_UNITS[activeUnit];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 sm:px-4 pt-3">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-3.5 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Tab 1: 4 Core Live Interactive Charts & Truth Detectors
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Every chart is normalized to your active unit (
          <span className="text-amber-400 font-semibold">{activeUnitConfig.shortLabel}</span>) and is accompanied by a dynamic{' '}
          <span className="text-amber-300 font-medium">"Explain Like I'm 10"</span> interpretation card based on physical mandi realities.
        </p>
      </div>

      {/* ---------------- CHART 1: ARRIVALS VS SPOT & FUTURES ---------------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Line Chart 1: Unjha & Rajasthan Daily Arrivals vs. Spot & NCDEX Futures
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-Axis: Bars = Bags/Day (55 kg) | Lines = Price in {activeUnitConfig.shortLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[11px]">
              Farmer Floor: {formatPriceByUnit(205, activeUnit)}
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={arrivalChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                stroke="#f59e0b"
                tick={{ fontSize: 11, fill: '#f59e0b' }}
                domain={[0, 28000]}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k bags`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#38bdf8"
                tick={{ fontSize: 11, fill: '#38bdf8' }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any, name: any) => {
                  if (name === 'Unjha Arrivals') return [`${value.toLocaleString()} Bags`, name];
                  if (name === 'Rajasthan Arrivals') return [`${value.toLocaleString()} Bags`, name];
                  return [`${formatPriceByUnit(activeUnit === 'usd_mt' ? (Number(value) * 84) / 1000 : (Number(value) / activeUnitConfig.kgMultiplier), activeUnit)}`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar yAxisId="left" dataKey="unjhaBags" name="Unjha Arrivals" stackId="a" fill="#d97706" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="rajasthanBags" name="Rajasthan Arrivals" stackId="a" fill="#b45309" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="spotPrice"
                name={`Spot Price (${activeUnitConfig.shortLabel})`}
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38bdf8' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ncdexPrice"
                name={`NCDEX Futures (${activeUnitConfig.shortLabel})`}
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#a855f7' }}
              />
              <ReferenceLine
                yAxisId="right"
                y={arrivalChartData[0]?.holdingFloor}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'Farmer Holding Floor', fill: '#ef4444', fontSize: 10, position: 'top' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Explain Like I'm 10 Interpretation Card */}
        <div className="mt-4 bg-slate-950/90 rounded-xl p-3.5 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-300">
              Explain Like I'm 10: What is this chart doing right now?
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Look at how the amber bars (daily truck arrivals) suddenly shrank from{' '}
            <strong className="text-white">24,000 bags/day in August</strong> down to just{' '}
            <strong className="text-white">5,050 bags/day in late October</strong>. When prices dropped close to the red dotted line (₹200–₹215/kg), farmers in Saurashtra and Barmer locked their godowns and refused to bring cumin to the mandi. Because spice grinders still needed cumin every day, the buyers had to raise their bids, sending spot prices rebounding from ₹180 back to{' '}
            <strong className="text-amber-400">₹250/kg ({formatPriceByUnit(250, activeUnit)})</strong>!
          </p>
        </div>
      </section>

      {/* ---------------- CHART 2: GLOBAL FOB SPREAD ---------------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Line Chart 2: Global Competitor FOB Export Prices ($/MT — India vs. China, Syria, Turkey)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              FOB Benchmark at Mundra Port vs. Competitor Ports (2023 to Oct 2026)
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            India Discount: $750/MT Cheaper than China!
          </span>
        </div>

        <div className="h-72 sm:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fobChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[1500, 7500]} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: any, name: any) => [`$${Number(v).toLocaleString()}/MT`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="india" name="🇮🇳 India (Mundra Port)" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="china" name="🇨🇳 China (Xinjiang)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="syria" name="🇸🇾 Syria" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
              <Line type="monotone" dataKey="turkey" name="🇹🇷 Turkey" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Explain Like I'm 10 Interpretation Card */}
        <div className="mt-4 bg-slate-950/90 rounded-xl p-3.5 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300">
              Explain Like I'm 10: How did the global table turn in India's favor?
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In 2024, China (red line) grew huge amounts of cumin in cotton fields and sold it super cheap at $2,100/MT, taking away India's foreign customers. But in summer 2026, severe frost and scorching heat ruined 40% of China's crops! Now China is forced to sell at{' '}
            <strong className="text-white">$3,175/MT</strong>. Meanwhile, India (green line) is selling at{' '}
            <strong className="text-emerald-400">$2,425/MT</strong>. Because India is{' '}
            <strong className="text-white">$750/MT cheaper</strong>, big spice buyers from the USA, Bangladesh, UAE, and Europe have canceled China orders and are buying hundreds of containers from Indian ports!
          </p>
        </div>
      </section>

      {/* ---------------- CHART 3: STOCK BURN & CARRYOVER ---------------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Line Chart 3: 4-Season Stock Burn & Carryover Trajectory (55 kg Lakh Bags)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks the off-season monthly burn (-7L bags/month) down to Feb 15 True Carryover
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            Oct 2026 Unsold: 48.0L Bags
          </span>
        </div>

        <div className="h-72 sm:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={STOCK_BURN_TRAJECTORY_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 130]} tickFormatter={(v) => `${v}L`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: any, name: any) => [`${v} Lakh Bags (${((Number(v) * 5500) / 1000).toLocaleString()} MT)`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="season2324" name="2023–24 (Historic 4.5L Squeeze)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="season2425" name="2024–25 (Post-110L Flood)" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="season2526" name="2025–26 (90L Harvest Rebound)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="season2627" name="2026–27 (Current Active)" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 3" dot={{ r: 4 }} />
              <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Bull Run Squeeze (<8L)', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={20} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Adequate Carryover (~20L)', fill: '#22c55e', fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Explain Like I'm 10 Interpretation Card */}
        <div className="mt-4 bg-slate-950/90 rounded-xl p-3.5 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-blue-300">
              Explain Like I'm 10: The Winter Wedding & Ramadan Burn
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every winter from November to February, India burns roughly{' '}
            <strong className="text-white">7 lakh bags of cumin every month</strong> (4.2L domestic wedding curries + 2.8L export Ramadan stocking). That means between now (October stock: 48L bags) and February 15, we will burn 28L bags. This leaves a projected{' '}
            <strong className="text-blue-400">carryover of 20 lakh bags</strong> when the new crop arrives. In 2023 (red line), carryover dropped to just 4.5 lakh bags, causing the famous spike to ₹622. With 20 lakh bags today, we have plenty of safety cushion unless the Super El Niño damages the standing crop!
          </p>
        </div>
      </section>

      {/* ---------------- CHART 4: NCDEX FUTURES VS OPEN INTEREST ---------------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Line Chart 4: NCDEX Futures Price vs. Open Interest (OI) Truth Detector
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any date point to inspect institutional positioning & commodity matrix signal
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            Oct 30: Short Covering Reversal (+1.57% Price / -3.25% OI)
          </span>
        </div>

        <div className="h-72 sm:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={oiChartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onClick={(e: any) => {
                const payload = e as any;
                if (payload && payload.activePayload && payload.activePayload[0]) {
                  setSelectedOiPoint(payload.activePayload[0].payload.rawPoint);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="price"
                stroke="#a855f7"
                tick={{ fontSize: 11, fill: '#a855f7' }}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                yAxisId="oi"
                orientation="right"
                stroke="#38bdf8"
                tick={{ fontSize: 11, fill: '#38bdf8' }}
                domain={[6000, 7200]}
                tickFormatter={(v) => `${v} c`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any, name: any) => {
                  if (name === 'Open Interest (Contracts)') return [`${Number(value).toLocaleString()} Contracts`, name];
                  return [formatPriceByUnit(activeUnit === 'usd_mt' ? (Number(value) * 84) / 1000 : (Number(value) / activeUnitConfig.kgMultiplier), activeUnit), name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar yAxisId="oi" dataKey="oiContracts" name="Open Interest (Contracts)" fill="#0284c7" opacity={0.4} radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                name={`NCDEX Futures Price (${activeUnitConfig.shortLabel})`}
                stroke="#c084fc"
                strokeWidth={3}
                dot={{ r: 5, fill: '#c084fc' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Point Signal Details */}
        {selectedOiPoint && (
          <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-400">Selected Date:</span>{' '}
              <strong className="text-white">{selectedOiPoint.date}</strong> |{' '}
              <span className="text-slate-400">Price:</span>{' '}
              <strong className="text-amber-400">{formatPriceByUnit(selectedOiPoint.priceRsKg, activeUnit)}</strong> |{' '}
              <span className="text-slate-400">OI:</span>{' '}
              <strong className="text-sky-400">{selectedOiPoint.openInterestContracts} contracts</strong> ({selectedOiPoint.oiChangePct > 0 ? '+' : ''}{selectedOiPoint.oiChangePct}%)
            </div>
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
              selectedOiPoint.signalBadgeColor === 'green' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
              selectedOiPoint.signalBadgeColor === 'blue' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
              selectedOiPoint.signalBadgeColor === 'red' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
              'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {selectedOiPoint.signal}
            </span>
          </div>
        )}

        {/* Explain Like I'm 10 Interpretation Card */}
        <div className="mt-4 bg-slate-950/90 rounded-xl p-3.5 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-purple-300">
              Explain Like I'm 10: The NCDEX Open Interest Truth Detector
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Open Interest measures how many live bets are active on the futures exchange. When prices jump UP (purple line rising from ₹22,050 to ₹25,800) but Open Interest goes DOWN (blue bars shrinking from 6,850 to 6,252), it means the big players who were short-selling (betting prices would drop) were proven wrong. They got frightened and bought back their positions at a loss to exit the trade! This{' '}
            <strong className="text-purple-300">"Short Covering"</strong> creates a very strong price floor and confirms a bottom reversal.
          </p>
        </div>
      </section>
    </div>
  );
};
