import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  CloudSun,
  FlaskConical,
  Droplets,
  Sprout,
  Scale,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ThermometerSun,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Climate Intelligence',
      description: 'Synthesizes 10+ years of local monsoon rainfall trends, temperature extremes, and dry-spell recurrence cycles.',
      icon: CloudSun,
      stat: '10-Yr Historical Baseline',
      path: '/dashboard/climate-insights',
    },
    {
      title: 'Soil Analysis',
      description: 'Evaluates topsoil texture, pH equilibrium, and N-P-K nutrient status to recommend crops that naturally thrive.',
      icon: FlaskConical,
      stat: '5 Major Soil Classifications',
      path: '/dashboard/soil-analysis',
    },
    {
      title: 'Water Resource Assessment',
      description: 'Calculates seasonal crop water requirements against borewell yields, canal schedules, and rainfed reserves.',
      icon: Droplets,
      stat: 'Deficit-Aware Calculations',
      path: '/dashboard/water-management',
    },
    {
      title: 'Smart Crop Recommendations',
      description: 'Generates suitability scores tailored to smallholder land parcels, factoring in both economic upside and climate security.',
      icon: Sprout,
      stat: 'Decision-Support Scoring',
      path: '/dashboard/recommendations',
    },
    {
      title: 'Crop Risk Comparison',
      description: 'Compares multiple crops side-by-side across drought sensitivity, thermal threshold, and waterlogging vulnerability.',
      icon: Scale,
      stat: 'Comparative Tradeoff Engine',
      path: '/dashboard/crop-comparison',
    },
    {
      title: 'Agronomic Guidance',
      description: 'Provides actionable contingency protocols, certified sowing windows, and stress-abatement field practices.',
      icon: BookOpen,
      stat: 'ICAR / University Aligned',
      path: '/dashboard/agronomic-guidance',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Farm Details',
      desc: 'Specify your district, acreage, visual soil type, and existing irrigation sources.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'Analyse Climate & Soil',
      desc: 'Our engine assesses seasonal rainfall forecasts, historical dry spells, and soil retention.',
      icon: CloudSun,
    },
    {
      number: '03',
      title: 'Compare Suitable Crops',
      desc: 'Examine candidates like Groundnut, Millets, Maize, and Pulses across risk parameters.',
      icon: Scale,
    },
    {
      number: '04',
      title: 'Make Informed Decisions',
      desc: 'Download printable field dossiers with certified sowing dates and contingency tactics.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#123D2A]/5 text-[#123D2A] text-xs font-semibold border border-[#123D2A]/10">
                <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
                <span>Next-Gen Climate Agricultural Decision Support</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#123D2A] tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
                Grow Smarter. <br />
                <span className="text-[#16A36A]">Adapt Stronger.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4B5E53] max-w-xl leading-relaxed">
                Make climate-informed crop decisions using weather intelligence, soil insights, and water availability. Designed for smallholder resilience against unpredictable seasons.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard/crop-planning')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <span>Start Crop Planning</span>
                  <ArrowRight className="w-4 h-4 text-[#B7E36B]" />
                </button>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#123D2A] bg-white hover:bg-slate-50 border border-[#123D2A]/15 rounded-xl transition-all shadow-xs whitespace-nowrap"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Key Highlights */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-bold text-[#123D2A] font-mono tabular-nums">480mm</div>
                  <div className="text-xs text-[#73877B] mt-0.5">Historical Normal Rainfall</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#16A36A] font-mono tabular-nums">6 Crops</div>
                  <div className="text-xs text-[#73877B] mt-0.5">Benchmarked Candidates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#123D2A] font-mono tabular-nums">100%</div>
                  <div className="text-xs text-[#73877B] mt-0.5">Transparent Risk Models</div>
                </div>
              </div>
            </div>

            {/* Right Media & Floating Insight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#123D2A]/15 shadow-xl bg-slate-900 aspect-4/3 sm:aspect-16/11">
                <img
                  src="/src/assets/images/hero_agritech_farmland_1793426698007.jpg"
                  alt="Precision agricultural farmland with healthy crop rows"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123D2A]/80 via-[#123D2A]/25 to-transparent" />

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-4 h-4 text-[#B7E36B]" />
                    <span className="font-medium">Deccan Dryland Agro-Ecological Zone</span>
                  </div>
                  <span className="text-[11px] text-white/80 font-mono">Survey #142/B</span>
                </div>
              </div>

              {/* Floating Climate Insight Card */}
              <div className="sm:absolute -bottom-8 -left-6 sm:max-w-xs w-full mt-4 sm:mt-0 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#123D2A]/15 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#123D2A]">
                    <CloudSun className="w-4 h-4 text-[#16A36A]" />
                    <span>Seasonal Climate Outlook</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                    Kharif 2026
                  </span>
                </div>

                <div className="pt-2 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Forecast Rainfall:</span>
                    <span className="font-mono font-bold text-[#1C2922] tabular-nums">488 mm (+4.2%)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Dry Spell Probability:</span>
                    <span className="font-mono font-bold text-amber-700 tabular-nums">Week 31 (Moderate)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Top Resilient Choice:</span>
                    <span className="font-semibold text-[#16A36A]">Groundnut + Redgram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem and Solution Section */}
      <section id="problem-solution" className="py-20 bg-white border-y border-[#123D2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A]">
              The Agricultural Reality
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] mt-2">
              Why Traditional Crop Planning Fails in a Changing Climate
            </h2>
            <p className="text-sm sm:text-base text-[#4B5E53] mt-3 leading-relaxed">
              Erratic monsoon onsets, prolonged dry spells, and sudden thermal spikes make traditional sowing intuitions risky. Smallholders need transparent climate decision-support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* The Old Way: Vulnerable & Reactive */}
            <div className="p-8 rounded-2xl bg-[#F7F9F5] border border-rose-200/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>The Traditional Vulnerability</span>
                </div>
                <h3 className="text-xl font-bold text-[#1C2922]">
                  Guessing Against Climate Volatility
                </h3>
                <ul className="space-y-3 text-sm text-[#4B5E53]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Fixed calendar sowing without checking cumulative root-zone moisture leads to seed germination failure.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Planting water-thirsty crops like flooded rice in depleting borewell zones causes mid-season crop abandonment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Unexplained vendor promises without transparent risk factors leave smallholders trapped in debt cycles.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200/40 text-xs text-rose-800 font-medium">
                Consequence: Up to 45% seasonal revenue loss during unexpected dry spells.
              </div>
            </div>

            {/* The GREENPULSE Way: Intelligent & Climate-Adaptive */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#123D2A] to-[#1A543B] text-white flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B7E36B] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#B7E36B]" />
                  <span>The GREENPULSE Approach</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Decision Support Grounded in Science
                </h3>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7E36B] mt-2 shrink-0" />
                    <span>Calculates 10-year historical rainfall baselines and ensemble anomaly trends before recommending sowing dates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7E36B] mt-2 shrink-0" />
                    <span>Compares drought, heat, and excess rain sensitivity side-by-side so farmers pick risk-tolerable alternatives.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7E36B] mt-2 shrink-0" />
                    <span>Never guarantees unrealistic yield figures; instead provides verified ICAR contingency measures.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#B7E36B] font-medium flex items-center justify-between">
                <span>Outcome: Resilient harvest survival across climate shocks.</span>
                <Link to="/dashboard" className="underline hover:text-white">See Platform →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Attractive Feature Cards */}
      <section id="features" className="py-20 bg-[#F7F9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A]">
              Comprehensive Decision Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] mt-2">
              Engineered for Climate-Aware Farming
            </h2>
            <p className="text-sm sm:text-base text-[#4B5E53] mt-3">
              Six core technological modules analyzing farm micro-climate, soil chemistry, and crop phenology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl border border-[#123D2A]/10 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#123D2A]/5 text-[#123D2A] group-hover:bg-[#123D2A] group-hover:text-[#B7E36B] transition-colors flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-medium text-[#73877B]">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1C2922]">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4B5E53] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[#16A36A] font-semibold">{feat.stat}</span>
                    <button
                      onClick={() => navigate(feat.path)}
                      className="text-[#123D2A] group-hover:text-[#16A36A] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section: 4-Step Process */}
      <section id="how-it-works" className="py-20 bg-white border-t border-[#123D2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A]">
              Simple 4-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] mt-2">
              From Soil Data to Field Decisions
            </h2>
            <p className="text-sm sm:text-base text-[#4B5E53] mt-3">
              Clear, structured guidance without cumbersome manual data entry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="p-6 rounded-2xl bg-[#F7F9F5] border border-[#123D2A]/10 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold font-mono text-[#123D2A]/20">
                        {step.number}
                      </span>
                      <div className="p-2 rounded-lg bg-white border border-[#123D2A]/10 text-[#16A36A]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#1C2922]">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4B5E53] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/dashboard/crop-planning')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] rounded-xl shadow-sm transition-all"
            >
              <span>Launch Step-by-Step Wizard</span>
              <ArrowRight className="w-4 h-4 text-[#B7E36B]" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#F7F9F5] border-t border-[#123D2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A]">
                About GREENPULSE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A]">
                Empowering the Backbone of Food Security
              </h2>
              <p className="text-sm sm:text-base text-[#4B5E53] leading-relaxed">
                Smallholder farmers produce over a third of the world&apos;s food yet face the steepest climate risks. GREENPULSE bridges the gap between complex meteorological simulations and everyday farm gate realities.
              </p>
              <p className="text-sm text-[#4B5E53] leading-relaxed">
                Our models prioritize drought-hardy millets, oilseeds, and pulse intercrops, offering clear reasons for every risk flag rather than mysterious black-box scores.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#123D2A]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  <span>Open Agronomy Standards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  <span>Transparent Explanations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  <span>Smallholder Focused</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-white border border-[#123D2A]/10 shadow-xs">
                <div className="text-3xl font-extrabold text-[#123D2A] font-mono tabular-nums">92%</div>
                <div className="text-xs text-[#4B5E53] mt-1 font-medium">Groundnut Match Accuracy in Red Loams</div>
              </div>
              <div className="p-6 rounded-xl bg-white border border-[#123D2A]/10 shadow-xs">
                <div className="text-3xl font-extrabold text-[#16A36A] font-mono tabular-nums">-35%</div>
                <div className="text-xs text-[#4B5E53] mt-1 font-medium">Water Use with Deficit Scheduling</div>
              </div>
              <div className="p-6 rounded-xl bg-white border border-[#123D2A]/10 shadow-xs">
                <div className="text-3xl font-extrabold text-[#123D2A] font-mono tabular-nums">14+</div>
                <div className="text-xs text-[#4B5E53] mt-1 font-medium">Agro-Ecological Sub-Districts</div>
              </div>
              <div className="p-6 rounded-xl bg-white border border-[#123D2A]/10 shadow-xs">
                <div className="text-3xl font-extrabold text-[#16A36A] font-mono tabular-nums">100%</div>
                <div className="text-xs text-[#4B5E53] mt-1 font-medium">Free Access for Hackathon Preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-gradient-to-br from-[#123D2A] to-[#0C281B] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B7E36B]">
            Start Sowing With Confidence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Your next growing season starts with a smarter decision.
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Run a 3-minute climate analysis for your land parcel. Compare crop options, inspect thermal and rainfall risks, and protect your harvest.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard/crop-planning')}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-[#123D2A] bg-[#B7E36B] hover:bg-[#A5D853] rounded-xl shadow-lg transition-all"
            >
              <span>Begin Crop Planning Wizard</span>
              <ArrowRight className="w-4 h-4 text-[#123D2A]" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all"
            >
              <span>Preview Demo Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
