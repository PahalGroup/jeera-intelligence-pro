import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom API Mock & Live Server Middleware Plugin
function apiRoutesPlugin(): Plugin {
  return {
    name: 'jeera-api-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set CORS headers so external kirana apps can query this endpoint
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = req.url || '';

        // Endpoint 1: Pluggable Kirana Pulse API
        if (url.startsWith('/api/v1/kirana/jeera-pulse')) {
          res.setHeader('Content-Type', 'application/json');
          const payload = {
            status: 'success',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            crop: 'Jeera (Cumin)',
            hsCode: '090931',
            route: 'Unjha APMC (Gujarat) -> Durg Mandi (Chhattisgarh)',
            benchmarkRates: {
              unjhaRateRsMaund: 4400,
              unjhaRateRsKg: 220.0,
              unjhaRateRsQuintal: 22000,
              fobPriceUSD: 2425,
              foreignParityDiscountUSD: 750
            },
            recommendation: {
              trafficLight: 'GREEN',
              actionHeader: 'GREEN LIGHT: Stock 30 Days Inventory Now',
              plainEnglishAdvice: 'Jeera prices are holding firm near the farmer cost-of-production floor. India is $750/MT cheaper than foreign competitors, so export demand will keep local prices from falling further.',
              hinglishAdvice: 'Bhaiya, abhi 30 din ka stock bhar lijiye! Kisan ₹200–₹215/kg se niche bech nahi raha hai aur videsh me Indian Jeera bahut sasta bik raha hai, rate aur nahi girega.',
              reasons: [
                'Farmer Holding Support: Saurashtra & Barmer farmers refuse to sell below ₹200–₹215/kg floor.',
                'Massive Global Export Parity: India ($2,400/MT) is $750–$1,000/MT cheaper than China ($3,150/MT) and Syria ($3,350/MT).',
                'NCDEX Futures Reversal: Price bounced from ₹22,050 to ₹25,800/qtl on aggressive short covering.',
                'Dam Water Deficit: CWC reservoir water is -20.45% lower, creating Rabi acreage risk.'
              ]
            },
            landedGradesInDurg: [
              {
                gradeKey: 'mandi_raw',
                gradeName: 'Mandi Raw / Tukdi',
                purity: '95–97% Pure',
                landedCostRsKg: 229.4,
                landedCostRs55KgBag: 12617,
                suggestedKiranaRetailPriceRsKg: 280,
                kiranaMarginPct: 22
              },
              {
                gradeKey: 'singapore_99',
                gradeName: '99% Singapore Quality (Benchmark)',
                purity: '99.0% Cleaned',
                landedCostRsKg: 237.5,
                landedCostRs55KgBag: 13063,
                suggestedKiranaRetailPriceRsKg: 285,
                kiranaMarginPct: 20
              },
              {
                gradeKey: 'europe_sortex',
                gradeName: '99.5% Europe Sortex Quality',
                purity: '99.5% Optical Clean',
                landedCostRsKg: 239.5,
                landedCostRs55KgBag: 13173,
                suggestedKiranaRetailPriceRsKg: 297,
                kiranaMarginPct: 24
              },
              {
                gradeKey: 'gulf_super_bold',
                gradeName: 'Double Sortex Eagle / Gulf Super Bold',
                purity: '99.8% Selected Bold',
                landedCostRsKg: 257.5,
                landedCostRs55KgBag: 14163,
                suggestedKiranaRetailPriceRsKg: 330,
                kiranaMarginPct: 28
              },
              {
                gradeKey: 'ipm_residue_free',
                gradeName: 'IPM Residue-Free Certified',
                purity: '99.8% MRL Compliant',
                landedCostRsKg: 267.5,
                landedCostRs55KgBag: 14713,
                suggestedKiranaRetailPriceRsKg: 348,
                kiranaMarginPct: 30
              }
            ]
          };
          res.end(JSON.stringify(payload, null, 2));
          return;
        }

        // Endpoint 2: System Health & Scraper Refresh Status
        if (url.startsWith('/api/v1/scraper/status')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'operational',
            portalsTracked: 18,
            openMeteoConnected: true,
            lastSyncTimestamp: new Date().toISOString()
          }, null, 2));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiRoutesPlugin()],
  server: {
    port: 5173,
    host: true,
  }
})
