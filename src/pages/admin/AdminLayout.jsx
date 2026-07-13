import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import umaLogo from '../../assets/Uma_logo_w.png';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out from Admin Portal');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Packages', path: '/admin/packages', icon: Package },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Stories', path: '/admin/stories', icon: BookOpen },
  ];

  const getPageInfo = () => {
    if (location.pathname.includes('/admin/packages')) {
      return {
        title: 'Tour Packages Catalog',
        subtitle: 'Manage travel itineraries, pricing, dates, and featured tours.',
      };
    }
    if (location.pathname.includes('/admin/bookings')) {
      return {
        title: 'Guest Bookings Management',
        subtitle: 'Review reservation requests, contact travelers, and update booking statuses.',
      };
    }
    if (location.pathname.includes('/admin/stories')) {
      return {
        title: 'Travel Chronicles & Blog Content',
        subtitle: 'Publish inspiring travel stories, guides, and customer testimonials.',
      };
    }
    return {
      title: 'Executive Overview',
      subtitle: 'Real-time reservation metrics, financial performance, and latest inquiries.',
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAFAF7] text-slate-800 flex font-['Afacad',sans-serif]">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Responsive Deep Teal Sidebar (Fixed in place) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-full shrink-0 bg-[#0E545A] text-white border-r border-[#08383c] flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand / Logo Section */}
        <div>
          <div className="h-24 px-6 flex flex-col justify-center border-b border-white/10 bg-[#0E545A] relative">
            <div className="flex items-center justify-between">
              <Link to="/" className="block py-1">
                <img
                  src={umaLogo}
                  alt="Uma Travels Brand Logo"
                  className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden transition"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[#ECA815]/20 text-[#ECA815] border border-[#ECA815]/30">
                <ShieldCheck className="w-3 h-3 text-[#ECA815]" />
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 mt-2">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white/60">
              Management Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path || location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#0E545A] shadow-lg font-bold scale-[1.02]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-[#0E545A]' : 'text-white/70 group-hover:text-[#ECA815]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#0E545A]" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Logout Button */}
        <div className="p-4 border-t border-white/10 bg-[#0b4247]/60 space-y-3">
          <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-[#ECA815] font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.email || 'admin@umatravel.in'}
              </p>
              <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Active Session
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white/90 hover:text-white border border-white/15 hover:border-rose-500 text-xs font-bold transition-all duration-200 shadow-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#ECA815] group-hover:text-white" />
            <span>Sign Out of Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Fixed outer column, scrollable inner main) */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-[#FAFAF7] overflow-hidden">
        {/* Top Navbar (Fixed in place at the top) */}
        <header className="h-24 shrink-0 bg-white/95 border-b border-slate-200/80 backdrop-blur-md z-30 px-6 sm:px-8 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 lg:hidden transition border border-slate-200 shadow-2xs"
              aria-label="Toggle Mobile Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {pageInfo.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Quick Actions / Status Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#0E545A] text-slate-700 hover:text-white text-xs font-semibold transition border border-slate-200/80 shadow-2xs"
              title="Return to public travel website"
            >
              <Globe className="w-3.5 h-3.5 text-[#0E545A] group-hover:text-white" />
              <span>View Public Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hidden sm:flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </span>

            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0E545A] to-[#08383c] flex items-center justify-center text-white font-bold text-sm shadow-sm border border-white/20">
              {user?.email ? user.email[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (ONLY this inner section scrolls) */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
