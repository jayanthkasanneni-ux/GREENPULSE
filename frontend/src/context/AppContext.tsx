import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmProfile, CropRecommendation, PlanningWizardState, SoilType } from '../types';
import { DEFAULT_FARM_PROFILE, SAMPLE_CROPS, getRegionalSoilDefault } from '../data/mockData';

interface UserAuth {
  name: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  isAuthenticated: boolean;
}

interface AppContextType {
  user: UserAuth;
  login: (email: string, name?: string) => void;
  logout: () => void;
  register: (userData: Omit<UserAuth, 'isAuthenticated'>) => void;
  farmProfile: FarmProfile;
  updateFarmProfile: (updated: Partial<FarmProfile>) => void;
  crops: CropRecommendation[];
  selectedCropsForComparison: string[];
  toggleCropComparison: (id: string) => void;
  setComparisonCrops: (ids: string[]) => void;
  activeSeason: string;
  setActiveSeason: (season: string) => void;
  activeLocation: { state: string; district: string };
  setActiveLocation: (loc: { state: string; district: string }) => void;
  wizardState: PlanningWizardState;
  updateWizardState: (partial: Partial<PlanningWizardState>) => void;
  generateRecommendationsFromWizard: (state: PlanningWizardState) => void;
  resetDemoData: () => void;
}

