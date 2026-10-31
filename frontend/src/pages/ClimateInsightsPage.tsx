import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MONTHLY_CLIMATE_SERIES, SEASONAL_RAINFALL_COMPARISON } from '../data/mockData';
import { MetricCard } from '../components/common/MetricCard';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  CloudSun,
  ThermometerSun,
  CloudRain,
  Flame,
  AlertTriangle,
  Calendar,
  Layers,
  TrendingDown,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const ClimateInsightsPage: React.FC = () => {
  const { activeLocation, activeSeason, setActiveSeason } = useApp();

  const [dateRangeFilter, setDateRangeFilter] = useState<'10yr' | '5yr' | 'current'>('10yr');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Atmospheric & Meteorological Observatory</span>
            <span>·</span>
            <span>{activeLocation.district} Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Climate Intelligence & Historical Anomalies
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Reanalyzed meteorological data, dry-spell risk recurrence, and seasonal thermal variance for {activeSeason}.
          </p>
        </div>

        {/* Date range filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F9F5] rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setDateRangeFilter('current')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              dateRangeFilter === 'current' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            2026 Forecast
          </button>
          <button
            onClick={() => setDateRangeFilter('5yr')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              dateRangeFilter === '5yr' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            5-Year Trend
          </button>
          <button
            onClick={() => setDateRangeFilter('10yr')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              dateRangeFilter === '10yr' ? 'bg-white text-[#123D2A] font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            10-Year Normal
          </button>
        </div>
      </div>

      {/* Climate Risk Indicators Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Drought Recurrence Risk"
          value="18"
          unit="%"
          subtitle="Low-moderate probability in Kharif"
          icon={AlertTriangle}
          trend={{ direction: 'down', label: '-4% vs 2024 El Niño' }}
          highlightColor="emerald"
        />

        <MetricCard
          title="Heat Stress Days (>38°C)"
          value="14"
          unit="Days"
          subtitle="Pre-monsoon April-May peak"
          icon={Flame}
          trend={{ direction: 'up', label: '+2 days vs historical' }}
          highlightColor="amber"
        />

        <MetricCard
          title="Excess Rainfall Deluge Risk"
          value="12"
          unit="%"
          subtitle="Late cyclonic surges in Oct"
          icon={CloudRain}
          trend={{ direction: 'neutral', label: 'Average probability' }}
          highlightColor="forest"
        />

        <MetricCard
          title="Monsoon Onset Confidence"
          value="88"
          unit="%"
          subtitle="Arrival projected June 12-16"
          icon={CloudSun}
          trend={{ direction: 'up', label: 'High model consensus' }}
          highlightColor="emerald"
        />
      </div>

      {/* Cumulative Rainfall vs Normal (Area Chart) */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#123D2A]">
              Monthly Rainfall Distribution vs Historical Baseline (mm)
            </h3>
            <p className="text-xs text-[#73877B]">
              Actual/forecast precipitation trajectory compared against long-period normal
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            Normal Annual: 540 mm
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainCurrentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A36A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value} mm`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="rainfallHistoricalNormalMm" name="10-Year Normal Rainfall" stroke="#94a3b8" fillOpacity={1} fill="url(#rainHistGrad)" />
              <Area type="monotone" dataKey="rainfallCurrentMm" name="Current / Forecast Rainfall" stroke="#16A36A" strokeWidth={2.5} fillOpacity={1} fill="url(#rainCurrentGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column: Heat & Dry Spells */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consecutive Dry Spell Days per Month */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#123D2A]">
                Historical Dry-Spell Duration (Days / Month)
              </h3>
              <p className="text-xs text-[#73877B]">
                Average consecutive rainless days per calendar month
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Rainless Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 31]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} days`, 'Avg Dry Run']}
                />
                <Bar dataKey="drySpellDays" name="Average Dry Spell Days" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#4B5E53] mt-2">
            Notice August drops to 10 days of dry spell, making it the safest vegetative window for rainfed crops.
          </p>
        </div>

        {/* Temperature Extremes and Thermal Thresholds */}
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#123D2A]">
                Thermal Extremes vs Crop Safety Thresholds
              </h3>
              <p className="text-xs text-[#73877B]">
                Monthly maximum daytime temperature vs historical record
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              °C Line
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[20, 44]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} °C`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="tempMaxC" name="Current Max °C" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tempHistoricalMaxC" name="Historical 10-Yr Max °C" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#4B5E53] mt-2">
            Temperature moderates to 31.8°C in August-September, ideal for Groundnut and Pigeon Pea flowering.
          </p>
        </div>
      </div>

      {/* Historical Climate Comparison Summary Table */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#123D2A]">
              Historical Multi-Year Monsoon Shift Analysis
            </h3>
            <p className="text-xs text-[#73877B]">
              Recorded monsoon shifts and rainfall anomalies over the last 5 seasons
            </p>
          </div>
          <span className="text-xs text-[#16A36A] font-semibold">Decadal Climate Pattern</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-2.5 px-4 font-bold">Crop Year</th>
                <th className="py-2.5 px-4 font-bold">Kharif Total (mm)</th>
                <th className="py-2.5 px-4 font-bold">Rabi Total (mm)</th>
                <th className="py-2.5 px-4 font-bold">Normal Baseline</th>
                <th className="py-2.5 px-4 font-bold">Anomaly %</th>
                <th className="py-2.5 px-4 font-bold">Key Climate Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#123D2A]">2022</td>
                <td className="py-2.5 px-4 font-mono">420 mm</td>
                <td className="py-2.5 px-4 font-mono">165 mm</td>
                <td className="py-2.5 px-4 font-mono">540 mm</td>
                <td className="py-2.5 px-4 font-mono text-amber-700">-22%</td>
                <td className="py-2.5 px-4 text-slate-600">Early drought relieved by October cyclone</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#123D2A]">2023</td>
                <td className="py-2.5 px-4 font-mono">360 mm</td>
                <td className="py-2.5 px-4 font-mono">92 mm</td>
                <td className="py-2.5 px-4 font-mono">540 mm</td>
                <td className="py-2.5 px-4 font-mono text-rose-700">-33%</td>
                <td className="py-2.5 px-4 text-slate-600">Severe August dry spell (21 days)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#123D2A]">2024</td>
                <td className="py-2.5 px-4 font-mono">510 mm</td>
                <td className="py-2.5 px-4 font-mono">180 mm</td>
                <td className="py-2.5 px-4 font-mono">540 mm</td>
                <td className="py-2.5 px-4 font-mono text-emerald-700">-5%</td>
                <td className="py-2.5 px-4 text-slate-600">Normal distribution, high Groundnut yields</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#123D2A]">2025</td>
                <td className="py-2.5 px-4 font-mono">445 mm</td>
                <td className="py-2.5 px-4 font-mono">134 mm</td>
                <td className="py-2.5 px-4 font-mono">540 mm</td>
                <td className="py-2.5 px-4 font-mono text-amber-700">-17%</td>
                <td className="py-2.5 px-4 text-slate-600">Delayed onset by 14 days</td>
              </tr>
              <tr className="bg-emerald-50/50 font-semibold">
                <td className="py-2.5 px-4 text-[#123D2A]">2026 (Ensemble)</td>
                <td className="py-2.5 px-4 font-mono text-[#16A36A]">488 mm</td>
                <td className="py-2.5 px-4 font-mono text-[#16A36A]">156 mm</td>
                <td className="py-2.5 px-4 font-mono">540 mm</td>
                <td className="py-2.5 px-4 font-mono text-[#16A36A]">+1.6%</td>
                <td className="py-2.5 px-4 text-[#123D2A]">Near-normal monsoon with mid-season fluctuation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <DemoDisclaimer />
    </div>
  );
};
