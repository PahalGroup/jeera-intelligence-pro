// Durg, Chhattisgarh Landed Wholesale Cost Calculator & Kirana Pulse Engine
// Implements exact physical mandi fee, ghatti cleaning loss, and freight economics

export interface CostBreakdownItem {
  name: string;
  amountPerKg: number;
  percentageOrRate: string;
  description: string;
}

export interface CommercialGradeCost {
  gradeKey: 'mandi_raw' | 'singapore_99' | 'europe_sortex' | 'gulf_super_bold' | 'ipm_residue_free';
  gradeName: string;
  purity: string;
  landedCostRsKg: number;
  landedCostRs55KgBag: number;
  landedCostRsQtl: number;
  landedCostRsMaund: number;
  suggestedKiranaRetailPriceRsKg: number; // typical 18-25% kirana gross margin
  kiranaMarginPct: number;
  description: string;
}

export interface DurgCalculatorInputs {
  unjhaRateRsMaund: number; // e.g. 4400 ₹/Maund (= ₹220/kg)
  apmcCessPct: number; // default 0.5%
  arhatiyaCommissionPct: number; // default 1.25% (1.0% - 1.5%)
  ghattiCleaningLossPct: number; // default 2.5% for Mandi raw
  sortexCostRsKg: number; // default ₹4.50/kg (₹4 - ₹6/kg)
  freightUnjhaToDurgRsKg: number; // default ₹5.50/kg (₹5 - ₹6/kg, ~1,100 km)
  isPackagedGst: boolean; // false = 0% loose; true = 5% packaged
}

export interface DurgCalculatorResult {
  baseUnjhaRsKg: number;
  totalAddonsRsKg: number;
  grades: CommercialGradeCost[];
  breakdown: CostBreakdownItem[];
  trafficLight: 'GREEN' | 'YELLOW' | 'RED';
  actionHeader: string;
  plainEnglishAdvice: string;
  hinglishAdvice: string;
  activeReasons: string[];
}

export const DEFAULT_CALCULATOR_INPUTS: DurgCalculatorInputs = {
  unjhaRateRsMaund: 4400, // ₹220/kg
  apmcCessPct: 0.5,
  arhatiyaCommissionPct: 1.25,
  ghattiCleaningLossPct: 2.5,
  sortexCostRsKg: 4.5,
  freightUnjhaToDurgRsKg: 5.5,
  isPackagedGst: false,
};

