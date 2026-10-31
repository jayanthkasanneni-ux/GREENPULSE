export type SoilType = 'red' | 'black' | 'sandy' | 'clay' | 'loamy' | 'other';
export type SoilKnowledgeLevel = 'know_type' | 'have_card' | 'unknown';
export type IrrigationType = 'rainfed' | 'borewell' | 'canal' | 'drip' | 'sprinkler';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type WaterDemand = 'low' | 'moderate' | 'high';
export type Season = 'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)';

export interface FarmProfile {
  id: string;
  farmerName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  village: string;
  landAreaAcres: number;
  growingSeason: string;
  irrigationAvailability: IrrigationType;
  waterAvailability: string; // 'Abundant' | 'Moderate' | 'Scarce' | 'Rainfed only'
  
  // Smart Soil Identification
  soilKnowledgeLevel: SoilKnowledgeLevel;
  soilType: SoilType;
  soilPh: number | null;
  nitrogenKgHa: number | null;
  phosphorusKgHa: number | null;
  potassiumKgHa: number | null;
  soilCardFileName?: string;
  
  lastUpdated: string;
}

export interface CropRiskDetail {
  category: 'Drought' | 'Heat Stress' | 'Excess Rainfall' | 'Pest Outbreak' | 'Soil Mismatch';
  severity: RiskLevel;
  explanation: string;
  mitigation: string;
}

export interface CropRecommendation {
  id: string;
  name: string;
  botanicalName: string;
  localName: string;
  category: 'Cereal' | 'Millet' | 'Legume/Pulse' | 'Oilseed' | 'Fiber';
  image: string;
  suitabilityScore: number; // 0-100
  riskLevel: RiskLevel;
  waterDemand: WaterDemand;
  growingDurationDays: string;
  optimalTemperature: string;
  optimalRainfallMm: string;
  soilCompatibility: string;
  estimatedYieldRange: string;
  reasonsForRecommendation: string[];
  climateRisks: CropRiskDetail[];
  agronomicAdvisory: {
    recommendedWindow: string;
    seedRate: string;
    criticalWaterStages: string[];
    fertilizerRecommendation: string;
    climateContingency: string;
  };
  economics: {
    estimatedCostPerAcre: number;
    expectedRevenuePerAcre: number;
    minimumSupportPriceAvailable: boolean;
  };
}

export interface ClimateMetric {
  month: string;
  rainfallCurrentMm: number;
  rainfallHistoricalNormalMm: number;
  tempMaxC: number;
  tempMinC: number;
  tempHistoricalMaxC: number;
  drySpellDays: number;
}

export interface PlanningWizardState {
  step: number;
  state: string;
  district: string;
  season: Season;
  landArea: number;
  
  // Smart Soil Step
  soilKnowledgeLevel: SoilKnowledgeLevel;
  soilType: SoilType;
  soilPh: number | null;
  nitrogenLevel: 'low' | 'medium' | 'high' | 'not_tested';
  phosphorusLevel: 'low' | 'medium' | 'high' | 'not_tested';
  potassiumLevel: 'low' | 'medium' | 'high' | 'not_tested';
  
  waterSource: IrrigationType;
  waterReliability: 'abundant' | 'moderate' | 'scarce' | 'rainfed_only';
  riskTolerance: 'conservative' | 'balanced' | 'high_yield';
  monsoonForecastAssumption: 'normal' | 'delayed_onset' | 'deficit_rainfall' | 'excess_rainfall';
  completed: boolean;
}

export interface AgronomicGuide {
  id: string;
  title: string;
  category: 'Planting Windows' | 'Water Management' | 'Soil Improvement' | 'Drought Defense' | 'Heat Mitigation';
  applicableCrops: string[];
  summary: string;
  keyPractices: string[];
  sourceAttribution: string;
  publishDate: string;
}
