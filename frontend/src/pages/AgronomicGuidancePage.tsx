import React, { useState } from 'react';
import { AGRONOMIC_GUIDES } from '../data/mockData';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Droplets,
  Layers,
  Flame,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

export const AgronomicGuidancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Planting Windows',
    'Water Management',
    'Soil Improvement',
    'Heat Mitigation',
  ];

  const filteredGuides = AGRONOMIC_GUIDES.filter(guide => {
    if (selectedCategory !== 'all' && guide.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchCrops = guide.applicableCrops.some(c => c.toLowerCase().includes(q));
      const matchSummary = guide.summary.toLowerCase().includes(q);
      return matchTitle || matchCrops || matchSummary;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#123D2A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#16A36A] uppercase tracking-wider">
            <span>Agronomic Knowledge Base</span>
            <span>·</span>
            <span>University & Research Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tracking-tight">
            Climate-Adaptive Agronomic Guidance
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5E53] mt-1">
            Certified field management protocols, sowing calendar shifts, thermal protection, and soil carbon enhancement guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            ICAR / CRIDA Compliant Models
          </span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#123D2A]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop guidance (e.g. Groundnut, Drip, Sowing, Heat)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#123D2A] text-white font-bold shadow-xs'
                  : 'bg-[#F7F9F5] text-slate-600 hover:text-[#123D2A] border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map(guide => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-mono text-[#16A36A] font-semibold uppercase tracking-wide">
                  {guide.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {guide.publishDate}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#123D2A] leading-snug">
                {guide.title}
              </h2>

              <p className="text-xs text-[#4B5E53] leading-relaxed">
                {guide.summary}
              </p>

              {/* Applicable crops */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {guide.applicableCrops.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#123D2A]/5 text-[#123D2A] border border-[#123D2A]/10"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Key Practices Checklist */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">Key Field Protocols:</div>
                <ul className="space-y-1.5 text-xs text-[#4B5E53]">
                  {guide.keyPractices.map((practice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] shrink-0 mt-0.5" />
                      <span className="leading-snug">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Source Attribution Area */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#73877B]">
              <div className="truncate max-w-[85%]">
                <strong className="text-slate-800">Source:</strong> {guide.sourceAttribution}
              </div>
              <Bookmark className="w-4 h-4 text-slate-400 hover:text-[#16A36A] cursor-pointer shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <DemoDisclaimer text="Advisories presented are sample demonstrations modeled after ICAR and State Agricultural University guidelines. Always cross-reference with localized Krishi Vigyan Kendra (KVK) bulletins before seed purchase." />
    </div>
  );
};
