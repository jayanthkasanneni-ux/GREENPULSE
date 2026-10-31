import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#F7F9F5]/95 backdrop-blur-md border-b border-[#123D2A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: GREENPULSE Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <BrandLogo />
          </Link>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1C2922]">
            <Link to="/" className="hover:text-[#16A36A] transition-colors whitespace-nowrap">
              Home
            </Link>
            <a href="#features" className="hover:text-[#16A36A] transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#16A36A] transition-colors whitespace-nowrap">
              How It Works
            </a>
            {user?.isAuthenticated ? (
              <Link to="/dashboard" className="hover:text-[#16A36A] transition-colors whitespace-nowrap">
                Farmer Dashboard
              </Link>
            ) : (
              <Link to="/login" className="hover:text-[#16A36A] transition-colors whitespace-nowrap">
                Sign In
              </Link>
            )}
          </nav>

          {/* Zone 3: 1 Primary CTA Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/dashboard/crop-planning')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1A543B] active:scale-[0.98] rounded-lg transition-all shadow-sm whitespace-nowrap"
            >
              <span>{user?.isAuthenticated ? 'Start Crop Planning' : 'Get Started'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B7E36B]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C2922] hover:bg-[#123D2A]/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#123D2A]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#123D2A]/10 bg-white px-5 pt-3 pb-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#1C2922]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#16A36A]"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#16A36A]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#16A36A]"
            >
              How It Works
            </a>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#16A36A]"
            >
              Sign In
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard/crop-planning');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#123D2A] rounded-lg"
            >
              <span>Start Crop Planning</span>
              <ArrowRight className="w-4 h-4 text-[#B7E36B]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
