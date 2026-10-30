import React from 'react';
import { type UnitType, formatPriceByUnit, CROP_UNITS } from '../utils/units';
import {
  FOUR_SEASON_BALANCE_SHEETS,
  GLOBAL_COMPETITORS,
  GUJARAT_VS_RAJASTHAN_AGRONOMY,
} from '../data/jeeraVerifiedData';
import { Sprout, Scale, Layers } from 'lucide-react';

interface Tab5AgronomyBalanceSheetProps {
  activeUnit: UnitType;
}

export const Tab5AgronomyBalanceSheet: React.FC<Tab5AgronomyBalanceSheetProps> = ({ activeUnit }) => {
  const activeUnitConfig = CROP_UNITS[activeUnit];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 sm:px-4 pt-3">
      {/* 1. Header Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Tab 4: Agronomy, Regional Yield Gap & 4-Season Master Balance Sheet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic balance sheet modeling, off-season burn subtraction, and physical ground agronomy audits
            </p>
          </div>
        </div>

        {/* Master Equation Pill */}
        <div className="mt-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-amber-700 dark:text-amber-400 font-bold uppercase mr-1">Master Equation:</span>
            <span>Ending Carryover = (Feb 15 True Carryover + New Harvest) - (Domestic Consumption + Exports)</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap font-bold">
            Monthly Burn: ~7.0L bags/mo
          </span>
        </div>
      </section>

      {/* 2. 4-Season Supply-Demand & Stock Burn Balance Sheet */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              4-Season Supply-Demand Ledger (2023–24 to 2026–27)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All quantities in 55 kg Lakh Bags and equivalent Metric Tonnes (1 MT = 18.18 Bags; 1 Lakh Bags = 5,500 MT)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Season</th>
                <th className="py-2.5 px-3 text-right">Pre-Sowing Stock (Oct)</th>
                <th className="py-2.5 px-3 text-right">Winter Burn (Nov–Feb)</th>
                <th className="py-2.5 px-3 text-right">Feb 15 Carryover</th>
                <th className="py-2.5 px-3 text-right">New Crop Harvest</th>
                <th className="py-2.5 px-3 text-right">Total Supply</th>
                <th className="py-2.5 px-3 text-right">Annual Exports</th>
                <th className="py-2.5 px-3 text-right">Price Range ({activeUnitConfig.shortLabel})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
              {FOUR_SEASON_BALANCE_SHEETS.map((s) => (
                <tr key={s.season} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${s.season.includes('Active') ? 'bg-amber-50/50 dark:bg-amber-950/20 font-semibold' : ''}`}>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {s.season}
                    {s.season.includes('Active') && (
                      <span className="ml-1.5 px-1.5 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold">
                        NOW
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {s.preSowingStockLakhBags}L <span className="text-[10px] text-slate-400 dark:text-slate-500 block">({s.preSowingStockMT.toLocaleString()} MT)</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600 dark:text-rose-400 font-bold">
                    -{s.winterBurnLakhBags}L
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-700 dark:text-sky-400">
                    {s.trueCarryoverFeb15LakhBags}L <span className="text-[10px] text-slate-400 dark:text-slate-500 block">({s.trueCarryoverFeb15MT.toLocaleString()} MT)</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    +{s.newHarvestLakhBags}L <span className="text-[10px] text-slate-400 dark:text-slate-500 block">({s.newHarvestMT.toLocaleString()} MT)</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white font-black">
                    {s.totalSupplyLakhBags}L
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700 dark:text-amber-300">
                    {s.annualExportsLakhBags}L <span className="text-[10px] text-slate-400 dark:text-slate-500 block">({s.annualExportsMT.toLocaleString()} MT)</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap font-medium">
                    {formatPriceByUnit(s.priceLowRsKg, activeUnit, { showUnit: false })} – {formatPriceByUnit(s.priceHighRsKg, activeUnit, { showUnit: false })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Season Narratives Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {FOUR_SEASON_BALANCE_SHEETS.map((s) => (
            <div key={s.season} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                {s.season} Dynamics & Outcome:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {s.keyEvents}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Global Competitor Production & FOB Parity Matrix */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Global Competitors Production & Late Oct 2026 FOB Parity ($/MT)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark 99% Singapore Grade at major global export ports
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            India Dominates with 70% Share
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOBAL_COMPETITORS.map((c) => (
            <div
              key={c.origin}
              className={`p-3.5 rounded-xl border transition-all ${
                c.origin.includes('India')
                  ? 'bg-emerald-50/50 dark:bg-slate-950 border-emerald-300 dark:border-emerald-500/60 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    <span className="mr-1.5">{c.flag}</span>
                    {c.origin}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                    Harvest: {c.harvestWindow} &bull; Share: {c.marketShareGlobal}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 font-mono block">
                    {c.fobPriceRangeUSD}
                  </span>
                  {c.spreadVsIndiaUSD > 0 && (
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1 rounded">
                      +${c.spreadVsIndiaUSD}/MT vs India
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/90 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-300 font-mono mb-2 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">2026 Output:</span>
                <span className="font-bold text-sky-700 dark:text-sky-400">{c.crop2026MT}</span> ({c.crop2026LakhBags})
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {c.keyDrivers}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Gujarat vs. Rajasthan Agronomy & Yield Divide */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              The Gujarat vs. Rajasthan Agronomic & Yield Divide
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Why Gujarat yields 2.2x more bags per hectare than Rajasthan despite Rajasthan holding 65% of national acreage
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Agronomic Parameter</th>
                <th className="py-2.5 px-3">Gujarat Belt (Unjha / Banaskantha)</th>
                <th className="py-2.5 px-3">Rajasthan Belt (Barmer / Jodhpur)</th>
                <th className="py-2.5 px-3">Yield & Quality Consequence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
              {GUJARAT_VS_RAJASTHAN_AGRONOMY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-amber-800 dark:text-amber-300 whitespace-nowrap">
                    {row.parameter}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                    {row.gujarat}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {row.rajasthan}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                    {row.impactOnYieldAndPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. China Xinjiang Cotton-Cumin Economics Deep-Dive */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-2">
          🇨🇳 China Xinjiang Cotton-Cumin Intercropping Economics Deep-Dive
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          In 2024 and 2025, Xinjiang expanded cumin acreage to <strong className="text-slate-900 dark:text-white">111,200 hectares</strong>, with <strong className="text-amber-700 dark:text-amber-400">91.82%</strong> planted between 66 cm cotton rows before the cotton canopy closes. However, China's model has severe structural vulnerabilities:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">Manual Labor Cost Floor</span>
            <p className="text-slate-700 dark:text-slate-300">
              Because cumin is intercropped inside cotton rows, mechanical harvesters cannot be used. Hand harvesting costs <strong className="text-slate-900 dark:text-white">RMB 6,600/ha ($925/ha)</strong>, establishing a hard economic floor below which Chinese farmers abandon cumin.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Pesticide Spray Incompatibility</span>
            <p className="text-slate-700 dark:text-slate-300">
              Cotton requires heavy defoliants and insecticides that drift into cumin plants, making Chinese cumin ineligible for strict European and US Maximum Residue Limit (MRL) certifications.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">Extreme Continental Climate</span>
            <p className="text-slate-700 dark:text-slate-300">
              Xinjiang suffers from late May frost followed by 42°C July desert heat. In 2026, this extreme weather cut harvest by 40%, raising China's export price to $3,175/MT and restoring India's global pricing dominance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
