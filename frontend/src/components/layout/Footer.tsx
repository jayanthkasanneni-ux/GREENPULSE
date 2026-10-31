import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#123D2A] text-white border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-3">
            <BrandLogo lightMode={true} showTagline={true} />
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Climate-resilient agricultural decision-support platform designed to help smallholder farmers make informed crop planning decisions.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7E36B]">
              Farmer Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Farmer Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/crop-planning" className="hover:text-white transition-colors">Crop Planning</Link>
              </li>
              <li>
                <Link to="/dashboard/agronomic-guidance" className="hover:text-white transition-colors">Agronomic Guidance</Link>
              </li>
            </ul>
          </div>

          {/* Agronomic Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7E36B]">
              Advisory Integrity
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              GREENPULSE evaluates climate risks and verified ICAR recommendations instead of guaranteeing crop yields. Always cross-check with local agricultural officers.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <p>© 2026 GREENPULSE. Growing Smarter with Climate Intelligence.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <span>·</span>
            <Link to="/dashboard/crop-planning" className="hover:text-white">Start Planning</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