const DEFAULT_WIZARD: PlanningWizardState = {
  step: 1,
  state: 'Andhra Pradesh',
  district: 'Anantapur',
  season: 'Kharif (Monsoon)',
  landArea: 4.5,
  soilKnowledgeLevel: 'know_type',
  soilType: 'red',
  soilPh: 6.8,
  nitrogenLevel: 'medium',
  phosphorusLevel: 'medium',
  potassiumLevel: 'medium',
  waterSource: 'borewell',
  waterReliability: 'moderate',
  riskTolerance: 'balanced',
  monsoonForecastAssumption: 'normal',
  completed: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Authentication
  const [user, setUser] = useState<UserAuth>(() => {
    const saved = localStorage.getItem('greenpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'Rameshwar Reddy',
      email: 'rameshwar.reddy@agrimail.in',
      phone: '+91 98490 23411',
      location: 'Anantapur, Andhra Pradesh',
      language: 'English',
      isAuthenticated: true,
    };
  });

  // Farm Profile
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() => {
    const saved = localStorage.getItem('greenpulse_farm_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_FARM_PROFILE;
  });

  // Crops recommendations list
  const [crops, setCrops] = useState<CropRecommendation[]>(() => {
    const saved = localStorage.getItem('greenpulse_crops');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_CROPS;
  });

  // Comparison crop selection (limit to 3)
  const [selectedCropsForComparison, setSelectedCropsForComparison] = useState<string[]>(() => {
    const saved = localStorage.getItem('greenpulse_comparison');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['crop-groundnut', 'crop-millets', 'crop-maize'];
  });

  const [activeSeason, setActiveSeason] = useState<string>('Kharif 2026');
  const [activeLocation, setActiveLocation] = useState<{ state: string; district: string }>({
    state: 'Andhra Pradesh',
    district: 'Anantapur',
  });

  const [wizardState, setWizardState] = useState<PlanningWizardState>(() => {
    const saved = localStorage.getItem('greenpulse_wizard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_WIZARD;
  });

  // Persist states
  useEffect(() => {
    localStorage.setItem('greenpulse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('greenpulse_farm_profile', JSON.stringify(farmProfile));
  }, [farmProfile]);

  useEffect(() => {
    localStorage.setItem('greenpulse_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('greenpulse_comparison', JSON.stringify(selectedCropsForComparison));
  }, [selectedCropsForComparison]);

  useEffect(() => {
    localStorage.setItem('greenpulse_wizard', JSON.stringify(wizardState));
  }, [wizardState]);

  const login = (email: string, name = 'Farmer Member') => {
    setUser({
      name,
      email,
      phone: '+91 98490 23411',
      location: `${activeLocation.district}, ${activeLocation.state}`,
      language: 'English',
      isAuthenticated: true,
    });
  };

  const register = (userData: Omit<UserAuth, 'isAuthenticated'>) => {
    setUser({
      ...userData,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isAuthenticated: false }));
  };

  const updateFarmProfile = (updated: Partial<FarmProfile>) => {
    setFarmProfile(prev => {
      const next = { ...prev, ...updated, lastUpdated: new Date().toISOString().split('T')[0] };
      return next;
    });
  };

  const toggleCropComparison = (id: string) => {
    setSelectedCropsForComparison(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter(c => c !== id);
      } else {
        if (prev.length >= 3) {
          // Replace the last one
          return [prev[0], prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  const setComparisonCrops = (ids: string[]) => {
    setSelectedCropsForComparison(ids.slice(0, 3));
  };

  const updateWizardState = (partial: Partial<PlanningWizardState>) => {
    setWizardState(prev => ({ ...prev, ...partial }));
  };

  const generateRecommendationsFromWizard = (state: PlanningWizardState) => {
    // Determine effective soil type:
    let effectiveSoil: SoilType = state.soilType;
    if (state.soilKnowledgeLevel === 'unknown') {
      const regionalDefault = getRegionalSoilDefault(state.district || activeLocation.district);
      effectiveSoil = regionalDefault.soilType;
    }

    // Dynamic scoring adjustment based on wizard selections
    const adjusted = SAMPLE_CROPS.map(crop => {
      let scoreModifier = 0;

      // Soil adjustment
      if (effectiveSoil === 'sandy') {
        if (crop.id === 'crop-groundnut' || crop.id === 'crop-millets') scoreModifier += 7;
        if (crop.id === 'crop-rice') scoreModifier -= 25;
        if (crop.id === 'crop-maize') scoreModifier -= 8;
      } else if (effectiveSoil === 'black') {
        if (crop.id === 'crop-cotton') scoreModifier += 12;
        if (crop.id === 'crop-pulses') scoreModifier += 6;
        if (crop.id === 'crop-groundnut') scoreModifier -= 5;
      } else if (effectiveSoil === 'clay') {
        if (crop.id === 'crop-rice') scoreModifier += 14;
        if (crop.id === 'crop-groundnut') scoreModifier -= 15;
      } else if (effectiveSoil === 'red') {
        if (crop.id === 'crop-groundnut') scoreModifier += 8;
        if (crop.id === 'crop-millets') scoreModifier += 6;
      }

      // Water adjustment
      if (state.waterReliability === 'scarce' || state.waterReliability === 'rainfed_only') {
        if (crop.waterDemand === 'low') scoreModifier += 8;
        if (crop.waterDemand === 'high') scoreModifier -= 30;
      } else if (state.waterReliability === 'abundant') {
        if (crop.category === 'Cereal' || crop.category === 'Fiber') scoreModifier += 6;
      }

      // Risk tolerance adjustment
      if (state.riskTolerance === 'conservative') {
        if (crop.riskLevel === 'low') scoreModifier += 5;
        if (crop.riskLevel === 'high') scoreModifier -= 20;
      } else if (state.riskTolerance === 'high_yield') {
        if (crop.id === 'crop-maize' || crop.id === 'crop-cotton') scoreModifier += 10;
      }

      const finalScore = Math.max(35, Math.min(98, crop.suitabilityScore + scoreModifier));
      let finalRisk = crop.riskLevel;
      if (finalScore >= 82) finalRisk = 'low';
      else if (finalScore >= 68) finalRisk = 'moderate';
      else finalRisk = 'high';

      return {
        ...crop,
        suitabilityScore: finalScore,
        riskLevel: finalRisk,
      };
    });

    // Sort by suitability descending
    adjusted.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    setCrops(adjusted);
    setWizardState(prev => ({ ...prev, ...state, completed: true }));
  };

  const resetDemoData = () => {
    setFarmProfile(DEFAULT_FARM_PROFILE);
    setCrops(SAMPLE_CROPS);
    setSelectedCropsForComparison(['crop-groundnut', 'crop-millets', 'crop-maize']);
    setWizardState(DEFAULT_WIZARD);
    localStorage.removeItem('greenpulse_farm_profile');
    localStorage.removeItem('greenpulse_crops');
    localStorage.removeItem('greenpulse_comparison');
    localStorage.removeItem('greenpulse_wizard');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        farmProfile,
        updateFarmProfile,
        crops,
        selectedCropsForComparison,
        toggleCropComparison,
        setComparisonCrops,
        activeSeason,
        setActiveSeason,
        activeLocation,
        setActiveLocation,
        wizardState,
        updateWizardState,
        generateRecommendationsFromWizard,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