export function calculateDurgLandedCosts(inputs: DurgCalculatorInputs = DEFAULT_CALCULATOR_INPUTS): DurgCalculatorResult {
  const baseUnjhaRsKg = inputs.unjhaRateRsMaund / 20; // 1 Maund = 20 kg
  
  // Direct auction transaction costs in Unjha
  const apmcCess = (baseUnjhaRsKg * inputs.apmcCessPct) / 100;
  const arhatiya = (baseUnjhaRsKg * inputs.arhatiyaCommissionPct) / 100;
  
  // Ghatti cleaning shrinkage (dust, stones, empty husks): 2.5% loss on raw material
  const ghattiFactor = 1 / (1 - inputs.ghattiCleaningLossPct / 100);
  const rawCleanedBase = baseUnjhaRsKg * ghattiFactor;
  const ghattiLossValue = rawCleanedBase - baseUnjhaRsKg;

  // Grade 1: Mandi Raw / Tukdi (95-97% pure)
  // Base + Cess + Commission + Freight (no Sortex cleaning)
  let rawLanded = baseUnjhaRsKg + apmcCess + arhatiya + inputs.freightUnjhaToDurgRsKg;
  if (inputs.isPackagedGst) rawLanded *= 1.05;

  // Grade 2: 99% Singapore Quality (Cleaned benchmark)
  // Base adjusted for Ghatti + Cess + Commission + Standard cleaning (₹2.5/kg) + Freight
  let singaporeLanded = baseUnjhaRsKg + ghattiLossValue + apmcCess + arhatiya + 2.5 + inputs.freightUnjhaToDurgRsKg;
  if (inputs.isPackagedGst) singaporeLanded *= 1.05;

  // Grade 3: 99.5% – 99.8% Europe Sortex Quality (Color-sorted optical)
  // Singapore + Full Sortex cost (₹4.50/kg)
  let europeLanded = baseUnjhaRsKg + ghattiLossValue + apmcCess + arhatiya + inputs.sortexCostRsKg + inputs.freightUnjhaToDurgRsKg;
  if (inputs.isPackagedGst) europeLanded *= 1.05;

  // Grade 4: Double Sortex Eagle / Gulf Super Bold (Premium selected bold seed)
  // Europe Sortex + ₹18/kg selection premium
  let gulfBoldLanded = europeLanded + 18.0;

  // Grade 5: IPM Residue-Free (Pesticide certified for Europe/USA MRL)
  // Base raw carries farmer premium (+₹28/kg) + Sortex + Lab test
  let ipmLanded = europeLanded + 28.0;

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const round0 = (n: number) => Math.round(n);

  const makeGrade = (
    key: CommercialGradeCost['gradeKey'],
    name: string,
    purity: string,
    landedKg: number,
    marginPct: number,
    desc: string
  ): CommercialGradeCost => ({
    gradeKey: key,
    gradeName: name,
    purity,
    landedCostRsKg: round1(landedKg),
    landedCostRs55KgBag: round0(landedKg * 55),
    landedCostRsQtl: round0(landedKg * 100),
    landedCostRsMaund: round0(landedKg * 20),
    suggestedKiranaRetailPriceRsKg: round0(landedKg * (1 + marginPct / 100)),
    kiranaMarginPct: marginPct,
    description: desc,
  });

  const grades: CommercialGradeCost[] = [
    makeGrade('mandi_raw', 'Mandi Raw / Tukdi', '95–97% Pure', rawLanded, 22, 'Uncleaned local auction quality with minor stalks and dust. Best for bulk hotel/catering customers who clean themselves.'),
    makeGrade('singapore_99', '99% Singapore Quality (Benchmark)', '99.0% Cleaned', singaporeLanded, 20, 'Most popular Indian retail grade. Machine cleaned, zero stones, bright aroma. Standard choice for 100g/250g Kirana pouches.'),
    makeGrade('europe_sortex', '99.5% Europe Sortex Quality', '99.5% Optical Clean', europeLanded, 24, 'Passed through Bühler/Meyer optical color sorter. Uniform color, zero black seeds, crisp pungent seeds.'),
    makeGrade('gulf_super_bold', 'Double Sortex Eagle / Gulf Super Bold', '99.8% Selected Bold', gulfBoldLanded, 28, 'Large uniform bold cumin seeds preferred in high-end spice brands and GCC export markets.'),
    makeGrade('ipm_residue_free', 'IPM Residue-Free Certified', '99.8% MRL Compliant', ipmLanded, 30, 'Tested under EU/US Maximum Residue Limits. Zero chemical pesticide residues; commands highest export & premium grocery price.')
  ];

  const breakdown: CostBreakdownItem[] = [
    { name: 'Base Unjha APMC Price', amountPerKg: round1(baseUnjhaRsKg), percentageOrRate: 'Auction base', description: 'Raw farm-gate modal price shouted in Unjha' },
    { name: 'APMC Market Cess', amountPerKg: round1(apmcCess), percentageOrRate: `${inputs.apmcCessPct}%`, description: 'Mandi board statutory development cess' },
    { name: 'Arhatiya Commission / Brokerage', amountPerKg: round1(arhatiya), percentageOrRate: `${inputs.arhatiyaCommissionPct}%`, description: 'Commission agent handling & weighing fee' },
    { name: 'Ghatti Cleaning Shrinkage (2.5%)', amountPerKg: round1(ghattiLossValue), percentageOrRate: `${inputs.ghattiCleaningLossPct}% loss`, description: 'Dust, empty husk, and moisture loss during Ghatti de-stoning' },
    { name: 'Optical Sortex Processing', amountPerKg: round1(inputs.sortexCostRsKg), percentageOrRate: `₹${inputs.sortexCostRsKg}/kg`, description: 'High-speed camera laser ejection of discolored grains' },
    { name: 'Truck Freight (Unjha to Durg Mandi)', amountPerKg: round1(inputs.freightUnjhaToDurgRsKg), percentageOrRate: `₹${inputs.freightUnjhaToDurgRsKg}/kg`, description: '~1,100 km transit via NH-53 with transit insurance' },
  ];

  if (inputs.isPackagedGst) {
    breakdown.push({
      name: 'GST on Packaged Goods',
      amountPerKg: round1(singaporeLanded * 0.05),
      percentageOrRate: '5.0%',
      description: 'Central + State GST on pre-packaged/branded spices'
    });
  }

  // Kirana Pulse Decision Engine
  // Green: India FOB discount > $250/MT and spot price near farmer holding floor (₹200-₹240/kg)
  // Yellow: Normal trading channel
  // Red: Price overbought > ₹320/kg or peak harvest flush
  let trafficLight: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let actionHeader = 'GREEN LIGHT: Stock 30 Days Inventory Now';
  let plainEnglishAdvice = 'Jeera prices are holding firm near the farmer cost-of-production floor. India is $750/MT cheaper than foreign competitors, so export demand will keep local prices from falling further.';
  let hinglishAdvice = 'Bhaiya, abhi 30 din ka stock bhar lijiye! Kisan ₹200–₹215/kg se niche bech nahi raha hai aur videsh me Indian Jeera bahut sasta bik raha hai, rate aur nahi girega.';
  const activeReasons = [
    'Farmer Holding Support: Saurashtra & Barmer farmers refuse to sell below ₹200–₹215/kg floor.',
    'Massive Global Export Parity: India ($2,400/MT) is $750–$1,000/MT cheaper than China ($3,150/MT) and Syria ($3,350/MT).',
    'NCDEX Futures Reversal: Price bounced from ₹22,050 to ₹25,800/qtl on aggressive short covering.',
    'Dam Water Deficit: CWC reservoir water is -20.45% lower, creating Rabi acreage risk.'
  ];

  if (baseUnjhaRsKg > 310) {
    trafficLight = 'RED';
    actionHeader = 'RED LIGHT: Wait & Buy Strictly Hand-to-Mouth';
    plainEnglishAdvice = 'Prices have surged well above fundamental value. High prices will soon invite aggressive farmer selling and consumer resistance.';
    hinglishAdvice = 'Ruk jaiye! Rate bohot chadh gaya hai. Sirf 3-4 din ka bikne layak maal rakhein, naye maal ki aawak aate hi bhav toottega.';
  } else if (baseUnjhaRsKg > 260) {
    trafficLight = 'YELLOW';
    actionHeader = 'YELLOW LIGHT: Buy Normal 7-to-10 Day Requirement';
    plainEnglishAdvice = 'The market has completed its initial bounce. Maintain routine 7-to-10 day rolling inventory without over-leveraging godowns.';
    hinglishAdvice = 'Normal 7–10 din ka maal khareedein. Tezi ban chuki hai, abhi achanak bada satta lagane ki zaroorat nahi hai.';
  }

  return {
    baseUnjhaRsKg,
    totalAddonsRsKg: round1(singaporeLanded - baseUnjhaRsKg),
    grades,
    breakdown,
    trafficLight,
    actionHeader,
    plainEnglishAdvice,
    hinglishAdvice,
    activeReasons
  };
}

