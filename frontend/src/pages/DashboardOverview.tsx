import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ThermometerSun,
  CloudRain,
  Droplets,
  Layers,
  ShieldCheck,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2,
  Info,
  Clock,
  FlaskConical,
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useApp } from '../context/AppContext';
import { MONTHLY_CLIMATE_SERIES } from '../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const DashboardOverview: React.FC = () => {
  const { farmProfile, user, activeLocation, activeSeason, crops } = useApp();
  const navigate = useNavigate();

  // Top recommended crop
  const topCrop = crops[0] || null;

  // Determine soil status label
  const soilStatusLabel =
    farmProfile.soilKnowledgeLevel === 'have_card'
      ? 'Soil Health Card on file'
      : farmProfile.soilKnowledgeLevel === 'know_type'
      ? `${farmProfile.soilType.toUpperCase()} Soil identified`
      : 'Regional district baseline';

  return (
    <div className="space-y-8 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Farmer Decision Overview</span>
            <span>·</span>
            <span>{activeLocation.district}, {activeLocation.state}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Current season: <strong className="text-[#123D2A]">{activeSeason}</strong>. Monitoring {farmProfile.landAreaAcres} acres in {farmProfile.village || activeLocation.district}.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/crop-planning')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Compass className="w-4 h-4 text-[#B7E36B]" />
          <span>Start Crop Planning</span>
        </button>
      </div>

      {/* Five Essential Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Seasonal Rainfall */}
        <MetricCard
          title="Seasonal Rainfall"
          value="488"
          unit="mm"
          subtitle="Forecast Kharif aggregate"
          icon={CloudRain}
          trend={{ direction: 'up', label: '+1.6% anomaly' }}
          highlightColor="emerald"
        />

        {/* 2. Temperature */}
        <MetricCard
          title="Temperature"
          value="31.8"
          unit="°C"
          subtitle="Min 23.4°C · Normal range"
          icon={ThermometerSun}
          trend={{ direction: 'neutral', label: '+0.3°C vs Normal' }}
          highlightColor="forest"
        />

        {/* 3. Water Availability */}
        <MetricCard
          title="Water Availability"
          value="Moderate"
          subtitle={farmProfile.waterAvailability || '3-4 hrs daily pumping'}
          icon={Droplets}
          trend={{ direction: 'neutral', label: 'Borewell yield' }}
          highlightColor="amber"
        />

        {/* 4. Soil Information Status */}
        <div className="bg-white rounded-xl border border-[#123D2A]/10 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#4B5E53] uppercase tracking-wide">
              Soil Status
            </span>
            <div className="p-2 rounded-lg bg-[#123D2A]/5 text-[#123D2A]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold font-sans text-[#1C2922] capitalize">
              {farmProfile.soilType} Soil
            </div>
            <p className="text-[11px] text-[#73877B] mt-1 leading-tight">
              {soilStatusLabel}
            </p>
          </div>
        </div>

        {/* 5. Climate Risk Status */}
        <div className="bg-white rounded-xl border border-[#123D2A]/10 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#4B5E53] uppercase tracking-wide">
              Climate Risk
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <RiskBadge level="low" />
            <p className="text-[11px] text-[#73877B] mt-2 leading-tight">
              Manageable dry spell window at early August.
            </p>
          </div>
        </div>
      </div>

      {/* Two Essential Interactive Charts: Rainfall Trend + Temperature Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Trend Chart */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#123D2A]">
                Seasonal Rainfall Trend (mm)
              </h3>
              <p className="text-xs text-[#73877B]">
                Monthly rainfall trajectory vs 10-year historical baseline
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Monthly mm
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} mm`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="rainfallHistoricalNormalMm" name="10-Yr Normal" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rainfallCurrentMm" name="Forecast Rainfall" fill="#16A36A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-right font-mono">
            Sample IMD Demonstration Baseline
          </div>
        </div>

        {/* Temperature Trend Chart */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#123D2A]">
                Monthly Temperature Trend (°C)
              </h3>
              <p className="text-xs text-[#73877B]">
                Maximum Day vs Minimum Night temperature cycle
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Deg Celsius
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[12, 44]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} °C`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="tempMaxC" name="Max Temp (°C)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tempMinC" name="Min Temp (°C)" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-right font-mono">
            Flowering safety threshold &lt;35°C
          </div>
        </div>
      </div>

      {/* Climate Summary & Recommended Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Climate Summary */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-[#16A36A]" />
                <h2 className="text-base font-bold text-[#123D2A]">
                  Climate Summary ({activeSeason})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                Near-Normal Horizon
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#4B5E53] leading-relaxed">
              <p>
                • <strong>Monsoon Onset:</strong> On-time arrival projected between June 12–16 for {activeLocation.district}. Early precipitation is expected to be sufficient for land preparation and sowing.
              </p>
              <p>
                • <strong>Mid-Season Moisture:</strong> An 8–10 day dry spell is probable in early August. Sowing drought-resilient legumes (Groundnut, Pigeon Pea) or C4 Millets significantly reduces moisture shock.
              </p>
              <p>
                • <strong>Late Rain Outlook:</strong> September convective surges are projected at 142 mm, providing ideal grain-filling moisture for short-to-medium duration cultivars.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/dashboard/climate-insights"
              className="text-[#16A36A] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explore In-Depth Climate Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#16A36A]" />
                <h2 className="text-base font-bold text-[#123D2A]">
                  Recommended Next Actions
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                Action Checklist
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#123D2A]">Complete Crop Planning Analysis</strong>
                  <p className="text-slate-600 mt-0.5">
                    Run the 5-step wizard to benchmark candidate crops against your soil and water security.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#123D2A]">Review Agronomic Sowing Windows</strong>
                  <p className="text-slate-600 mt-0.5">
                    Check verified ICAR planting calendars and seed rates for your agro-climatic sub-basin.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#123D2A]">Prepare Field Furrows</strong>
                  <p className="text-slate-600 mt-0.5">
                    Prepare broad-bed furrows across contour lines to harvest convective shower runoff.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/dashboard/agronomic-guidance"
              className="text-[#16A36A] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Full Agronomic Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <DemoDisclaimer />
    </div>
  );
};
