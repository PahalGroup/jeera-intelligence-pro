export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

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

  res.status(200).json(payload);
}

