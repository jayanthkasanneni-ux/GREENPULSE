import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CropRecommendation, RiskLevel, WaterDemand } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  Sparkles,
  Droplets,
  Calendar,
  Layers,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Filter,
  X,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const CropRecommendationsPage: React.FC = () => {
  const {
    crops,
    selectedCropsForComparison,
    toggleCropComparison,
    activeSeason,
    activeLocation,
    wizardState,
  } = useApp();

  const navigate = useNavigate();

  // Filters
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterWater, setFilterWater] = useState<string>('all');
  const [activeModalCrop, setActiveModalCrop] = useState<CropRecommendation | null>(null);

  const filteredCrops = crops.filter(c => {
    if (filterRisk !== 'all' && c.riskLevel !== filterRisk) return false;
    if (filterWater !== 'all' && c.waterDemand !== filterWater) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Decision Matrix Synthesis</span>
            <span>·</span>
            <span>{activeSeason}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Climate-Resilient Crop Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Evaluated for {activeLocation.district} ({activeLocation.state}) under {wizardState.soilType || 'red'} soil and {wizardState.waterReliability || 'moderate'} water conditions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/crop-comparison')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm"
          >
            <Scale className="w-4 h-4 text-[#B7E36B]" />
            <span>Compare Selected ({selectedCropsForComparison.length}/3)</span>
          </button>
        </div>
      </div>

      {/* Filter and Compare Status Strip */}
      <div className="bg-white p-4 rounded-xl border border-[#123D2A]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F9F5] p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRisk === 'all' ? 'bg-white text-[#123D2A] shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All Risks
            </button>
            <button
              onClick={() => setFilterRisk('low')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRisk === 'low' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Low Risk
            </button>
            <button
              onClick={() => setFilterRisk('moderate')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRisk === 'moderate' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Moderate
            </button>
            <button
              onClick={() => setFilterRisk('high')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRisk === 'high' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              High Risk
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F9F5] p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterWater('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterWater === 'all' ? 'bg-white text-[#123D2A] shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All Water Demands
            </button>
            <button
              onClick={() => setFilterWater('low')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterWater === 'low' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Low Water
            </button>
            <button
              onClick={() => setFilterWater('moderate')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterWater === 'moderate' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Moderate
            </button>
            <button
              onClick={() => setFilterWater('high')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterWater === 'high' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              High Water
            </button>
          </div>
        </div>

        <div className="text-xs text-[#4B5E53] flex items-center gap-2">
          <span>Showing {filteredCrops.length} of {crops.length} options</span>
        </div>
      </div>

      {/* Grid of Individual Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map(crop => {
          const isComparing = selectedCropsForComparison.includes(crop.id);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-[#123D2A]/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Suitability Badge Overlay */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Floating Match Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-[#123D2A] shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>{crop.suitabilityScore}% Match</span>
                  </div>

                  {/* Bottom Text Over Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] text-[#B7E36B] font-mono font-medium tracking-wide">
                      {crop.category} · {crop.botanicalName}
                    </div>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {crop.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Risk Badge and Water Demand Strip */}
                  <div className="flex items-center justify-between gap-2">
                    <RiskBadge level={crop.riskLevel} />
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span className="capitalize">{crop.waterDemand} Water</span>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F7F9F5] p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Duration:</span>
                      <span className="font-semibold text-slate-800">{crop.growingDurationDays}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Est. Yield:</span>
                      <span className="font-semibold text-slate-800">{crop.estimatedYieldRange.split(' ')[0]} Qtl/Ac</span>
                    </div>
                  </div>

                  {/* Reasons for Recommendation */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#123D2A] uppercase tracking-wide">
                      Agronomic Drivers:
                    </div>
                    <ul className="space-y-1 text-xs text-[#4B5E53]">
                      {crop.reasonsForRecommendation.slice(0, 2).map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Major Climate Challenge */}
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
                    <div className="flex items-center gap-1 font-bold text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Key Climate Challenge:</span>
                    </div>
                    <p className="mt-0.5 text-slate-700 leading-snug line-clamp-2">
                      {crop.climateRisks[0]?.explanation || 'Moderate thermal sensitivity during flowering.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleCropComparison(crop.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isComparing
                      ? 'bg-[#123D2A] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalCrop(crop)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#16A36A] hover:text-[#123D2A] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Deep Crop Agronomic Details */}
      {activeModalCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setActiveModalCrop(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 z-10 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-mono text-[#16A36A] font-semibold">
                  {activeModalCrop.category} · {activeModalCrop.botanicalName}
                </div>
                <h3 className="text-2xl font-extrabold text-[#123D2A] mt-0.5">
                  {activeModalCrop.name}
                </h3>
                <p className="text-xs text-slate-500">{activeModalCrop.localName}</p>
              </div>

              <button
                onClick={() => setActiveModalCrop(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suitability & Risk Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-slate-400 block">Match Score:</span>
                <span className="text-lg font-bold font-mono text-[#123D2A]">{activeModalCrop.suitabilityScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-slate-400 block">Risk Level:</span>
                <span className="text-sm font-bold capitalize text-slate-800">{activeModalCrop.riskLevel}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-slate-400 block">Duration:</span>
                <span className="text-xs font-semibold text-slate-800">{activeModalCrop.growingDurationDays}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-slate-200">
                <span className="text-slate-400 block">Water Demand:</span>
                <span className="text-xs font-semibold capitalize text-slate-800">{activeModalCrop.waterDemand}</span>
              </div>
            </div>

            {/* Agronomic Advisory Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#123D2A] uppercase tracking-wider">
                Agronomic Management Protocol
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900">Recommended Sowing Window:</strong>{' '}
                  <span className="text-slate-700">{activeModalCrop.agronomicAdvisory.recommendedWindow}</span>
                </div>
                <div>
                  <strong className="text-slate-900">Certified Seed Rate:</strong>{' '}
                  <span className="text-slate-700">{activeModalCrop.agronomicAdvisory.seedRate}</span>
                </div>
                <div>
                  <strong className="text-slate-900">Fertilizer Regimen:</strong>{' '}
                  <span className="text-slate-700">{activeModalCrop.agronomicAdvisory.fertilizerRecommendation}</span>
                </div>
                <div>
                  <strong className="text-slate-900">Climate Contingency:</strong>{' '}
                  <span className="text-slate-700">{activeModalCrop.agronomicAdvisory.climateContingency}</span>
                </div>
              </div>
            </div>

            {/* Climate Vulnerability Vectors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#123D2A] uppercase tracking-wider">
                Specific Climate Vulnerabilities & Mitigations
              </h4>
              <div className="space-y-2">
                {activeModalCrop.climateRisks.map((risk, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#123D2A]">{risk.category} Risk</span>
                      <span className="capitalize text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {risk.severity} Severity
                      </span>
                    </div>
                    <p className="text-slate-600">{risk.explanation}</p>
                    <p className="text-[#16A36A] font-medium text-[11px]">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Economics Summary */}
            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Est. Cultivation Cost:</span>{' '}
                <strong className="font-mono text-slate-800">₹{activeModalCrop.economics.estimatedCostPerAcre.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-500">Expected Gross:</span>{' '}
                <strong className="font-mono text-[#16A36A]">₹{activeModalCrop.economics.expectedRevenuePerAcre.toLocaleString()}</strong>
              </div>
              <div className="text-emerald-800 font-semibold">
                MSP Backed: {activeModalCrop.economics.minimumSupportPriceAvailable ? 'Yes' : 'No'}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleCropComparison(activeModalCrop.id);
                  setActiveModalCrop(null);
                  navigate('/dashboard/crop-comparison');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#123D2A] rounded-xl hover:bg-[#1A543B]"
              >
                Compare in Matrix →
              </button>
            </div>
          </div>
        </div>
      )}

      <DemoDisclaimer text="Suitability scores are decision-support indices simulated against local agro-climatic historical norms. GREENPULSE does not guarantee specific harvest yields. Farmers are encouraged to consult local university extension officers." />
    </div>
  );
};
