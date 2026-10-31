import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  Scale,
  Sparkles,
  Droplets,
  Calendar,
  Layers,
  ThermometerSun,
  CloudRain,
  AlertTriangle,
  HelpCircle,
  Plus,
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

export const CropComparisonPage: React.FC = () => {
  const { crops, selectedCropsForComparison, setComparisonCrops } = useApp();

  // Get selected crop objects
  const comparedCrops = crops.filter(c => selectedCropsForComparison.includes(c.id));

  // State for explanation accordion expansion
  const [expandedRiskCropId, setExpandedRiskCropId] = useState<string>(
    comparedCrops[0]?.id || 'crop-groundnut'
  );

  // Radar chart comparative data (0-100 scale)
  const radarData = [
    {
      subject: 'Overall Suitability',
      ...comparedCrops.reduce((acc, c) => ({ ...acc, [c.name]: c.suitabilityScore }), {}),
    },
    {
      subject: 'Drought Defense',
      ...comparedCrops.reduce((acc, c) => {
        const val = c.riskLevel === 'low' ? 90 : c.riskLevel === 'moderate' ? 65 : 40;
        return { ...acc, [c.name]: val };
      }, {}),
    },
    {
      subject: 'Water Efficiency',
      ...comparedCrops.reduce((acc, c) => {
        const val = c.waterDemand === 'low' ? 95 : c.waterDemand === 'moderate' ? 65 : 30;
        return { ...acc, [c.name]: val };
      }, {}),
    },
    {
      subject: 'Thermal Buffer',
      ...comparedCrops.reduce((acc, c) => {
        const val = c.id === 'crop-millets' ? 95 : c.id === 'crop-groundnut' ? 85 : 60;
        return { ...acc, [c.name]: val };
      }, {}),
    },
    {
      subject: 'Soil Adaptability',
      ...comparedCrops.reduce((acc, c) => {
        const val = c.id === 'crop-groundnut' ? 92 : c.id === 'crop-millets' ? 90 : 70;
        return { ...acc, [c.name]: val };
      }, {}),
    },
    {
      subject: 'Market Assurance (MSP)',
      ...comparedCrops.reduce((acc, c) => {
        const val = c.economics.minimumSupportPriceAvailable ? 85 : 50;
        return { ...acc, [c.name]: val };
      }, {}),
    },
  ];

  const colors = ['#123D2A', '#16A36A', '#d97706'];

  const handleAddCrop = (id: string) => {
    if (selectedCropsForComparison.length < 3) {
      setComparisonCrops([...selectedCropsForComparison, id]);
    }
  };

  const handleRemoveCrop = (id: string) => {
    if (selectedCropsForComparison.length > 1) {
      setComparisonCrops(selectedCropsForComparison.filter(c => c !== id));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Tradeoff Analysis</span>
            <span>·</span>
            <span>Side-by-Side Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Multi-Crop Climate Risk Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Compare up to 3 candidate crops across soil adaptability, thermal vulnerability, water footprint, and economic upside.
          </p>
        </div>

        {/* Selected Crop chips */}
        <div className="flex flex-wrap items-center gap-2">
          {crops.map(c => {
            const isSelected = selectedCropsForComparison.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (isSelected) handleRemoveCrop(c.id);
                  else handleAddCrop(c.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#123D2A] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{c.name.split(' ')[0]}</span>
                {isSelected ? <X className="w-3 h-3 text-white/70" /> : <Plus className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radar Chart Visual Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#123D2A]">
                Multi-Axis Climate Resilience Profile
              </h3>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Radar Matrix
              </span>
            </div>
            <p className="text-xs text-[#73877B]">
              Radar polygon showing relative strengths across moisture defense, thermal buffer, and economic safety.
            </p>
          </div>

          <div className="h-72 sm:h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {comparedCrops.map((crop, idx) => (
                  <Radar
                    key={crop.id}
                    name={crop.name}
                    dataKey={crop.name}
                    stroke={colors[idx % colors.length]}
                    fill={colors[idx % colors.length]}
                    fillOpacity={0.25}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary Matrix Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {comparedCrops.map((crop, idx) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-[#123D2A]/10 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Option 0{idx + 1}
                  </span>
                  <RiskBadge level={crop.riskLevel} />
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-bold text-[#123D2A] leading-tight">
                    {crop.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{crop.localName}</div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Suitability:</span>
                    <strong className="font-mono text-[#16A36A]">{crop.suitabilityScore}%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Water Demand:</span>
                    <span className="font-semibold capitalize text-slate-700">{crop.waterDemand}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-700 font-medium">{crop.growingDurationDays.split(' ')[0]} d</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Est. Yield:</span>
                    <span className="text-slate-700 font-medium">{crop.estimatedYieldRange.split(' ')[0]} Qtl</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="font-semibold text-[#123D2A]">Est. Net Profit:</span>{' '}
                <span className="font-mono font-bold text-[#16A36A]">
                  ₹{(crop.economics.expectedRevenuePerAcre - crop.economics.estimatedCostPerAcre).toLocaleString()}/ac
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Detailed Parameter Table */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#123D2A]">
            Comprehensive Agro-Climatic Comparison Matrix
          </h3>
          <p className="text-xs text-[#73877B] mt-0.5">
            Direct parameter comparison against verified regional environmental thresholds
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-5 font-bold uppercase tracking-wider text-[11px] w-1/4">
                  Comparison Parameter
                </th>
                {comparedCrops.map(crop => (
                  <th key={crop.id} className="py-3 px-5 font-bold text-slate-900 text-xs">
                    {crop.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Overall Suitability Score</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 font-mono font-bold text-[#16A36A] text-sm tabular-nums">
                    {c.suitabilityScore}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Climate Risk Level</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5">
                    <RiskBadge level={c.riskLevel} />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Soil Compatibility</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 text-slate-600 leading-snug">
                    {c.soilCompatibility}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Rainfall Requirement</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 font-mono text-slate-800">
                    {c.optimalRainfallMm}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Temperature Tolerance Range</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 font-mono text-slate-800">
                    {c.optimalTemperature}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Water Demand & Irrigation</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 font-medium capitalize text-slate-700">
                    {c.waterDemand} consumptive footprint
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Drought Sensitivity</td>
                {comparedCrops.map(c => {
                  const droughtRisk = c.climateRisks.find(r => r.category === 'Drought');
                  return (
                    <td key={c.id} className="py-3.5 px-5 text-slate-700">
                      <span className={`inline-block font-semibold capitalize ${
                        droughtRisk?.severity === 'low' ? 'text-emerald-700' : droughtRisk?.severity === 'moderate' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {droughtRisk?.severity || 'Low'} Sensitivity
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Heat Stress Sensitivity</td>
                {comparedCrops.map(c => {
                  const heatRisk = c.climateRisks.find(r => r.category === 'Heat Stress');
                  return (
                    <td key={c.id} className="py-3.5 px-5 text-slate-700">
                      <span className={`inline-block font-semibold capitalize ${
                        heatRisk?.severity === 'low' ? 'text-emerald-700' : heatRisk?.severity === 'moderate' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {heatRisk?.severity || 'Low'} Sensitivity
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Excess Rainfall / Waterlogging</td>
                {comparedCrops.map(c => {
                  const rainRisk = c.climateRisks.find(r => r.category === 'Excess Rainfall');
                  return (
                    <td key={c.id} className="py-3.5 px-5 text-slate-700">
                      <span className={`inline-block font-semibold capitalize ${
                        rainRisk?.severity === 'low' ? 'text-emerald-700' : rainRisk?.severity === 'moderate' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {rainRisk?.severity || 'Moderate'} Sensitivity
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Growing Duration</td>
                {comparedCrops.map(c => (
                  <td key={c.id} className="py-3.5 px-5 font-mono text-slate-800">
                    {c.growingDurationDays}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Section: "Why does this crop have this risk?" */}
      <div className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-[#16A36A]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#123D2A]">
              Why does this crop have this risk?
            </h2>
            <p className="text-xs text-[#73877B]">
              Transparent agronomic breakdown explaining the scientific reasoning behind every risk classification
            </p>
          </div>
        </div>

        {/* Tab selector for compared crops */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          {comparedCrops.map(crop => (
            <button
              key={crop.id}
              onClick={() => setExpandedRiskCropId(crop.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                expandedRiskCropId === crop.id
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#123D2A] hover:bg-slate-100'
              }`}
            >
              {crop.name}
            </button>
          ))}
        </div>

        {/* Active crop risk explanation cards */}
        {(() => {
          const selectedCrop = crops.find(c => c.id === expandedRiskCropId) || comparedCrops[0];
          if (!selectedCrop) return null;

          return (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#123D2A]">
                  Scientific Vulnerability Assessment for {selectedCrop.name}:
                </span>
                <span className="text-[11px] font-mono text-[#16A36A] font-medium">
                  {selectedCrop.botanicalName}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCrop.climateRisks.map((risk, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F7F9F5] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-[#123D2A]">{risk.category} Risk</span>
                        <RiskBadge level={risk.severity} showIcon={false} />
                      </div>
                      <p className="mt-2 text-xs text-[#4B5E53] leading-relaxed">
                        {risk.explanation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-[#16A36A] font-medium">
                      <strong>Agronomic Action:</strong> {risk.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <DemoDisclaimer text="Comparative ratings are calibrated against regional CRIDA/ICAR dryland research trials. Not an official warranty of yield outcome." />
    </div>
  );
};
