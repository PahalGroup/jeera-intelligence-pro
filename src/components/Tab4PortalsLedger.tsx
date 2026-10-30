import React, { useState } from 'react';
import {
  OFFICIAL_PORTALS_18,
  SPICES_BOARD_25_COUNTRIES,
  HISTORICAL_CASE_STUDIES_20,
} from '../data/jeeraVerifiedData';
import {
  Globe2,
  ExternalLink,
  Search,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';

export const Tab4PortalsLedger: React.FC = () => {
  const [subTab, setSubTab] = useState<'portals' | 'countries' | 'cases'>('portals');
  const [portalCategoryFilter, setPortalCategoryFilter] = useState<string>('ALL');
  const [portalSearchQuery, setPortalSearchQuery] = useState('');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [caseFilterTrigger, setCaseFilterTrigger] = useState<string>('ALL');
  const [caseSearchQuery, setCaseSearchQuery] = useState('');

  // 1. Portals Filtered
  const filteredPortals = OFFICIAL_PORTALS_18.filter((p) => {
    const matchesCat = portalCategoryFilter === 'ALL' || p.category === portalCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(portalSearchQuery.toLowerCase()) ||
      p.shortCode.toLowerCase().includes(portalSearchQuery.toLowerCase()) ||
      p.reportName.toLowerCase().includes(portalSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // 2. Countries Filtered
  const filteredCountries = SPICES_BOARD_25_COUNTRIES.filter((c) => {
    return (
      c.country.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.preferredQuality.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.notes.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  });

  // 3. Cases Filtered
  const filteredCases = HISTORICAL_CASE_STUDIES_20.filter((cs) => {
    const matchesTrigger = caseFilterTrigger === 'ALL' || cs.triggerType === caseFilterTrigger;
    const matchesSearch =
      cs.title.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      cs.year.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      cs.summary.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      cs.lesson.toLowerCase().includes(caseSearchQuery.toLowerCase());
    return matchesTrigger && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 sm:px-4 pt-3">
      {/* Header & Sub-Tab Switcher */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Tab 3: All 18 Official Portals, 25-Country Export Ledger & 20 Case Studies
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% verified primary sources, Spices Board official tonnages, and institutional commodity market case history
              </p>
            </div>
          </div>
        </div>

        {/* 3 Sub-Tabs Pill Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('portals')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'portals'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>18 Official Portals</span>
          </button>

          <button
            onClick={() => setSubTab('countries')}
            className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'countries'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>25-Country Export Ledger</span>
          </button>

          <button
            onClick={() => setSubTab('cases')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'cases'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>20 Historical Case Studies</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          SUB-TAB 1: 18 OFFICIAL PORTALS DIRECTORY
      ======================================================== */}
      {subTab === 'portals' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by portal name, code, or report..."
                value={portalSearchQuery}
                onChange={(e) => setPortalSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              {['ALL', 'Weather & Satellite', 'Acreage & Production', 'Trade Surveys & Spot Mandis', 'Customs & Global Trade', 'Futures & Financial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortalCategoryFilter(cat)}
                  className={`px-2 py-1 rounded whitespace-nowrap text-[11px] font-bold transition ${
                    portalCategoryFilter === cat
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat === 'ALL' ? 'All (18)' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Portals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPortals.map((portal) => (
              <div
                key={portal.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-mono">
                        {portal.shortCode}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-1 leading-snug">
                        {portal.name}
                      </h4>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {portal.status}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-2">
                    {portal.category}
                  </span>

                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs mb-2">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block uppercase mb-0.5">
                      Target Report to Read:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                      {portal.reportName}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    <strong className="text-slate-900 dark:text-slate-300">Key Metric:</strong> {portal.keyMetric}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>Main Website</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {portal.directReportUrl && (
                    <a
                      href={portal.directReportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1"
                    >
                      <span>Direct PDF / Feed</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          SUB-TAB 2: 25-COUNTRY SPICES BOARD EXPORT LEDGER
      ======================================================== */}
      {subTab === 'countries' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search country, quality grade, or port notes..."
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              Showing {filteredCountries.length} of 25 official destinations (Spices Board data)
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Destination Country</th>
                    <th className="py-2.5 px-3 text-right">FY24 (MT)</th>
                    <th className="py-2.5 px-3 text-right">FY25 (MT)</th>
                    <th className="py-2.5 px-3 text-right">FY25 Value (₹ Cr)</th>
                    <th className="py-2.5 px-3 text-right">YoY Growth</th>
                    <th className="py-2.5 px-3">Preferred Quality</th>
                    <th className="py-2.5 px-3">Trade Insights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
                  {filteredCountries.map((c) => (
                    <tr key={c.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{c.rank}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="mr-1.5">{c.flag}</span>
                        {c.country}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {c.fy24MT.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-300">
                        {c.fy25MT.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        ₹{c.fy25ValueCr.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.yoyGrowthPct > 50
                              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                              : c.yoyGrowthPct > 20
                              ? 'bg-sky-500/15 text-sky-800 dark:text-sky-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          +{c.yoyGrowthPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]">
                        {c.preferredQuality}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px] min-w-[240px]">
                        {c.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SUB-TAB 3: 20 HISTORICAL CASE STUDIES (2005 - 2026)
      ======================================================== */}
      {subTab === 'cases' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by year, title, blights, or lessons..."
                value={caseSearchQuery}
                onChange={(e) => setCaseSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Trigger Filter */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              {['ALL', 'Supply Squeeze', 'Weather Disaster', 'Acreage Expansion', 'Foreign Competition', 'Demand Destruction'].map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => setCaseFilterTrigger(trigger)}
                  className={`px-2 py-1 rounded whitespace-nowrap text-[11px] font-bold transition ${
                    caseFilterTrigger === trigger
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {trigger === 'ALL' ? 'All (20)' : trigger.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCases.map((cs) => (
              <div
                key={cs.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {cs.year}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        cs.triggerType === 'Weather Disaster'
                          ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
                          : cs.triggerType === 'Supply Squeeze'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                          : cs.triggerType === 'Acreage Expansion'
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                          : cs.triggerType === 'Foreign Competition'
                          ? 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30'
                          : 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {cs.triggerType}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-2 leading-snug">
                    {cs.title}
                  </h4>

                  {/* Price Movement Box */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs mb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Start</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-300">₹{cs.startingPriceRsKg}/kg</span>
                    </div>
                    <span className="text-slate-400">&rarr;</span>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Peak</span>
                      <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-sm">₹{cs.peakPriceRsKg}/kg</span>
                    </div>
                    <span className="text-slate-400">&rarr;</span>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Ending</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-300">₹{cs.endingPriceRsKg}/kg</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {cs.summary}
                  </p>
                </div>

                {/* Key Lesson Box */}
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2.5 border border-amber-200 dark:border-amber-500/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-0.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Commodity Trading Law / Lesson:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    "{cs.lesson}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
