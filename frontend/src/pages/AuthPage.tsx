import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useApp();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: 'Rameshwar Reddy',
    email: 'rameshwar.reddy@agrimail.in',
    password: 'password123',
    phone: '+91 98490 23411',
    location: 'Anantapur, Andhra Pradesh',
    language: 'English',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (mode === 'register') {
      if (!formData.name.trim()) errs.name = 'Full name is required';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (!formData.location.trim()) errs.location = 'Location/District is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'login') {
      login(formData.email, formData.name || 'Farmer Member');
    } else {
      register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        language: formData.language,
      });
    }
    navigate('/dashboard');
  };

  const handleQuickDemoLogin = () => {
    login('rameshwar.reddy@agrimail.in', 'Rameshwar Reddy');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <BrandLogo />
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight">
          {mode === 'login' ? 'Sign in to GREENPULSE' : 'Create Farmer Account'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#4B5E53]">
          {mode === 'login' ? (
            <>
              New to GREENPULSE?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setErrors({});
                }}
                className="font-semibold text-[#16A36A] hover:underline"
              >
                Register your farm
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setErrors({});
                }}
                className="font-semibold text-[#16A36A] hover:underline"
              >
                Sign in here
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#123D2A]/10 shadow-sm">
          {/* Quick Demo Access banner for Hackathon reviewers */}
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="text-xs text-emerald-900 leading-snug">
              <span className="font-bold">Hackathon Evaluator:</span> Instant demo login with pre-loaded farm profile.
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="shrink-0 px-3 py-1.5 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] rounded-lg transition-colors shadow-xs"
            >
              Demo Login
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rameshwar Reddy"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98490 23411"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent font-mono"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                    Location / District
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Anantapur, Andhra Pradesh"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                    />
                  </div>
                  {errors.location && <p className="text-[11px] text-rose-600 mt-1">{errors.location}</p>}
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.language}
                      onChange={e => setFormData({ ...formData, language: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@agrimail.in"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2922] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#16A36A] focus:ring-[#16A36A]" />
                  <span>Remember this device</span>
                </label>
                <span className="text-[#16A36A] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.99] rounded-xl transition-all shadow-sm"
            >
              <span>{mode === 'login' ? 'Sign In to Farm Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B7E36B]" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-[#73877B]">
            Protected by GREENPULSE smallholder security protocols.
          </div>
        </div>
      </div>
    </div>
  );
};
