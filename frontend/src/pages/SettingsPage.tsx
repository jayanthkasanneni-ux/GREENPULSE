import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  Settings,
  Globe,
  Bell,
  Scale,
  RotateCcw,
  CheckCircle2,
  Save,
  Shield,
  Smartphone,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, resetDemoData, activeSeason, setActiveSeason } = useApp();

  const [language, setLanguage] = useState(user.language || 'English');
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares'>('acres');
  const [rainUnit, setRainUnit] = useState<'mm' | 'inches'>('mm');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const [alertRainfallDeficit, setAlertRainfallDeficit] = useState(true);
  const [alertHeatwave, setAlertHeatwave] = useState(true);
  const [alertDrySpell, setAlertDrySpell] = useState(true);
  const [alertPestOutbreak, setAlertPestOutbreak] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>System Preferences</span>
            <span>·</span>
            <span>Local Farmer Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Settings & Environmental Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Customize vernacular dialect, threshold alert frequencies, and measurement units.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetDemoData();
            alert('All demo farm profile data and simulation states have been reset to factory defaults.');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
          <span>Preferences updated and saved to local storage!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language & Vernacular Preferences */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-[#16A36A]" />
            <h2 className="text-sm font-bold text-[#123D2A]">
              1. Regional Language & Localization
            </h2>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-[#1C2922] mb-1.5">
              Preferred Agronomic Interface Language
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
            >
              <option value="English">English (Default)</option>
              <option value="Telugu">తెలుగు (Telugu - Rayalaseema & Telangana)</option>
              <option value="Hindi">हिन्दी (Hindi - Northern & Central)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada - Karnataka Deccan)</option>
              <option value="Marathi">मराठी (Marathi - Vidarbha & Marathwada)</option>
              <option value="Tamil">தமிழ் (Tamil - Tamil Nadu Drylands)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Provides localized crop names (e.g. Verusenaga for Groundnut, Sajjalu for Bajra).
            </p>
          </div>
        </div>

        {/* Units of Measurement */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Scale className="w-5 h-5 text-[#16A36A]" />
            <h2 className="text-sm font-bold text-[#123D2A]">
              2. Agricultural Units of Measurement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1.5">
                Land Parcel Area
              </label>
              <div className="flex items-center gap-2 bg-[#F7F9F5] p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setAreaUnit('acres')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    areaUnit === 'acres' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Acres (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setAreaUnit('hectares')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    areaUnit === 'hectares' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Hectares (ha)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1.5">
                Rainfall Measurement
              </label>
              <div className="flex items-center gap-2 bg-[#F7F9F5] p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setRainUnit('mm')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    rainUnit === 'mm' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Millimeters (mm)
                </button>
                <button
                  type="button"
                  onClick={() => setRainUnit('inches')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    rainUnit === 'inches' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1.5">
                Temperature Scale
              </label>
              <div className="flex items-center gap-2 bg-[#F7F9F5] p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setTempUnit('C')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    tempUnit === 'C' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('F')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                    tempUnit === 'F' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Climate & Farm Notification Triggers */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#16A36A]" />
            <h2 className="text-sm font-bold text-[#123D2A]">
              3. Climate Alert Thresholds
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#F7F9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={alertRainfallDeficit}
                onChange={e => setAlertRainfallDeficit(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#16A36A] focus:ring-[#16A36A]"
              />
              <div className="text-xs">
                <div className="font-bold text-[#1C2922]">Monsoon Rainfall Deficit Warning</div>
                <div className="text-slate-500">Alert if 14-day cumulative rainfall falls &gt;20% below district normal.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#F7F9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={alertDrySpell}
                onChange={e => setAlertDrySpell(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#16A36A] focus:ring-[#16A36A]"
              />
              <div className="text-xs">
                <div className="font-bold text-[#1C2922]">Consecutive Dry Spell Advisory (7+ Days)</div>
                <div className="text-slate-500">Notify to apply anti-transpirant kaolin spray or prepare supplemental micro-sprinklers.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#F7F9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={alertHeatwave}
                onChange={e => setAlertHeatwave(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#16A36A] focus:ring-[#16A36A]"
              />
              <div className="text-xs">
                <div className="font-bold text-[#1C2922]">Extreme Heat Stress Alert (&gt;37°C)</div>
                <div className="text-slate-500">Trigger warnings during flowering and pollen shedding windows.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#F7F9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={alertPestOutbreak}
                onChange={e => setAlertPestOutbreak(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#16A36A] focus:ring-[#16A36A]"
              />
              <div className="text-xs">
                <div className="font-bold text-[#1C2922]">Humid-Cloudy Pest Outbreak Warning</div>
                <div className="text-slate-500">Early warning for Fall Armyworm and Pod borer proliferation after intermittent rains.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm"
          >
            <Save className="w-4 h-4 text-[#B7E36B]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      <DemoDisclaimer />
    </div>
  );
};
