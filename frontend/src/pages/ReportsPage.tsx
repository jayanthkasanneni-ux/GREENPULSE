import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  Printer,
  FileDown,
  CheckCircle2,
  Sprout,
  Droplets,
  Layers,
  CloudSun,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { farmProfile, crops, activeSeason, activeLocation } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const top3Crops = crops.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      {/* Non-Printable Header & Action Bar */}
      <div className="no-print bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Official Farm Advisory Dossier</span>
            <span>·</span>
            <span>Document ID #GP-2026-AP-094</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Comprehensive Crop Planning Report
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Printable and exportable agricultural decision document for bank credit, crop insurance, and field operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#B7E36B]" />
            <span>Print Report / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-[#1C2922] max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#123D2A]">
          <div>
            <BrandLogo showTagline={true} />
            <div className="text-xs text-slate-500 mt-2 font-mono">
              National Agritech Decision-Support Framework · Report Ref: GP-{Date.now().toString().slice(-6)}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <div className="font-bold text-[#123D2A] text-sm">FARM ADVISORY CERTIFICATE</div>
            <div className="text-slate-600">Season: <strong className="text-slate-900">{activeSeason}</strong></div>
            <div className="text-slate-600">Generated: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
          </div>
        </div>

        {/* Section 1: Farmer & Land Parcel Information */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#123D2A] bg-slate-100 px-3 py-1.5 rounded">
            1. Farmer & Land Parcel Registry
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Farmer Name:</span>
              <strong className="text-slate-900">{farmProfile.farmerName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">District & State:</span>
              <strong className="text-slate-900">{farmProfile.district}, {farmProfile.state}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Village / Survey:</span>
              <strong className="text-slate-900">{farmProfile.village}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Land Parcel Area:</span>
              <strong className="text-slate-900 font-mono">{farmProfile.landAreaAcres} Acres</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Soil & Water Profile */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#123D2A] bg-slate-100 px-3 py-1.5 rounded">
            2. Soil Diagnostics & Water Baseline
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Soil Texture:</span>
              <strong className="text-slate-900 capitalize">{farmProfile.soilType} Soil</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Electrochemical pH:</span>
              <strong className="text-slate-900 font-mono">{farmProfile.soilPh} (Neutral)</strong>
            </div>
            <div>
              <span className="text-slate-400 block">NPK Status (kg/ha):</span>
              <strong className="text-slate-900 font-mono">N:{farmProfile.nitrogenKgHa} · P:{farmProfile.phosphorusKgHa} · K:{farmProfile.potassiumKgHa}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Irrigation Access:</span>
              <strong className="text-slate-900 capitalize">{farmProfile.irrigationAvailability} ({farmProfile.waterAvailability})</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Seasonal Climate Forecast Outlook */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#123D2A] bg-slate-100 px-3 py-1.5 rounded">
            3. Seasonal Climate Forecast Summary
          </h2>
          <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F9F5] text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-800">
              <span><strong>Forecast Precipitation:</strong> 488 mm (+1.6% anomaly over 10-Yr Normal 480 mm)</span>
              <span className="font-mono text-emerald-800 font-bold">On-Time Monsoon Onset</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Rayalaseema agro-climatic sub-basin shows normal initial precipitation with a moderate dry-spell recurrence window identified around Week 31 (Early August). Thermal variations stay below 33°C during flowering.
            </p>
          </div>
        </div>

        {/* Section 4: Ranked Crop Recommendations */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#123D2A] bg-slate-100 px-3 py-1.5 rounded">
            4. Climate-Resilient Crop Recommendation Rankings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-2 px-3 font-bold">Rank / Crop</th>
                  <th className="py-2 px-3 font-bold">Suitability</th>
                  <th className="py-2 px-3 font-bold">Climate Risk</th>
                  <th className="py-2 px-3 font-bold">Duration</th>
                  <th className="py-2 px-3 font-bold">Water Demand</th>
                  <th className="py-2 px-3 font-bold">Est. Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {top3Crops.map((crop, idx) => (
                  <tr key={crop.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#123D2A]">
                      0{idx + 1}. {crop.name} ({crop.localName.split('/')[0]})
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#16A36A]">
                      {crop.suitabilityScore}%
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={crop.riskLevel} />
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {crop.growingDurationDays}
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-700">
                      {crop.waterDemand}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      ₹{(crop.economics.expectedRevenuePerAcre - crop.economics.estimatedCostPerAcre).toLocaleString()}/ac
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Practical Action Checklist */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#123D2A] bg-slate-100 px-3 py-1.5 rounded">
            5. Agronomic Action Protocol
          </h2>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>Pre-Sowing Treatment:</strong> Treat Groundnut seeds with Trichoderma viride @ 4g/kg seed + Rhizobium culture.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>In-Situ Conservation:</strong> Form broad-bed furrows (BBF) across contour slopes to retain rain from convective storms.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span><strong>Contingency Trigger:</strong> If monsoon rains are delayed past July 20, shift acreage from long-duration cereals to short-cycle pearl millet (Bajra HHB-67).</span>
            </div>
          </div>
        </div>

        {/* Document Footer Signatures */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400" />
            <div className="pt-1.5 font-semibold text-slate-800">Farmer Signature / Acknowledgement</div>
            <div className="text-[10px] text-slate-400">Date: ______________</div>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400" />
            <div className="pt-1.5 font-semibold text-slate-800">GREENPULSE Agro-Advisory Engine</div>
            <div className="text-[10px] text-slate-400">Decision-Support System · CRIDA/ICAR Benchmark Calibration</div>
          </div>
        </div>
      </div>
    </div>
  );
};
