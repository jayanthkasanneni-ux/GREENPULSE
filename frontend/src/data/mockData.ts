import { FarmProfile, CropRecommendation, ClimateMetric, AgronomicGuide, SoilType } from '../types';

export const DEFAULT_FARM_PROFILE: FarmProfile = {
  id: 'farm-001',
  farmerName: 'Rameshwar Reddy',
  phone: '+91 98490 23411',
  email: 'rameshwar.reddy@agrimail.in',
  state: 'Andhra Pradesh',
  district: 'Anantapur',
  village: 'Kudair Gramam',
  landAreaAcres: 4.5,
  growingSeason: 'Kharif 2026',
  irrigationAvailability: 'borewell',
  waterAvailability: 'Moderate (3-4 hrs daily pumping)',
  soilKnowledgeLevel: 'know_type',
  soilType: 'red',
  soilPh: 6.8,
  nitrogenKgHa: 245,
  phosphorusKgHa: 16,
  potassiumKgHa: 210,
  lastUpdated: '2026-10-30',
};

export const getRegionalSoilDefault = (district: string): { soilType: SoilType; name: string; description: string; estimatedPh: number } => {
  const d = district.toLowerCase();
  if (d.includes('anantapur') || d.includes('chittoor') || d.includes('kurnool') || d.includes('kadapa')) {
    return {
      soilType: 'red',
      name: 'Red Sandy Loam (Chalkas)',
      description: 'Typical for Rayalaseema agro-climatic zone. High aeration, moderate water retention, optimal for groundnut and millets.',
      estimatedPh: 6.8,
    };
  }
  if (d.includes('nashik') || d.includes('dharwad') || d.includes('vidarbha') || d.includes('marathwada')) {
    return {
      soilType: 'black',
      name: 'Medium Black (Regur)',
      description: 'Typical Deccan Trap basaltic soil. High moisture retentiveness, rich in calcium and magnesium, suitable for cotton, pulses, and sorghum.',
      estimatedPh: 7.5,
    };
  }
  if (d.includes('jodhpur') || d.includes('bikaner') || d.includes('barmer')) {
    return {
      soilType: 'sandy',
      name: 'Arid Sandy Soil',
      description: 'Low organic matter, rapid drainage. Thrives with pearl millet and moth bean under drip irrigation.',
      estimatedPh: 8.0,
    };
  }
  return {
    soilType: 'loamy',
    name: 'Alluvial Loamy Soil',
    description: 'Balanced sand, silt, and clay with fertile topsoil organic matter.',
    estimatedPh: 7.0,
  };
};

