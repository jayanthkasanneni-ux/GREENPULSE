import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Compass,
  Scale,
  CloudSun,
  FlaskConical,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useApp } from '../../context/AppContext';

export const DashboardLayout: React.FC = () => {
  const {
    user,
    logout,
    activeSeason,
    setActiveSeason,
    activeLocation,
    setActiveLocation,
    updateFarmProfile,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  // The 7 core dashboard items requested
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Farm Profile', path: '/dashboard/farm-profile', icon: Sprout },
    { name: 'Crop Planning', path: '/dashboard/crop-planning', icon: Compass },
    { name: 'Climate Insights', path: '/dashboard/climate-insights', icon: CloudSun },
    { name: 'Crop Comparison', path: '/dashboard/crop-comparison', icon: Scale },
    { name: 'Soil Analysis', path: '/dashboard/soil-analysis', icon: FlaskConical },
    { name: 'Agronomic Guidance', path: '/dashboard/agronomic-guidance', icon: BookOpen },
  ];

  const availableLocations = [
    { district: 'Anantapur', state: 'Andhra Pradesh' },
    { district: 'Dharwad', state: 'Karnataka' },
    { district: 'Nashik', state: 'Maharashtra' },
    { district: 'Warangal', state: 'Telangana' },
    { district: 'Jodhpur', state: 'Rajasthan' },
  ];

  const availableSeasons = ['Kharif 2026', 'Rabi 2026-27', 'Zaid 2026'];

  const handleSelectLocation = (loc: { district: string; state: string }) => {
    setActiveLocation(loc);
    updateFarmProfile({ district: loc.district, state: loc.state });
    setLocationDropdownOpen(false);
  };

  const handleSelectSeason = (season: string) => {
    setActiveSeason(season);
    updateFarmProfile({ growingSeason: season });
    setSeasonDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col antialiased text-[#1C2922]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#123D2A]/10 h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-[#1C2922] lg:hidden hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center">
            <BrandLogo />
          </Link>

          {/* Breadcrumb / Screen Title */}
          <div className="hidden md:flex items-center gap-2 pl-4 ml-4 border-l border-slate-200 text-xs text-[#4B5E53]">
            <span>Farmer Hub</span>
            <span>/</span>
            <span className="font-semibold text-[#123D2A]">
              {navItems.find(item => item.path === currentPath)?.name || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Right Controls: Location, Season, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Selected Farm Location Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLocationDropdownOpen(!locationDropdownOpen);
                setSeasonDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#123D2A] bg-[#123D2A]/5 hover:bg-[#123D2A]/10 rounded-lg transition-colors border border-[#123D2A]/10 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
              <span className="max-w-[120px] sm:max-w-none truncate font-medium">
                {activeLocation.district}, {activeLocation.state.slice(0, 2).toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Farm District
                </div>
                {availableLocations.map(loc => (
                  <button
                    key={loc.district}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      activeLocation.district === loc.district
                        ? 'text-[#123D2A] font-bold bg-emerald-50/70'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{loc.district}, {loc.state}</span>
                    {activeLocation.district === loc.district && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Growing Season Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setSeasonDropdownOpen(!seasonDropdownOpen);
                setLocationDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#123D2A] bg-[#123D2A]/5 hover:bg-[#123D2A]/10 rounded-lg transition-colors border border-[#123D2A]/10 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#16A36A]" />
              <span className="font-medium">{activeSeason}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {seasonDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Growing Season
                </div>
                {availableSeasons.map(season => (
                  <button
                    key={season}
                    onClick={() => handleSelectSeason(season)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      activeSeason === season
                        ? 'text-[#123D2A] font-bold bg-emerald-50/70'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{season}</span>
                    {activeSeason === season && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setLocationDropdownOpen(false);
                setSeasonDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#123D2A] text-[#B7E36B] flex items-center justify-center text-xs font-bold font-sans">
                {user?.name ? user.name.charAt(0) : 'F'}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-[#1C2922] max-w-[110px] truncate">
                {user?.name?.split(' ')[0] || 'Farmer'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-[#1C2922] truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                </div>
                <Link
                  to="/dashboard/farm-profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#123D2A]"
                >
                  Edit Farm Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#123D2A]"
                >
                  <span>Public Landing Page</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#123D2A]/10 bg-white transition-all duration-200 ease-in-out shrink-0 ${
            sidebarCollapsed ? 'w-18' : 'w-64'
          }`}
        >
          {/* Greeting Banner */}
          {!sidebarCollapsed && (
            <div className="p-4 mx-3 mt-3 mb-1 rounded-xl bg-gradient-to-br from-[#123D2A]/5 to-[#16A36A]/5 border border-[#123D2A]/10">
              <div className="text-[11px] font-semibold text-[#16A36A] uppercase tracking-wider">
                Farmer Dashboard
              </div>
              <div className="text-xs font-bold text-[#123D2A] mt-0.5">
                Good morning, {user?.name?.split(' ')[0] || 'Farmer'}!
              </div>
              <div className="text-[11px] text-[#4B5E53] mt-1 flex items-center gap-1">
                <span>Location:</span>
                <span className="font-semibold text-[#123D2A]">{activeLocation.district}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#123D2A] text-white shadow-sm font-semibold'
                      : 'text-[#4B5E53] hover:text-[#123D2A] hover:bg-[#123D2A]/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#B7E36B]' : 'text-[#73877B] group-hover:text-[#123D2A]'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate whitespace-nowrap">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-500 hover:text-[#123D2A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Collapse Navigation</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Content Drawer */}
            <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl flex flex-col z-10">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <BrandLogo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3">
                <div className="p-3 rounded-lg bg-emerald-50 text-xs">
                  <p className="font-semibold text-[#123D2A]">Selected Location:</p>
                  <p className="text-[#4B5E53] font-medium">{activeLocation.district}, {activeLocation.state}</p>
                </div>
              </div>

              <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                        isActive
                          ? 'bg-[#123D2A] text-white shadow-sm font-semibold'
                          : 'text-[#4B5E53] hover:text-[#123D2A] hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#B7E36B]' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#123D2A] border border-[#123D2A]/20 rounded-lg"
                >
                  Public Landing Page
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
