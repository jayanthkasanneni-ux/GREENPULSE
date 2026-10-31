import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SoilType, SoilKnowledgeLevel, IrrigationType } from '../types';
import { SOIL_TYPE_CARDS, getRegionalSoilDefault, DEFAULT_FARM_PROFILE } from '../data/mockData';
import {
  Save,
  CheckCircle2,
  Sprout,
  Droplets,
  Layers,
  FlaskConical,
  MapPin,
  User,
  RotateCcw,
  Info,
  Upload,
  FileCheck,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';

export const FarmProfilePage: React.FC = () => {
  const { farmProfile, updateFarmProfile } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadedCardName, setUploadedCardName] = useState<string | null>(
    farmProfile.soilCardFileName || null
  );

  const [form, setForm] = useState<{
    farmerName: string;
    phone: string;
    email: string;
    state: string;
    district: string;
    village: string;
    landAreaAcres: number;
    growingSeason: string;
    irrigationAvailability: IrrigationType;
    waterAvailability: string;
    soilKnowledgeLevel: SoilKnowledgeLevel;
    soilType: SoilType;
    soilPh: number | null;
    nitrogenKgHa: number | null;
    phosphorusKgHa: number | null;
    potassiumKgHa: number | null;
  }>({
    farmerName: farmProfile.farmerName,
    phone: farmProfile.phone,
    email: farmProfile.email,
    state: farmProfile.state,
    district: farmProfile.district,
    village: farmProfile.village,
    landAreaAcres: farmProfile.landAreaAcres,
    growingSeason: farmProfile.growingSeason || 'Kharif 2026',
    irrigationAvailability: farmProfile.irrigationAvailability,
    waterAvailability: farmProfile.waterAvailability || 'Moderate (3-4 hrs daily pumping)',

    // Smart Soil Identification
    soilKnowledgeLevel: farmProfile.soilKnowledgeLevel || 'know_type',
    soilType: farmProfile.soilType || 'red',
    soilPh: farmProfile.soilPh ?? 6.8,
    nitrogenKgHa: farmProfile.nitrogenKgHa ?? 245,
    phosphorusKgHa: farmProfile.phosphorusKgHa ?? 16,
    potassiumKgHa: farmProfile.potassiumKgHa ?? 210,
  });

  // Calculate regional default for Option C
  const regionalDefault = getRegionalSoilDefault(form.district);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmProfile({
      ...form,
      soilCardFileName: uploadedCardName || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setForm({
      farmerName: '',
      phone: '',
      email: '',
      state: 'Andhra Pradesh',
      district: 'Anantapur',
      village: '',
      landAreaAcres: 1,
      growingSeason: 'Kharif 2026',
      irrigationAvailability: 'rainfed',
      waterAvailability: 'Rainfed only',
      soilKnowledgeLevel: 'unknown',
      soilType: 'red',
      soilPh: null,
      nitrogenKgHa: null,
      phosphorusKgHa: null,
      potassiumKgHa: null,
    });
    setUploadedCardName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedCardName(file.name);
      // Auto-populate sensible test values from the card
      setForm(prev => ({
        ...prev,
        soilPh: 6.9,
        nitrogenKgHa: 260,
        phosphorusKgHa: 18,
        potassiumKgHa: 220,
      }));
    }
  };

  const handleLoadSampleCard = () => {
    setUploadedCardName('Soil_Health_Card_SHC_8892.pdf');
    setForm(prev => ({
      ...prev,
      soilPh: 6.8,
      nitrogenKgHa: 245,
      phosphorusKgHa: 16,
      potassiumKgHa: 210,
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Farm Records & Environmental Baseline</span>
            <span>·</span>
            <span>Last Saved: {farmProfile.lastUpdated}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Farm Profile & Soil Identification
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Maintain your farm details, water access, and soil identification method. Saved locally in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
          <span>Farm profile saved successfully in local storage! Crop models will immediately use these parameters.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Basic Farm Profile Fields */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-sm font-bold text-[#123D2A]">
              1. Farm Identification & Geography
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Farmer Name
              </label>
              <input
                type="text"
                value={form.farmerName}
                onChange={e => setForm({ ...form, farmerName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                State
              </label>
              <select
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
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
                District
              </label>
              <input
                type="text"
                value={form.district}
                onChange={e => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Village
              </label>
              <input
                type="text"
                value={form.village}
                onChange={e => setForm({ ...form, village: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Land Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                value={form.landAreaAcres}
                onChange={e => setForm({ ...form, landAreaAcres: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Growing Season
              </label>
              <select
                value={form.growingSeason}
                onChange={e => setForm({ ...form, growingSeason: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
              >
                <option value="Kharif 2026">Kharif 2026 (Monsoon / Rainfed)</option>
                <option value="Rabi 2026-27">Rabi 2026-27 (Winter)</option>
                <option value="Zaid 2026">Zaid 2026 (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Irrigation Availability
              </label>
              <select
                value={form.irrigationAvailability}
                onChange={e => setForm({ ...form, irrigationAvailability: e.target.value as IrrigationType })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
              >
                <option value="borewell">Deep Borewell (Tube well)</option>
                <option value="drip">Micro-Irrigation (Drip)</option>
                <option value="sprinkler">Sprinkler System</option>
                <option value="canal">Canal Gravity Flow</option>
                <option value="rainfed">Purely Rainfed (No Groundwater)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Water Availability
              </label>
              <select
                value={form.waterAvailability}
                onChange={e => setForm({ ...form, waterAvailability: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
              >
                <option value="Abundant (6+ hrs daily pumping)">Abundant (6+ hrs daily pumping)</option>
                <option value="Moderate (3-4 hrs daily pumping)">Moderate (3-4 hrs daily pumping)</option>
                <option value="Scarce (1-2 hrs daily pumping)">Scarce (1-2 hrs daily pumping)</option>
                <option value="Rainfed only">Rainfed only (Zero artificial storage)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: SMART SOIL IDENTIFICATION (Strict Requirement) */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#16A36A]" />
              <h2 className="text-base font-bold text-[#123D2A]">
                Smart Soil Identification
              </h2>
            </div>
            <p className="text-xs text-[#4B5E53] mt-1">
              You are never forced to enter chemical values. Choose the option that fits your current farm knowledge.
            </p>
          </div>

          {/* Primary Question: How much do you know about your soil? */}
          <div>
            <label className="block text-sm font-bold text-[#1C2922] mb-3">
              How much do you know about your soil?
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A: I know my soil type */}
              <div
                onClick={() => setForm({ ...form, soilKnowledgeLevel: 'know_type' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.soilKnowledgeLevel === 'know_type'
                    ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123D2A]">
                    Option A: I know my soil type
                  </span>
                  {form.soilKnowledgeLevel === 'know_type' && (
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  )}
                </div>
                <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                  Choose visual soil category (Red, Black, Sandy, Clay, Loamy, or Other). No lab tests required.
                </p>
              </div>

              {/* Option B: I have a Soil Health Card */}
              <div
                onClick={() => setForm({ ...form, soilKnowledgeLevel: 'have_card' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.soilKnowledgeLevel === 'have_card'
                    ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123D2A]">
                    Option B: I have a Soil Health Card
                  </span>
                  {form.soilKnowledgeLevel === 'have_card' && (
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  )}
                </div>
                <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                  Enter available pH or N-P-K readings manually, or upload your document. Missing values are optional.
                </p>
              </div>

              {/* Option C: I don't know my soil details */}
              <div
                onClick={() => setForm({ ...form, soilKnowledgeLevel: 'unknown' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.soilKnowledgeLevel === 'unknown'
                    ? 'border-[#123D2A] bg-emerald-50/50 ring-2 ring-[#16A36A]/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-[#F7F9F5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123D2A]">
                    Option C: I don&apos;t know my soil details
                  </span>
                  {form.soilKnowledgeLevel === 'unknown' && (
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  )}
                </div>
                <p className="text-xs text-[#4B5E53] mt-1.5 leading-snug">
                  Continue immediately. We automatically estimate soil characteristics from regional district baselines.
                </p>
              </div>
            </div>
          </div>

          {/* Path A Content: Soil Type Selector */}
          {form.soilKnowledgeLevel === 'know_type' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
              <label className="block text-xs font-bold text-[#1C2922]">
                Select your primary soil type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SOIL_TYPE_CARDS.map(soil => (
                  <div
                    key={soil.id}
                    onClick={() => setForm({ ...form, soilType: soil.id as SoilType })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                      form.soilType === soil.id
                        ? 'border-[#123D2A] bg-emerald-50/60 ring-2 ring-[#16A36A]/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: soil.colorHex }} />
                        {form.soilType === soil.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />}
                      </div>
                      <div className="text-xs font-bold text-[#123D2A] mt-2">{soil.name}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{soil.tagline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Path B Content: Soil Health Card Manual Entry / Upload */}
          {form.soilKnowledgeLevel === 'have_card' && (
            <div className="space-y-5 pt-2 border-t border-slate-100 animate-in fade-in">
              {/* Optional Document Upload UI */}
              <div className="p-4 rounded-xl border border-dashed border-[#16A36A]/40 bg-emerald-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#16A36A]/10 text-[#16A36A]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#123D2A]">
                      {uploadedCardName ? `Uploaded: ${uploadedCardName}` : 'Optional Soil Health Card Document'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Upload your official Government Soil Health Card (PDF or Photo) to auto-fill.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1A543B] rounded-lg cursor-pointer transition-colors">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleCard}
                    className="px-3 py-1.5 text-xs font-semibold text-[#16A36A] bg-white border border-[#16A36A]/30 rounded-lg hover:bg-emerald-50 cursor-pointer"
                  >
                    Auto-Fill Demo Card
                  </button>
                </div>
              </div>

              {/* Manual Optional Fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1C2922]">
                    Available Chemical Test Values (All fields optional):
                  </span>
                  <span className="text-[11px] text-slate-400">Leave blank if not listed on your card</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                      Soil pH (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="4"
                      max="10"
                      value={form.soilPh ?? ''}
                      onChange={e => setForm({ ...form, soilPh: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g. 6.8"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Optimal range: 6.5 - 7.5</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                      Nitrogen N (kg/ha)
                    </label>
                    <input
                      type="number"
                      value={form.nitrogenKgHa ?? ''}
                      onChange={e => setForm({ ...form, nitrogenKgHa: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="e.g. 245"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 280 - 560</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                      Phosphorus P (kg/ha)
                    </label>
                    <input
                      type="number"
                      value={form.phosphorusKgHa ?? ''}
                      onChange={e => setForm({ ...form, phosphorusKgHa: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="e.g. 16"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 10 - 25</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
                    <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                      Potassium K (kg/ha)
                    </label>
                    <input
                      type="number"
                      value={form.potassiumKgHa ?? ''}
                      onChange={e => setForm({ ...form, potassiumKgHa: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="e.g. 210"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 110 - 280</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Path C Content: I don't know my soil details */}
          {form.soilKnowledgeLevel === 'unknown' && (
            <div className="p-5 rounded-xl bg-[#F7F9F5] border border-slate-200 space-y-4 pt-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-[#16A36A] shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#123D2A]">
                    Automated Regional Soil Baseline for {form.district} ({form.state})
                  </h3>
                  <p className="text-xs text-[#4B5E53] mt-1 leading-relaxed">
                    You can proceed with full crop planning right now. GREENPULSE will apply the default profile: <strong className="text-[#123D2A]">{regionalDefault.name}</strong> (Estimated pH ~{regionalDefault.estimatedPh}).
                  </p>
                  <p className="text-xs text-slate-500 mt-1 italic">
                    {regionalDefault.description}
                  </p>
                </div>
              </div>

              {/* Explanatory box: How to get a Soil Health Card */}
              <div className="pt-3 border-t border-slate-200/60 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">How to get a Government Soil Health Card:</strong>
                  <p className="mt-0.5">
                    1. Collect 8–10 representative topsoil scoops (0–15 cm depth) from your field.
                    <br />
                    2. Mix thoroughly and submit a 500g sample to your nearest <strong>Krishi Vigyan Kendra (KVK)</strong> or Assistant Director of Agriculture (ADA) lab.
                    <br />
                    3. Tests are subsidized by the Ministry of Agriculture, Government of India.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit / Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#B7E36B]" />
            <span>Save Farm Profile</span>
          </button>
        </div>
      </form>

      <DemoDisclaimer />
    </div>
  );
};
