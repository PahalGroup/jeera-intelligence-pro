import React, { useState } from 'react';
import { type UnitType, formatPriceByUnit } from '../utils/units';
import {
  calculateDurgLandedCosts,
  DEFAULT_CALCULATOR_INPUTS,
  type DurgCalculatorInputs,
  type DurgCalculatorResult,
} from '../services/durgCalculator';
import {
  Store,
  Calculator,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';

interface Tab3KiranaDurgProps {
  activeUnit: UnitType;
}

export const Tab3KiranaDurg: React.FC<Tab3KiranaDurgProps> = ({ activeUnit }) => {
  const [inputs, setInputs] = useState<DurgCalculatorInputs>(DEFAULT_CALCULATOR_INPUTS);
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiResponseJson, setApiResponseJson] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const calcResult: DurgCalculatorResult = calculateDurgLandedCosts(inputs);

  const handleCopyEmbedCode = () => {
    const embedCode = `<!-- Pluggable Kirana Jeera Pulse Module -->
<div id="kirana-jeera-pulse-root"></div>
<script>
  (function() {
    fetch('http://localhost:5173/api/v1/kirana/jeera-pulse')
      .then(res => res.json())
      .then(data => {
        const root = document.getElementById('kirana-jeera-pulse-root');
        root.innerHTML = \`
          <div style="background:#0f172a; color:#f8fafc; border-radius:12px; padding:16px; border:1px solid #334155; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:bold; color:#f59e0b;">🌿 Jeera Pulse: Durg Wholesale</span>
              <span style="background:\${data.recommendation.trafficLight === 'GREEN' ? '#059669' : '#d97706'}; color:#fff; font-size:11px; padding:2px 8px; border-radius:99px; font-weight:bold;">
                \${data.recommendation.trafficLight} LIGHT
              </span>
            </div>
            <div style="margin-top:8px; font-size:22px; font-weight:900; color:#38bdf8;">
              ₹\${data.landedGradesInDurg[1].landedCostRsKg} / kg <span style="font-size:12px; color:#94a3b8;">(99% Cleaned)</span>
            </div>
            <p style="font-size:13px; margin:6px 0; color:#e2e8f0; font-weight:600;">\${data.recommendation.actionHeader}</p>
            <p style="font-size:12px; color:#cbd5e1; font-style:italic; background:#1e293b; padding:8px; border-radius:6px;">"\${data.recommendation.hinglishAdvice}"</p>
          </div>
        \`;
      })
      .catch(err => console.error('Kirana pulse failed to load', err));
  })();
</script>`;

    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestApi = async () => {
    setIsLoadingApi(true);
    try {
      const res = await fetch('/api/v1/kirana/jeera-pulse');
      const json = await res.json();
      setApiResponseJson(JSON.stringify(json, null, 2));
    } catch (err) {
      setApiResponseJson(JSON.stringify({ error: 'Failed to fetch API', details: String(err) }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 sm:px-4 pt-3">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Durg, Chhattisgarh Landed Wholesale Calculator & Kirana App Module
              </h2>
              <p className="text-xs text-slate-300">
                Transforms Unjha APMC auction bidding rates into exact shopkeeper landed costs in Durg Mandi (Ganj Mandi / Mohan Nagar)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
              Unjha &rarr; Durg: ~1,100 km (NH-53)
            </span>
          </div>
        </div>
      </section>

      {/* 2. Pluggable <KiranaSpicePulse /> Live Widget (The Kirana User Experience) */}
      <section className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Pluggable Kirana App Widget
              </span>
              <h3 className="text-sm sm:text-base font-black text-white">
                &lt;KiranaSpicePulse /&gt; Live Decision Card
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyEmbedCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm active:scale-95"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied HTML!' : 'Copy Pluggable Code'}</span>
            </button>
          </div>
        </div>

        {/* The Actual Kirana Pulse Visual Card */}
        <div className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${
          calcResult.trafficLight === 'GREEN'
            ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
            : calcResult.trafficLight === 'RED'
            ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/10'
            : 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full animate-ping ${
                calcResult.trafficLight === 'GREEN' ? 'bg-emerald-400' :
                calcResult.trafficLight === 'RED' ? 'bg-rose-400' : 'bg-amber-400'
              }`}></span>
              <span className={`px-2.5 py-0.5 rounded-full font-black text-xs uppercase border ${
                calcResult.trafficLight === 'GREEN' ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50' :
                calcResult.trafficLight === 'RED' ? 'bg-rose-500/30 text-rose-300 border-rose-500/50' :
                'bg-amber-500/30 text-amber-300 border-amber-500/50'
              }`}>
                {calcResult.trafficLight} LIGHT &bull; {calcResult.trafficLight === 'GREEN' ? 'Stock 30 Days' : calcResult.trafficLight === 'RED' ? 'Wait / Hand-to-Mouth' : '7-Day Normal'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Durg Benchmark Wholesale (99% Clean)</span>
              <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                ₹{calcResult.grades[1].landedCostRsKg} / kg
              </span>
              <span className="text-[11px] text-slate-400 ml-1">
                (₹{calcResult.grades[1].landedCostRs55KgBag.toLocaleString()} / 55kg Bag)
              </span>
            </div>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
            {calcResult.actionHeader}
          </h4>

          {/* Hinglish Box for Shopkeeper */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 my-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
              <span>🗣️ Durg Kirana Bhaiyon Ke Liye (Hinglish):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed">
              "{calcResult.hinglishAdvice}"
            </p>
          </div>

          {/* Plain English Box */}
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            <strong className="text-white">Why:</strong> {calcResult.plainEnglishAdvice}
          </p>

          {/* 4 Active Bullet Reasons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-300">
            {calcResult.activeReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live API Inspection Drawer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-emerald-400">GET /api/v1/kirana/jeera-pulse</span>
            <span>&bull;</span>
            <span>CORS Enabled</span>
          </div>

          <button
            onClick={handleTestApi}
            disabled={isLoadingApi}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isLoadingApi ? 'Testing API...' : 'Test Live REST Endpoint'}</span>
          </button>
        </div>

        {apiResponseJson && (
          <div className="mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-48 overflow-y-auto">
            <div className="flex justify-between items-center text-slate-400 pb-1 mb-1 border-b border-slate-800">
              <span>HTTP 200 OK — Live Payload</span>
              <button onClick={() => setApiResponseJson(null)} className="text-rose-400 hover:underline">Close</button>
            </div>
            <pre>{apiResponseJson}</pre>
          </div>
        )}
      </section>

      {/* 3. Interactive Durg Landed Cost Calculator */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
          <Calculator className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Interactive Durg Landed Cost Formula & Sliders
            </h3>
            <p className="text-xs text-slate-400">
              Adjust Unjha auction bids, APMC mandi fees, cleaning shrinkage, and freight to simulate your exact wholesale margin
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* Input 1: Unjha Auction Rate */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Unjha Auction Rate</span>
              <span className="text-amber-400 font-bold">₹{inputs.unjhaRateRsMaund} / Maund</span>
            </div>
            <input
              type="range"
              min={3000}
              max={8000}
              step={50}
              value={inputs.unjhaRateRsMaund}
              onChange={(e) => setInputs({ ...inputs, unjhaRateRsMaund: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹3,000 (₹150/kg)</span>
              <span className="text-slate-300 font-mono">(= ₹{inputs.unjhaRateRsMaund / 20}/kg)</span>
              <span>₹8,000 (₹400/kg)</span>
            </div>
          </div>

          {/* Input 2: Truck Freight Unjha -> Durg */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Freight (Unjha &rarr; Durg)</span>
              <span className="text-sky-400 font-bold">₹{inputs.freightUnjhaToDurgRsKg} / kg</span>
            </div>
            <input
              type="range"
              min={4.0}
              max={8.0}
              step={0.25}
              value={inputs.freightUnjhaToDurgRsKg}
              onChange={(e) => setInputs({ ...inputs, freightUnjhaToDurgRsKg: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹4.0/kg (Full Load)</span>
              <span>₹{inputs.freightUnjhaToDurgRsKg * 55} / 55kg bag</span>
              <span>₹8.0/kg (Part Load)</span>
            </div>
          </div>

          {/* Input 3: Sortex Optical Cleaning */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Sortex Processing Cost</span>
              <span className="text-purple-400 font-bold">₹{inputs.sortexCostRsKg} / kg</span>
            </div>
            <input
              type="range"
              min={3.0}
              max={7.0}
              step={0.5}
              value={inputs.sortexCostRsKg}
              onChange={(e) => setInputs({ ...inputs, sortexCostRsKg: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹3.0/kg</span>
              <span>Bühler / Meyer Machine</span>
              <span>₹7.0/kg</span>
            </div>
          </div>

          {/* Input 4: APMC Market Cess */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>APMC Mandi Cess</span>
              <span className="text-slate-200 font-bold">{inputs.apmcCessPct}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1.5}
              step={0.1}
              value={inputs.apmcCessPct}
              onChange={(e) => setInputs({ ...inputs, apmcCessPct: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.2%</span>
              <span>Statutory Board Cess</span>
              <span>1.5%</span>
            </div>
          </div>

          {/* Input 5: Arhatiya Commission */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Arhatiya Commission</span>
              <span className="text-slate-200 font-bold">{inputs.arhatiyaCommissionPct}%</span>
            </div>
            <input
              type="range"
              min={0.75}
              max={2.0}
              step={0.25}
              value={inputs.arhatiyaCommissionPct}
              onChange={(e) => setInputs({ ...inputs, arhatiyaCommissionPct: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.75%</span>
              <span>Broker / Agent fee</span>
              <span>2.0%</span>
            </div>
          </div>

          {/* Input 6: Packaged GST Toggle */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Packaged Goods GST</span>
              <button
                onClick={() => setInputs({ ...inputs, isPackagedGst: !inputs.isPackagedGst })}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  inputs.isPackagedGst
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {inputs.isPackagedGst ? '5% GST Active' : '0% GST (Loose)'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Loose unbranded cumin sold from gunny bags carries 0% GST; pre-packaged branded pouches carry 5% GST.
            </p>
          </div>
        </div>

        {/* 4. Landed Wholesale Cost for all 5 Commercial Grades */}
        <div className="mt-5">
          <h4 className="text-xs sm:text-sm font-bold text-slate-200 mb-2.5">
            Landed Wholesale Cost in Durg across all 5 Commercial Grades:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {calcResult.grades.map((grade) => (
              <div
                key={grade.gradeKey}
                className={`p-3.5 rounded-xl border transition-all ${
                  grade.gradeKey === 'singapore_99'
                    ? 'bg-slate-950 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{grade.gradeName}</h5>
                    <span className="text-[10px] font-semibold text-amber-400 block">{grade.purity}</span>
                  </div>
                  {grade.gradeKey === 'singapore_99' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Top Seller
                    </span>
                  )}
                </div>

                {/* Primary Cost in Active Unit */}
                <div className="my-2 bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400">Landed Cost:</span>
                    <span className="text-base sm:text-lg font-black text-sky-400 font-mono">
                      {formatPriceByUnit(grade.landedCostRsKg, activeUnit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                    <span>₹{grade.landedCostRsKg}/kg</span>
                    <span>₹{grade.landedCostRs55KgBag.toLocaleString()} / 55kg bag</span>
                    <span>₹{grade.landedCostRsQtl.toLocaleString()} / qtl</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-2 text-[11px] text-slate-300 flex justify-between items-center">
                  <span>Suggested Kirana Retail:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ₹{grade.suggestedKiranaRetailPriceRsKg}/kg ({grade.kiranaMarginPct}% margin)
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  {grade.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Cost Component Breakdown Table */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <h4 className="text-xs sm:text-sm font-bold text-slate-200 mb-2">
            Step-by-Step Landed Cost Breakdown (Unjha Auction &rarr; Durg Mandi Godown):
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-2 px-3">Cost Component</th>
                  <th className="py-2 px-3">Rate / Basis</th>
                  <th className="py-2 px-3 text-right">Amount (₹/kg)</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {calcResult.breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-semibold text-slate-200">{item.name}</td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{item.percentageOrRate}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300 font-mono">₹{item.amountPerKg.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{item.description}</td>
                  </tr>
                ))}
                <tr className="bg-slate-950 font-bold text-white">
                  <td className="py-2.5 px-3">Total Landed in Durg (99% Singapore Grade)</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-mono">+₹{calcResult.totalAddonsRsKg}/kg add-ons</td>
                  <td className="py-2.5 px-3 text-right text-base text-emerald-400 font-mono">₹{calcResult.grades[1].landedCostRsKg}</td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">Ready for retail pouch packaging or loose gunny bag sale</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
