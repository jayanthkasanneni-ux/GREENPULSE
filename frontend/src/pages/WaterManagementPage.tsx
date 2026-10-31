import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  Droplets,
  Gauge,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

export const WaterManagementPage: React.FC = () => {
  const { farmProfile, crops } = useApp();

  // Water requirements comparison data (in mm per season)
  const cropWaterData = [
    { name: 'Pearl Millet', waterReqMm: 380, availableSupplyMm: 488, status: 'Safe Surplus', color: '#16A36A' },
    { name: 'Groundnut', waterReqMm: 520, availableSupplyMm: 488, status: 'Mild Deficit (Borewell buffer)', color: '#16A36A' },
    { name: 'Pigeon Pea', waterReqMm: 550, availableSupplyMm: 488, status: 'Manageable with Drip', color: '#16A36A' },
    { name: 'Maize', waterReqMm: 680, availableSupplyMm: 488, status: 'Requires Supplemental 192mm', color: '#d97706' },
    { name: 'Cotton', waterReqMm: 750, availableSupplyMm: 488, status: 'High Borewell Reliance', color: '#d97706' },
    { name: 'Direct Rice (DSR)', waterReqMm: 950, availableSupplyMm: 488, status: 'Severe Groundwater Deficit', color: '#dc2626' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Hydraulic Diagnostics & Deficit Management</span>
            <span>·</span>
            <span>Groundwater Quota</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Water Budget & Irrigation Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Reconciles seasonal rainfall supply, borewell recharge capacity, and crop-specific evapotranspiration footprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            Water Security: Stable for Low/Medium Demand
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Seasonal Water Supply"
          value="488"
          unit="mm"
          subtitle="Forecast Kharif precipitation"
          icon={Droplets}
          trend={{ direction: 'neutral', label: 'Average monsoon baseline' }}
          highlightColor="forest"
        />

        <MetricCard
          title="Borewell Yield Capacity"
          value="4.0"
          unit="hrs/day"
          subtitle={farmProfile.waterAvailability || 'Moderate pumping'}
          icon={Gauge}
          trend={{ direction: 'down', label: 'Summer dry dip' }}
          highlightColor="amber"
        />

        <MetricCard
          title="Irrigation Infrastructure"
          value={farmProfile.irrigationAvailability.toUpperCase()}
          unit="System"
          subtitle="Application efficiency ~85%"
          icon={Sliders}
          highlightColor="emerald"
        />

        <MetricCard
          title="Water Stress Index"
          value="Low-Mod"
          subtitle="Manageable with deficit scheduling"
          icon={ShieldCheck}
          highlightColor="forest"
        />
      </div>

      {/* Crop Water Requirement vs Availability Chart */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#123D2A]">
              Crop Consumptive Water Footprint vs Natural Rainfall (mm/season)
            </h3>
            <p className="text-xs text-[#73877B]">
              Crops exceeding the 488 mm rainfall line require heavy artificial borewell extraction
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#16A36A] bg-emerald-50 px-2.5 py-1 rounded">
            Rainfall Baseline: 488 mm
          </span>
        </div>

        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropWaterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any, name: any, item: any) => [
                  `${value} mm (${item.payload.status})`,
                  'Consumptive Demand',
                ]}
              />
              <Bar dataKey="waterReqMm" name="Crop Water Demand (mm)" radius={[4, 4, 0, 0]}>
                {cropWaterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#16A36A]" />
            <span>Green: Sustainable under normal rainfall</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d97706]" />
            <span>Amber: Requires 150-250mm supplemental irrigation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
            <span>Red: Groundwater depletion hazard</span>
          </div>
        </div>
      </div>

      {/* Water-Efficient Crop Alternatives and Smart Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Droplets className="w-5 h-5 text-[#16A36A]" />
            <h3 className="text-sm font-bold text-[#123D2A]">
              Water-Efficient Crop Substitutions
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
              <div className="flex items-center justify-between font-bold text-[#123D2A]">
                <span>Replace Flooded Paddy → Pearl Millet or Sorghum</span>
                <span className="text-[#16A36A] font-mono">-60% Water</span>
              </div>
              <p className="text-slate-600 mt-1">
                Pearl Millet consumes 380 mm versus 950 mm in rice, while returning comparable gross margins on rainfed parcels.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-slate-200">
              <div className="flex items-center justify-between font-bold text-[#123D2A]">
                <span>Replace Continuous Cotton → Groundnut + Red Gram</span>
                <span className="text-[#16A36A] font-mono">-32% Water</span>
              </div>
              <p className="text-slate-600 mt-1">
                Intercropping spreads water demand across two distinct root depths, saving energy pumping costs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
            <h3 className="text-sm font-bold text-[#123D2A]">
              Targeted Deficit Irrigation Rules
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-[#4B5E53]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>Groundnut:</strong> Restrict irrigation during vegetative growth (0-25 days) to encourage deep root foraging. Provide critical watering during peg penetration.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>Maize:</strong> Protect the 50-65 DAS silking period. Missing irrigation during silking causes irreversible barren cobs.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>Night Irrigation:</strong> Run drip pumps between 8:00 PM and 5:00 AM to cut wind drift and daytime evaporative losses by 22%.</span>
            </li>
          </ul>
        </div>
      </div>

      <DemoDisclaimer />
    </div>
  );
};