export const SAMPLE_CROPS: CropRecommendation[] = [
  {
    id: 'crop-groundnut',
    name: 'Groundnut (Peanut)',
    botanicalName: 'Arachis hypogaea',
    localName: 'Verusenaga / Moongphali',
    category: 'Oilseed',
    image: '/src/assets/images/crop_groundnut_legumes_1793426700241.jpg',
    suitabilityScore: 92,
    riskLevel: 'low',
    waterDemand: 'low',
    growingDurationDays: '105 - 115 days',
    optimalTemperature: '22°C - 32°C',
    optimalRainfallMm: '450 - 650 mm',
    soilCompatibility: 'Excellent in well-drained Red Sandy Loam (pH 6.2 - 7.2)',
    estimatedYieldRange: '14 - 18 Quintals / Acre',
    reasonsForRecommendation: [
      'High tolerance to intermittent mid-season dry spells in red soils.',
      'Pegging and pod development match projected August-September rainfall.',
      'Fixes atmospheric nitrogen, lowering synthetic urea input requirements.',
      'Active regional procurement center within 18 km with guaranteed MSP.'
    ],
    climateRisks: [
      {
        category: 'Drought',
        severity: 'low',
        explanation: 'Deep taproot system recovers quickly from 10-14 day dry spells during vegetative growth.',
        mitigation: 'Apply anti-transpirant kaolin spray (5%) if dry spell exceeds 12 consecutive days.'
      },
      {
        category: 'Heat Stress',
        severity: 'low',
        explanation: 'Flower pollen viability stays intact up to 34°C, well within regional historical norms.',
        mitigation: 'Maintain micro-sprinkler misting if midday peak touches 36°C.'
      },
      {
        category: 'Excess Rainfall',
        severity: 'moderate',
        explanation: 'Waterlogging during late maturity can cause pod rotting and premature germination.',
        mitigation: 'Ensure broad-bed furrow (BBF) planting to evacuate torrential rain surges.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'June 25 – July 15 (Post-monsoon onset)',
      seedRate: '40 - 45 kg kernels / acre (Treated with Trichoderma viride)',
      criticalWaterStages: ['Flowering (25-30 DAS)', 'Peg penetration (40-45 DAS)', 'Pod formation (60-70 DAS)'],
      fertilizerRecommendation: '10 kg N : 20 kg P₂O₅ : 20 kg K₂O per acre with Gypsum 200 kg at flowering.',
      climateContingency: 'If monsoon delayed past July 20, shift to short-duration variety Dharani (95 days).'
    },
    economics: {
      estimatedCostPerAcre: 18500,
      expectedRevenuePerAcre: 48000,
      minimumSupportPriceAvailable: true
    }
  },
  {
    id: 'crop-millets',
    name: 'Pearl Millet (Bajra)',
    botanicalName: 'Pennisetum glaucum',
    localName: 'Sajjalu / Bajra',
    category: 'Millet',
    image: '/src/assets/images/crop_millets_sorghum_1793426699961.jpg',
    suitabilityScore: 89,
    riskLevel: 'low',
    waterDemand: 'low',
    growingDurationDays: '80 - 88 days',
    optimalTemperature: '25°C - 38°C',
    optimalRainfallMm: '350 - 500 mm',
    soilCompatibility: 'Thrives in marginal Red Loam and Shallow Gravelly soils',
    estimatedYieldRange: '12 - 16 Quintals / Acre',
    reasonsForRecommendation: [
      'Superior C4 photosynthetic efficiency under high daytime solar radiation.',
      'Lowest consumptive water footprint of all regional grain staples.',
      'Extremely resilient to thermal spikes exceeding 37°C during grain filling.',
      'High fodder biomass output provides insurance for livestock feed.'
    ],
    climateRisks: [
      {
        category: 'Drought',
        severity: 'low',
        explanation: 'Can extract moisture from deep soil layers; enters dormancy under stress without wilting.',
        mitigation: 'Seed hardening with 2% potassium chloride prior to sowing.'
      },
      {
        category: 'Excess Rainfall',
        severity: 'moderate',
        explanation: 'Unseasonal rain during anthesis/flowering washes pollen and promotes Ergot fungal disease.',
        mitigation: 'Select downy mildew and ergot-tolerant hybrid HHB-67 Improved.'
      },
      {
        category: 'Pest Outbreak',
        severity: 'low',
        explanation: 'Natural silica content in stalks confers pest resistance against stem borers.',
        mitigation: 'Pheromone traps for shoot fly surveillance at 14 days after emergence.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'July 05 – July 25',
      seedRate: '1.8 - 2.2 kg / acre (Line sowing at 45cm x 15cm)',
      criticalWaterStages: ['Tillering (20-25 DAS)', 'Panicle emergence (45 DAS)'],
      fertilizerRecommendation: '25 kg N : 15 kg P₂O₅ : 10 kg K₂O per acre in two splits.',
      climateContingency: 'Ideal catch crop if initial pulses experience early moisture failure.'
    },
    economics: {
      estimatedCostPerAcre: 9200,
      expectedRevenuePerAcre: 28500,
      minimumSupportPriceAvailable: true
    }
  },
  {
    id: 'crop-maize',
    name: 'Maize (Hybrid Corn)',
    botanicalName: 'Zea mays',
    localName: 'Mokka Jonnalu / Makka',
    category: 'Cereal',
    image: '/src/assets/images/crop_maize_corn_1793426699966.jpg',
    suitabilityScore: 78,
    riskLevel: 'moderate',
    waterDemand: 'moderate',
    growingDurationDays: '100 - 110 days',
    optimalTemperature: '20°C - 30°C',
    optimalRainfallMm: '550 - 750 mm',
    soilCompatibility: 'Good in fertile Red Loam with pH 6.0 - 7.5; requires good aeration',
    estimatedYieldRange: '24 - 32 Quintals / Acre',
    reasonsForRecommendation: [
      'High revenue potential under regulated supplemental borewell irrigation.',
      'Strong commercial demand from animal feed mills and starch processing units.',
      'Uniform maturity allows mechanized cob picking and reduced harvest labor.'
    ],
    climateRisks: [
      {
        category: 'Heat Stress',
        severity: 'moderate',
        explanation: 'Temperatures >35°C during tasseling and silking cause silk desiccation and poor kernel set.',
        mitigation: 'Ensure protective evening irrigation during 50-60 DAS tasseling stage.'
      },
      {
        category: 'Drought',
        severity: 'moderate',
        explanation: 'High leaf surface area creates significant evapotranspiration demand; moisture stress drops yield ~30%.',
        mitigation: 'Adopt furrow diking and retain in-situ crop residue mulch.'
      },
      {
        category: 'Pest Outbreak',
        severity: 'high',
        explanation: 'Fall Armyworm (Spodoptera frugiperda) proliferates during humid dry-spell alternations.',
        mitigation: 'Release Trichogramma egg parasitoids + Neem oil (1500 ppm) early at whorl stage.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'June 20 – July 10',
      seedRate: '7.5 - 8 kg / acre (Single seed per hill at 60cm x 20cm)',
      criticalWaterStages: ['Tasseling (45-50 DAS)', 'Silking (55-60 DAS)', 'Grain filling (70-80 DAS)'],
      fertilizerRecommendation: '50 kg N : 25 kg P₂O₅ : 20 kg K₂O per acre with Zinc Sulphate 10 kg.',
      climateContingency: 'If borewell yield drops below 2 GPM in August, skip alternate furrow irrigations.'
    },
    economics: {
      estimatedCostPerAcre: 22000,
      expectedRevenuePerAcre: 54000,
      minimumSupportPriceAvailable: true
    }
  },
  {
    id: 'crop-pulses',
    name: 'Pigeon Pea (Red Gram / Toor)',
    botanicalName: 'Cajanus cajan',
    localName: 'Kandulu / Arhar',
    category: 'Legume/Pulse',
    image: '/src/assets/images/crop_groundnut_legumes_1793426700241.jpg',
    suitabilityScore: 84,
    riskLevel: 'low',
    waterDemand: 'low',
    growingDurationDays: '150 - 165 days',
    optimalTemperature: '24°C - 34°C',
    optimalRainfallMm: '500 - 700 mm',
    soilCompatibility: 'Well-suited to deep Red & Medium Black soils with deep root space',
    estimatedYieldRange: '6 - 9 Quintals / Acre',
    reasonsForRecommendation: [
      'Deep penetrating taproot (>1.5 meters) taps deep subsoil residual moisture.',
      'Excellent intercropping candidate (7:1 ratio with Groundnut or Millets).',
      'High market price stability with strong consumer domestic demand.',
      'Sheds massive organic leaf litter, enriching topsoil humus.'
    ],
    climateRisks: [
      {
        category: 'Drought',
        severity: 'low',
        explanation: 'Very high drought avoidance capability through osmotic adjustment in stem tissues.',
        mitigation: 'Single protective irrigation at pod development stage guarantees full seed weight.'
      },
      {
        category: 'Pest Outbreak',
        severity: 'moderate',
        explanation: 'Pod borer (Helicoverpa armigera) pressure peaks under overcast cloudy weather in November.',
        mitigation: 'Install 5 bird perches/acre and spray NPV (Nuclear Polyhedrosis Virus) @ 250 LE/acre.'
      },
      {
        category: 'Excess Rainfall',
        severity: 'low',
        explanation: 'Moderate tolerance; surface ridges prevent root rot stagnation.',
        mitigation: 'Inter-row cultivation to maintain ridge height before late-season rains.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'June 15 – July 10',
      seedRate: '4 - 5 kg / acre as sole crop (90cm x 30cm spacing)',
      criticalWaterStages: ['Branching (30 DAS)', 'Flower initiation (75 DAS)', 'Pod development (110 DAS)'],
      fertilizerRecommendation: '10 kg N : 20 kg P₂O₅ : 10 kg K₂O per acre with Rhizobium bio-fertilizer.',
      climateContingency: 'If vegetative growth is excessive due to early rains, pinch terminal shoots at 60 DAS.'
    },
    economics: {
      estimatedCostPerAcre: 13500,
      expectedRevenuePerAcre: 46000,
      minimumSupportPriceAvailable: true
    }
  },
  {
    id: 'crop-rice',
    name: 'Direct Seeded Rice (AEROBIC / DSR)',
    botanicalName: 'Oryza sativa',
    localName: 'Vari (Direct Seeded)',
    category: 'Cereal',
    image: '/src/assets/images/crop_rice_paddy_1793426700005.jpg',
    suitabilityScore: 61,
    riskLevel: 'high',
    waterDemand: 'high',
    growingDurationDays: '120 - 130 days',
    optimalTemperature: '22°C - 33°C',
    optimalRainfallMm: '900 - 1200 mm',
    soilCompatibility: 'Prefers Heavy Clay or Silty Loam; poor water retention in sandy red soils',
    estimatedYieldRange: '18 - 24 Quintals / Acre',
    reasonsForRecommendation: [
      'Direct seeding avoids transplanting labor and saves ~30% water over flooded paddy.',
      'Shorter field residency by 10-14 days compared to puddled seedlings.'
    ],
    climateRisks: [
      {
        category: 'Drought',
        severity: 'high',
        explanation: 'Lack of standing water allows weed suppression breakdown; drought during panicle initiation triggers high spikelet sterility (>50%).',
        mitigation: 'Requires continuous dedicated borewell availability; avoid without micro-irrigation backup.'
      },
      {
        category: 'Soil Mismatch',
        severity: 'high',
        explanation: 'In light red sandy soil, deep percolation losses are catastrophic (up to 65% water loss).',
        mitigation: 'Do not attempt in coarse soils with high hydraulic conductivity.'
      },
      {
        category: 'Heat Stress',
        severity: 'moderate',
        explanation: 'Anthesis temperatures >35°C prevent anther dehiscence.',
        mitigation: 'Advance sowing date to avoid peak September heatwaves.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'June 10 – June 30',
      seedRate: '12 - 15 kg / acre with seed drill',
      criticalWaterStages: ['Active tillering (25-35 DAS)', 'Panicle initiation (50-65 DAS)', 'Flowering (85 DAS)'],
      fertilizerRecommendation: '40 kg N : 20 kg P₂O₅ : 20 kg K₂O with Iron Chelate (Fe-EDTA) against chlorosis.',
      climateContingency: 'If water storage drops below 40% by July 31, convert standing field to pulses.'
    },
    economics: {
      estimatedCostPerAcre: 26000,
      expectedRevenuePerAcre: 48000,
      minimumSupportPriceAvailable: true
    }
  },
  {
    id: 'crop-cotton',
    name: 'Desi / Medium Staple Cotton',
    botanicalName: 'Gossypium hirsutum',
    localName: 'Patti / Kapas',
    category: 'Fiber',
    image: '/src/assets/images/crop_maize_corn_1793426699966.jpg',
    suitabilityScore: 71,
    riskLevel: 'moderate',
    waterDemand: 'moderate',
    growingDurationDays: '150 - 170 days',
    optimalTemperature: '21°C - 35°C',
    optimalRainfallMm: '600 - 850 mm',
    soilCompatibility: 'Moderate in deep red loams; optimal in medium-deep black cotton soils',
    estimatedYieldRange: '8 - 12 Quintals / Acre',
    reasonsForRecommendation: [
      'Commercial cash crop with high liquidity and active daily market yards.',
      'Deep root system can explore subsoil nutrients below 80 cm depth.'
    ],
    climateRisks: [
      {
        category: 'Excess Rainfall',
        severity: 'high',
        explanation: 'Late October cyclone squalls cause severe square dropping, open boll soaking, and fiber yellowing.',
        mitigation: 'Pick early flushes promptly; spray planofix (NAA) @ 4.5ml/15L to arrest square drop.'
      },
      {
        category: 'Pest Outbreak',
        severity: 'high',
        explanation: 'Prolonged dry spells encourage sucking pests (Whitefly, Thrips, Aphids) followed by Pink Bollworm.',
        mitigation: 'Plant 2 border rows of Pigeon Pea and castor as trap crops; use yellow sticky traps.'
      },
      {
        category: 'Drought',
        severity: 'moderate',
        explanation: 'Vegetative growth halts during peak drought; leaves turn brittle.',
        mitigation: 'Supplemental drip fertigation with 1% 19:19:19 water-soluble grade.'
      }
    ],
    agronomicAdvisory: {
      recommendedWindow: 'June 20 – July 15',
      seedRate: '1.5 - 2.0 kg / acre (90cm x 60cm spacing)',
      criticalWaterStages: ['Square formation (45 DAS)', 'Flowering (70 DAS)', 'Boll filling (100 DAS)'],
      fertilizerRecommendation: '35 kg N : 18 kg P₂O₅ : 18 kg K₂O per acre with Magnesium Sulphate.',
      climateContingency: 'If late rains fail entirely, defoliate early to ripen lower bolls.'
    },
    economics: {
      estimatedCostPerAcre: 24500,
      expectedRevenuePerAcre: 58000,
      minimumSupportPriceAvailable: true
    }
  }
];

export const MONTHLY_CLIMATE_SERIES: ClimateMetric[] = [
  { month: 'Jan', rainfallCurrentMm: 2, rainfallHistoricalNormalMm: 3, tempMaxC: 30.2, tempMinC: 17.1, tempHistoricalMaxC: 29.8, drySpellDays: 28 },
  { month: 'Feb', rainfallCurrentMm: 4, rainfallHistoricalNormalMm: 5, tempMaxC: 33.5, tempMinC: 19.4, tempHistoricalMaxC: 32.8, drySpellDays: 26 },
  { month: 'Mar', rainfallCurrentMm: 12, rainfallHistoricalNormalMm: 9, tempMaxC: 37.1, tempMinC: 22.8, tempHistoricalMaxC: 36.4, drySpellDays: 25 },
  { month: 'Apr', rainfallCurrentMm: 18, rainfallHistoricalNormalMm: 21, tempMaxC: 39.8, tempMinC: 25.5, tempHistoricalMaxC: 38.9, drySpellDays: 22 },
  { month: 'May', rainfallCurrentMm: 42, rainfallHistoricalNormalMm: 48, tempMaxC: 39.2, tempMinC: 26.2, tempHistoricalMaxC: 38.5, drySpellDays: 18 },
  { month: 'Jun', rainfallCurrentMm: 58, rainfallHistoricalNormalMm: 64, tempMaxC: 34.6, tempMinC: 24.5, tempHistoricalMaxC: 34.0, drySpellDays: 14 },
  { month: 'Jul', rainfallCurrentMm: 82, rainfallHistoricalNormalMm: 94, tempMaxC: 32.4, tempMinC: 23.8, tempHistoricalMaxC: 32.1, drySpellDays: 11 },
  { month: 'Aug', rainfallCurrentMm: 96, rainfallHistoricalNormalMm: 108, tempMaxC: 31.8, tempMinC: 23.4, tempHistoricalMaxC: 31.5, drySpellDays: 10 },
  { month: 'Sep', rainfallCurrentMm: 142, rainfallHistoricalNormalMm: 135, tempMaxC: 31.5, tempMinC: 23.0, tempHistoricalMaxC: 31.2, drySpellDays: 8 },
  { month: 'Oct', rainfallCurrentMm: 110, rainfallHistoricalNormalMm: 118, tempMaxC: 31.2, tempMinC: 22.1, tempHistoricalMaxC: 31.0, drySpellDays: 12 },
  { month: 'Nov', rainfallCurrentMm: 38, rainfallHistoricalNormalMm: 46, tempMaxC: 29.8, tempMinC: 19.5, tempHistoricalMaxC: 29.5, drySpellDays: 21 },
  { month: 'Dec', rainfallCurrentMm: 8, rainfallHistoricalNormalMm: 12, tempMaxC: 29.1, tempMinC: 17.4, tempHistoricalMaxC: 28.9, drySpellDays: 27 },
];

export const SEASONAL_RAINFALL_COMPARISON = [
  { year: '2022', kharifMm: 420, rabiMm: 165, normalMm: 540 },
  { year: '2023', kharifMm: 360, rabiMm: 92, normalMm: 540 },
  { year: '2024', kharifMm: 510, rabiMm: 180, normalMm: 540 },
  { year: '2025', kharifMm: 445, rabiMm: 134, normalMm: 540 },
  { year: '2026 (Est.)', kharifMm: 488, rabiMm: 156, normalMm: 540 },
];



export const AGRONOMIC_GUIDES: AgronomicGuide[] = [
  {
    id: 'guide-1',
    title: 'Climate-Adaptive Sowing Windows for Semi-Arid Tropics',
    category: 'Planting Windows',
    applicableCrops: ['Groundnut', 'Pearl Millet', 'Pigeon Pea'],
    summary: 'Adjusting sowing dates based on cumulative soil moisture rather than fixed calendar dates prevents early seedling mortality.',
    keyPractices: [
      'Wait for minimum 50-60 mm cumulative rainfall before initiating dryland sowing.',
      'Perform seed priming with 1% potassium nitrate (KNO₃) for 6 hours to accelerate emergence.',
      'Adopt ridge and furrow sowing at 45 cm distance across the slope to arrest runoff velocity.'
    ],
    sourceAttribution: 'ICAR - Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad [Illustrative Reference]',
    publishDate: 'Updated Kharif 2026'
  },
  {
    id: 'guide-2',
    title: 'Micro-Irrigation Scheduling Under Declining Borewell Yield',
    category: 'Water Management',
    applicableCrops: ['Maize', 'Groundnut', 'Cotton'],
    summary: 'Targeted deficit irrigation (TDI) reduces total seasonal water consumption by 28% while safeguarding 90% of maximum harvest yield.',
    keyPractices: [
      'Concentrate supplemental irrigation strictly on phenological critical stages (flowering & pod set).',
      'Operate drip lines in late afternoon or night to eliminate midday evaporative losses.',
      'Install inline pulse emitters with pressure compensating valves across undulating slopes.'
    ],
    sourceAttribution: 'National Institute of Abiotic Stress Management (NIASM), Baramati [Illustrative Reference]',
    publishDate: 'Updated Kharif 2026'
  },
  {
    id: 'guide-3',
    title: 'Building Soil Organic Carbon (SOC) in Degraded Red Loams',
    category: 'Soil Improvement',
    applicableCrops: ['All Crops', 'Millets', 'Pulses'],
    summary: 'Every 0.1% increase in topsoil organic carbon improves soil water retention capacity by approximately 18,000 liters per acre.',
    keyPractices: [
      'Incorporate green manure crop (Sunn hemp / Crotalaria juncea) at 45 days before primary crop planting.',
      'Apply farmyard manure (FYM) enriched with Trichoderma at 4 tons/acre.',
      'Retain 30% crop stubble on field surface rather than open-field burning.'
    ],
    sourceAttribution: 'Acharya N.G. Ranga Agricultural University (ANGRAU), Guntur [Illustrative Reference]',
    publishDate: 'Updated Kharif 2026'
  },
  {
    id: 'guide-4',
    title: 'Heat Stress Abatement During Pollination in Maize & Millets',
    category: 'Heat Mitigation',
    applicableCrops: ['Maize', 'Pearl Millet'],
    summary: 'Thermal spikes above 36°C during 10:00 AM - 2:00 PM degrade pollen tube elongation, resulting in chaffy or half-filled cobs.',
    keyPractices: [
      'Maintain surface soil dampness to bring down micro-canopy ambient temperature by 2.2°C.',
      'Foliar spray of 1% Ascorbic acid or Salicylic acid (100 ppm) 48 hours prior to anticipated heat spell.',
      'Intercrop with tall companion barriers (such as Sorghum on windward boundaries) to block hot desiccating winds.'
    ],
    sourceAttribution: 'Indian Institute of Millets Research (IIMR), Hyderabad [Illustrative Reference]',
    publishDate: 'Updated Kharif 2026'
  }
];

export const SOIL_TYPE_CARDS = [
  {
    id: 'sandy',
    name: 'Sandy Soil',
    tagline: 'High drainage, low water holding',
    waterHoldingCapacity: 'Low (40-60 mm/m)',
    nutrientRetention: 'Poor (Leaches easily)',
    bestCrops: 'Groundnut, Pearl Millet, Watermelon',
    colorHex: '#D4B27B'
  },
  {
    id: 'red',
    name: 'Red Soil',
    tagline: 'Well-aerated, iron-rich, porous',
    waterHoldingCapacity: 'Moderate (70-110 mm/m)',
    nutrientRetention: 'Medium (Responsive to fertilizers)',
    bestCrops: 'Groundnut, Pulses, Millets, Oilseeds',
    colorHex: '#C86843'
  },
  {
    id: 'black',
    name: 'Black Soil (Regur)',
    tagline: 'High clay, deep moisture swelling',
    waterHoldingCapacity: 'Very High (150-220 mm/m)',
    nutrientRetention: 'Rich in lime, iron, magnesium',
    bestCrops: 'Cotton, Soybean, Sorghum, Chickpea',
    colorHex: '#3D3833'
  },
  {
    id: 'loamy',
    name: 'Loamy Soil',
    tagline: 'Balanced sand, silt, and clay',
    waterHoldingCapacity: 'Optimal (120-160 mm/m)',
    nutrientRetention: 'Excellent organic matter balance',
    bestCrops: 'Maize, Vegetables, Wheat, Sugarcane',
    colorHex: '#7C674B'
  },
  {
    id: 'clay',
    name: 'Clay Soil',
    tagline: 'Heavy density, slow percolation',
    waterHoldingCapacity: 'Extremely High (>200 mm/m)',
    nutrientRetention: 'High cation exchange capacity',
    bestCrops: 'Paddy / Rice, Jute, Wheat',
    colorHex: '#5A534A'
  },
  {
    id: 'other',
    name: 'Other / Mixed Soil',
    tagline: 'Silty, gravelly or mixed terrain',
    waterHoldingCapacity: 'Variable',
    nutrientRetention: 'Moderately responsive',
    bestCrops: 'Millets, Pulses, Cover Crops',
    colorHex: '#8C827A'
  }
];
