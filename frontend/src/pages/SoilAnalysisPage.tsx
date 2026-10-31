import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SOIL_TYPE_CARDS, getRegionalSoilDefault } from '../data/mockData';
import { MetricCard } from '../components/common/MetricCard';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  FlaskConical,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

export const SoilAnalysisPage: React.FC = () => {
  const { farmProfile } = useApp();

  const regionalDefault = getRegionalSoilDefault(farmProfile.district);
  const effectiveSoilType = farmProfile.soilKnowledgeLevel === 'unknown' ? regionalDefault.soilType : farmProfile.soilType;
  const activeSoilInfo = SOIL_TYPE_CARDS.find(s => s.id === effectiveSoilType) || SOIL_TYPE_CARDS[1];

  const currentPh = farmProfile.soilPh ?? regionalDefault.estimatedPh ?? 6.8;
  const currentN = farmProfile.nitrogenKgHa ?? 245;
  const currentP = farmProfile.phosphorusKgHa ?? 16;
  const currentK = farmProfile.potassiumKgHa ?? 210;

  // NPK comparison chart data
  const nutrientData = [
    {
      nutrient: 'Nitrogen (N)',
      current: currentN,
      optimalMin: 280,
      optimalMax: 560,
      unit: 'kg/ha',
      status: currentN < 280 ? 'Low' : currentN <= 560 ? 'Medium' : 'High',
      color: currentN < 280 ? '#d97706' : '#16A36A',
    },
    {
      nutrient: 'Phosphorus (P)',
      current: currentP,
      optimalMin: 10,
      optimalMax: 25,
      unit: 'kg/ha',
      status: currentP < 10 ? 'Low' : currentP <= 25 ? 'Medium' : 'High',
      color: currentP < 10 ? '#d97706' : '#16A36A',
    },
    {
      nutrient: 'Potassium (K)',
      current: currentK,
      optimalMin: 110,
      optimalMax: 280,
      unit: 'kg/ha',
      status: currentK < 110 ? 'Low' : currentK <= 280 ? 'Medium' : 'High',
      color: currentK < 110 ? '#d97706' : '#16A36A',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Soil Health & Fertility Diagnostics</span>
            <span>·</span>
            <span>{farmProfile.district} ({farmProfile.state})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Soil Analysis & Nutrient Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Electrochemical pH assessment, primary macro-nutrient status, and practical organic fertility guidance.
          </p>
        </div>

        <Link
          to="/dashboard/farm-profile"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#123D2A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <span>Update Soil Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Soil Knowledge Level Notice Banner */}
      {farmProfile.soilKnowledgeLevel === 'unknown' ? (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Regional District Baseline Active:</strong> Showing estimated characteristics for {regionalDefault.name} based on the Rayalaseema/Deccan regional soil survey. You can enter exact lab numbers anytime in your{' '}
            <Link to="/dashboard/farm-profile" className="font-bold underline text-[#123D2A]">
              Farm Profile
            </Link>.
          </div>
        </div>
      ) : farmProfile.soilKnowledgeLevel === 'have_card' ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
          <span>Showing verified test parameters from your Soil Health Card registry.</span>
        </div>
      ) : null}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Soil Reaction (pH)"
          value={currentPh}
          unit="pH"
          subtitle={currentPh >= 6.5 && currentPh <= 7.5 ? 'Neutral & Near-Optimal' : 'Slightly Alkaline/Acidic'}
          icon={FlaskConical}
          trend={{ direction: 'neutral', label: 'Nutrient availability 94%' }}
          highlightColor="forest"
        />

        <MetricCard
          title="Classification Texture"
          value={activeSoilInfo.name.split(' ')[0]}
          unit="Soil"
          subtitle={activeSoilInfo.tagline}
          icon={Layers}
          highlightColor="emerald"
        />

        <MetricCard
          title="Organic Carbon (OC)"
          value="0.48"
          unit="%"
          subtitle="Critical threshold >0.75%"
          icon={Leaf}
          trend={{ direction: 'down', label: 'Deficient (Requires FYM)' }}
          highlightColor="amber"
        />

        <MetricCard
          title="Cation Exchange Capacity"
          value="18.2"
          unit="meq/100g"
          subtitle="Moderate nutrient holding"
          icon={Sparkles}
          highlightColor="forest"
        />
      </div>

      {/* Visual pH Scale Meter & NPK Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* pH Visual Scale */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#123D2A]">
                Electrochemical Soil pH Spectrum
              </h3>
              <span className="text-xs font-mono font-bold text-[#16A36A]">
                {currentPh}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative h-6 rounded-xl bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-500 to-indigo-600 shadow-inner">
                <div
                  className="absolute -top-1.5 -bottom-1.5 w-3 bg-white border-2 border-slate-900 rounded-full shadow-md transform -translate-x-1/2"
                  style={{
                    left: `${Math.max(5, Math.min(95, ((currentPh - 4.5) / 4.5) * 100))}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4.5 (Acidic)</span>
                <span>6.5 - 7.5 (Optimal)</span>
                <span>9.0 (Alkaline)</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 text-xs space-y-2 mt-4">
                <div className="font-bold text-[#123D2A]">
                  Diagnostic Evaluation:
                </div>
                <p className="text-slate-600 leading-relaxed">
                  At pH {currentPh}, phosphate fixation by iron and aluminum oxides is minimal. Micronutrients like Zinc, Boron, and Iron maintain high bio-availability for legumes and cereals.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Recommended amendment: Apply Gypsum 200 kg/acre if pH approaches 7.8.
          </div>
        </div>

        {/* NPK Primary Macro-Nutrient Levels */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#123D2A]">
                Primary Macronutrient Profile (N-P-K)
              </h3>
              <p className="text-xs text-[#73877B]">
                Soil nutrient concentrations measured against national agricultural standards
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              kg / hectare
            </span>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutrientData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="nutrient" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value} kg/ha (${item.payload.status})`,
                    item.payload.nutrient,
                  ]}
                />
                <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                  {nutrientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs mt-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Nitrogen (N)</span>
              <strong className="text-amber-800">{currentN} kg/ha (Medium-Low)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Phosphorus (P)</span>
              <strong className="text-emerald-800">{currentP} kg/ha (Medium)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Potassium (K)</span>
              <strong className="text-emerald-800">{currentK} kg/ha (Adequate)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Soil Improvement Guidance */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
          <div>
            <h2 className="text-base font-bold text-[#123D2A]">
              Practical Soil Health Improvement Guidance
            </h2>
            <p className="text-xs text-[#73877B]">
              Biological, physical, and chemical interventions to raise climate resilience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123D2A]">
              <Leaf className="w-4 h-4 text-[#16A36A]" />
              <span>Green Manuring & Organic Carbon</span>
            </div>
            <p className="text-xs text-[#4B5E53] leading-relaxed">
              Incorporate Sunnhemp (Crotalaria juncea) or Dhaincha at 45 days before the primary crop to fix up to 40 kg N/ha naturally.
            </p>
            <div className="text-[11px] font-semibold text-[#16A36A] pt-1">
              Estimated Water Retention Gain: +15%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123D2A]">
              <FlaskConical className="w-4 h-4 text-[#16A36A]" />
              <span>Bio-Fertilizer Inoculation</span>
            </div>
            <p className="text-xs text-[#4B5E53] leading-relaxed">
              Inoculate seeds with Rhizobium and Phosphobacteria (PSB) @ 250g per 10 kg seed to solubilize fixed soil phosphates without high DAP purchase costs.
            </p>
            <div className="text-[11px] font-semibold text-[#16A36A] pt-1">
              Input Cost Reduction: ₹650 / Acre
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123D2A]">
              <Layers className="w-4 h-4 text-[#16A36A]" />
              <span>Broad-Bed Furrow (BBF) Tillage</span>
            </div>
            <p className="text-xs text-[#4B5E53] leading-relaxed">
              In light soil, broad beds (100 cm width) separated by 30 cm furrows encourage deep percolation while stopping soil erosion during sudden downpours.
            </p>
            <div className="text-[11px] font-semibold text-[#16A36A] pt-1">
              Runoff Arrest Efficiency: 82%
            </div>
          </div>
        </div>
      </div>

      <DemoDisclaimer />
    </div>
  );
};
