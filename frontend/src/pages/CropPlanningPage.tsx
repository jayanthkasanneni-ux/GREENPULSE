import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SoilType, SoilKnowledgeLevel, IrrigationType, Season } from '../types';
import { SOIL_TYPE_CARDS, getRegionalSoilDefault } from '../data/mockData';
import {
  Compass,
  MapPin,
  Calendar,
  Layers,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CloudSun,
  AlertTriangle,
  Info,
  FlaskConical,
  Upload,
  HelpCircle,
} from 'lucide-react';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';

export const CropPlanningPage: React.FC = () => {
  const { wizardState, updateWizardState, generateRecommendationsFromWizard, farmProfile } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(wizardState.step || 1);
  const [formData, setFormData] = useState<{
    state: string;
    district: string;
    season: Season;
    landArea: number;
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
  }>({
    state: wizardState.state || farmProfile.state,
    district: wizardState.district || farmProfile.district,
    season: (wizardState.season || 'Kharif (Monsoon)') as Season,
    landArea: wizardState.landArea || farmProfile.landAreaAcres,
    
    // Smart Soil Identification
    soilKnowledgeLevel: (wizardState.soilKnowledgeLevel || farmProfile.soilKnowledgeLevel || 'know_type') as SoilKnowledgeLevel,
    soilType: (wizardState.soilType || farmProfile.soilType || 'red') as SoilType,
    soilPh: (wizardState.soilPh ?? farmProfile.soilPh ?? 6.8) as number | null,
    nitrogenLevel: wizardState.nitrogenLevel || 'medium',
    phosphorusLevel: wizardState.phosphorusLevel || 'medium',
    potassiumLevel: wizardState.potassiumLevel || 'medium',

    waterSource: (wizardState.waterSource || farmProfile.irrigationAvailability) as IrrigationType,
    waterReliability: wizardState.waterReliability || 'moderate',
    riskTolerance: wizardState.riskTolerance || 'balanced',
    monsoonForecastAssumption: wizardState.monsoonForecastAssumption || 'normal',
  });

  const [uploadedCardName, setUploadedCardName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const stepTitles = [
    { num: 1, title: 'Location & Season', desc: 'Agro-climatic zone' },
    { num: 2, title: 'Soil Identification', desc: 'Smart 3-path assessment' },
    { num: 3, title: 'Water Access', desc: 'Hydraulic security' },
    { num: 4, title: 'Climate & Risk', desc: 'Tolerance preferences' },
    { num: 5, title: 'Review & Model', desc: 'Generate decision matrix' },
  ];

  const regionalDefault = getRegionalSoilDefault(formData.district);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.district.trim()) {
        setErrorMsg('Please specify your district name.');
        return;
      }
    }
    if (step < 5) {
      const nextStep = step + 1;
      setStep(nextStep);
      updateWizardState({ ...formData, step: nextStep });
    } else {
      // Step 5 Submit: Generate Crop Analysis and navigate to recommendations
      generateRecommendationsFromWizard({
        ...formData,
        step: 5,
        completed: true,
      });
      navigate('/dashboard/recommendations');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      updateWizardState({ ...formData, step: prevStep });
    }
  };

  const handleCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedCardName(file.name);
      setFormData(prev => ({
        ...prev,
        soilPh: 6.8,
        nitrogenLevel: 'medium',
        phosphorusLevel: 'medium',
        potassiumLevel: 'medium',
      }));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Wizard Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Decision Support Engine</span>
            <span>·</span>
            <span>Step {step} of 5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Climate-Resilient Crop Planning Wizard
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Simulate seasonal suitability for your specific micro-climate, soil characteristics, and water security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#16A36A] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            {Math.round((step / 5) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
          {stepTitles.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={`flex flex-col items-center text-center group ${
                  s.num < step ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isCompleted
                      ? 'bg-[#16A36A] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#123D2A] text-white ring-4 ring-[#16A36A]/20'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : s.num}
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight ${
                    isCurrent ? 'text-[#123D2A]' : isCompleted ? 'text-[#16A36A]' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
                <span className="hidden sm:inline text-[10px] text-slate-400 mt-0.5">
                  {s.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Contents */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 sm:p-8 shadow-xs">
        {/* Step 1: Location & Season */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Step 1: Agro-Ecological Location & Growing Season
              </h2>
            </div>

            <p className="text-xs text-[#4B5E53]">
              GREENPULSE matches regional historical monsoon isohyets and temperature variations based on your target district.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  State / Region
                </label>
                <select
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  District Name
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Anantapur"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Target Sowing Season
                </label>
                <select
                  value={formData.season}
                  onChange={e => setFormData({ ...formData, season: e.target.value as Season })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                >
                  <option value="Kharif (Monsoon)">Kharif (Monsoon / Rain-fed)</option>
                  <option value="Rabi (Winter)">Rabi (Post-Monsoon / Winter)</option>
                  <option value="Zaid (Summer)">Zaid (Summer Short Duration)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Proposed Cultivation Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="50"
                  value={formData.landArea}
                  onChange={e => setFormData({ ...formData, landArea: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: SMART SOIL IDENTIFICATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FlaskConical className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Step 2: Smart Soil Identification
              </h2>
            </div>

            {/* Strict Question */}
            <div>
              <label className="block text-sm font-bold text-[#1C2922] mb-2">
                How much do you know about your soil?
              </label>
              <p className="text-xs text-[#4B5E53] mb-4">
                You are never forced to enter chemical numbers. Select the path that fits:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, soilKnowledgeLevel: 'know_type' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.soilKnowledgeLevel === 'know_type'
                      ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#123D2A]">
                      Option A: I know my soil type
                    </span>
                    {formData.soilKnowledgeLevel === 'know_type' && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                    Pick your visual soil category (Red, Black, Sandy, Clay, Loamy, or Other).
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, soilKnowledgeLevel: 'have_card' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.soilKnowledgeLevel === 'have_card'
                      ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#123D2A]">
                      Option B: I have a Soil Health Card
                    </span>
                    {formData.soilKnowledgeLevel === 'have_card' && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                    Enter available pH and N-P-K ratings. Missing fields are strictly optional.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, soilKnowledgeLevel: 'unknown' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.soilKnowledgeLevel === 'unknown'
                      ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#123D2A]">
                      Option C: I don&apos;t know my soil details
                    </span>
                    {formData.soilKnowledgeLevel === 'unknown' && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                    Continue without soil data. Regional baseline for {formData.district} will be used.
                  </p>
                </div>
              </div>
            </div>

            {/* Path A */}
            {formData.soilKnowledgeLevel === 'know_type' && (
              <div className="pt-2 border-t border-slate-100 space-y-3 animate-in fade-in">
                <label className="block text-xs font-bold text-[#1C2922]">
                  Select your primary soil type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {SOIL_TYPE_CARDS.map(soil => (
                    <div
                      key={soil.id}
                      onClick={() => setFormData({ ...formData, soilType: soil.id as SoilType })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.soilType === soil.id
                          ? 'border-[#123D2A] bg-emerald-50/60 ring-2 ring-[#16A36A]/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: soil.colorHex }} />
                        {formData.soilType === soil.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />}
                      </div>
                      <div className="text-xs font-bold text-[#123D2A] mt-1.5">{soil.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Path B */}
            {formData.soilKnowledgeLevel === 'have_card' && (
              <div className="pt-2 border-t border-slate-100 space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-xl border border-dashed border-[#16A36A]/40 bg-emerald-50/20 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    <strong className="text-[#123D2A]">Optional Document Upload:</strong>
                    <div className="text-[11px] text-slate-500">
                      {uploadedCardName ? `Selected: ${uploadedCardName}` : 'Upload photo or PDF of your Soil Card'}
                    </div>
                  </div>
                  <label className="px-3 py-1.5 text-xs font-semibold text-white bg-[#123D2A] rounded-lg cursor-pointer hover:bg-[#1A543B]">
                    <span>Upload Card</span>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCardUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">Soil pH (Opt.)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="4"
                      max="10"
                      value={formData.soilPh ?? ''}
                      onChange={e => setFormData({ ...formData, soilPh: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g. 6.8"
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">Nitrogen (N)</label>
                    <select
                      value={formData.nitrogenLevel}
                      onChange={e => setFormData({ ...formData, nitrogenLevel: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white"
                    >
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      <option value="high">High</option>
                      <option value="not_tested">Not Tested</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">Phosphorus (P)</label>
                    <select
                      value={formData.phosphorusLevel}
                      onChange={e => setFormData({ ...formData, phosphorusLevel: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white"
                    >
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      <option value="high">High</option>
                      <option value="not_tested">Not Tested</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">Potassium (K)</label>
                    <select
                      value={formData.potassiumLevel}
                      onChange={e => setFormData({ ...formData, potassiumLevel: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white"
                    >
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      <option value="high">High</option>
                      <option value="not_tested">Not Tested</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Path C */}
            {formData.soilKnowledgeLevel === 'unknown' && (
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 space-y-2 animate-in fade-in text-xs">
                <div className="flex items-center gap-2 font-bold text-[#123D2A]">
                  <Info className="w-4 h-4 text-[#16A36A]" />
                  <span>Applying district soil default: {regionalDefault.name}</span>
                </div>
                <p className="text-slate-600">
                  {regionalDefault.description} (Estimated pH: {regionalDefault.estimatedPh})
                </p>
                <p className="text-slate-500 pt-1">
                  Tip: You can visit your local Krishi Vigyan Kendra (KVK) to get a free soil health test for future seasons.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Water Availability */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Droplets className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Step 3: Farm Water Security & Irrigation Access
              </h2>
            </div>

            <p className="text-xs text-[#4B5E53]">
              Identifies whether your parcel can support water-intensive crops or requires deficit-tolerant varieties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Primary Irrigation Method
                </label>
                <select
                  value={formData.waterSource}
                  onChange={e => setFormData({ ...formData, waterSource: e.target.value as IrrigationType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                >
                  <option value="borewell">Deep Borewell (Tube well)</option>
                  <option value="drip">Micro-Irrigation (Drip)</option>
                  <option value="sprinkler">Sprinkler System</option>
                  <option value="canal">Canal Gravity Flow</option>
                  <option value="rainfed">Purely Rainfed (Monsoon Dependent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Water Availability Reliability
                </label>
                <select
                  value={formData.waterReliability}
                  onChange={e => setFormData({ ...formData, waterReliability: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                >
                  <option value="abundant">Abundant (8+ hours daily pumping or assured canal)</option>
                  <option value="moderate">Moderate (3-5 hours daily pumping with seasonal dip)</option>
                  <option value="scarce">Scarce (1-2 hours daily or intermittent drying)</option>
                  <option value="rainfed_only">Rainfed Only (Zero artificial backup)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Climate Preferences & Risk Tolerance */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Step 4: Climate Scenarios & Risk Tolerance
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Farmer Risk Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, riskTolerance: 'conservative' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.riskTolerance === 'conservative'
                        ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#123D2A]">Conservative (Climate First)</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Minimizes crop loss risk. Prioritizes drought-resistant millets and pulses.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, riskTolerance: 'balanced' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.riskTolerance === 'balanced'
                        ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#123D2A]">Balanced (Recommended)</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Optimizes between dependable yield safety and market profitability.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, riskTolerance: 'high_yield' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.riskTolerance === 'high_yield'
                        ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#123D2A]">High Commercial Yield</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Willing to accept moderate climate risk for higher revenue potential.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                  Monsoon Forecast Assumption for Modeling
                </label>
                <select
                  value={formData.monsoonForecastAssumption}
                  onChange={e => setFormData({ ...formData, monsoonForecastAssumption: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                >
                  <option value="normal">Normal Monsoon Onset (Standard 10-Yr pattern)</option>
                  <option value="delayed_onset">Delayed Onset (15-20 days late rains)</option>
                  <option value="deficit_rainfall">Deficit Rainfall (-20% seasonal volume)</option>
                  <option value="excess_rainfall">Excess Rainfall (+25% torrential surges)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Generate */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Step 5: Review Farm Configuration & Generate Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Location & Season</span>
                <p className="text-sm font-bold text-[#123D2A] mt-1">{formData.district}, {formData.state}</p>
                <p className="text-slate-600 mt-0.5">{formData.season} · {formData.landArea} Acres</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Soil Identification</span>
                <p className="text-sm font-bold text-[#123D2A] mt-1 capitalize">
                  {formData.soilKnowledgeLevel === 'unknown' ? regionalDefault.name : `${formData.soilType} Soil`}
                </p>
                <p className="text-slate-600 mt-0.5">
                  {formData.soilKnowledgeLevel === 'have_card' ? 'Soil Health Card' : formData.soilKnowledgeLevel === 'know_type' ? 'Visual Category' : 'Regional Default'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Water Reliability</span>
                <p className="text-sm font-bold text-[#123D2A] mt-1 capitalize">{formData.waterSource}</p>
                <p className="text-slate-600 mt-0.5 capitalize">{formData.waterReliability.replace('_', ' ')}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Decision Profile</span>
                <p className="text-sm font-bold text-[#123D2A] mt-1 capitalize">{formData.riskTolerance} Strategy</p>
                <p className="text-slate-600 mt-0.5 capitalize">{formData.monsoonForecastAssumption.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-[#123D2A]">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                Ready to synthesize crop suitability results
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Clicking &quot;Generate Crop Analysis&quot; will compute suitability scores for 6 candidates, calibrate individual climate vulnerability vectors, and navigate directly to your crop results.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#123D2A] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>{step === 5 ? 'Generate Crop Analysis' : 'Continue to Next Step'}</span>
            <ArrowRight className="w-4 h-4 text-[#B7E36B]" />
          </button>
        </div>
      </div>

      <DemoDisclaimer />
    </div>
  );
};
