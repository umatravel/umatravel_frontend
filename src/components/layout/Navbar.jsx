import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ShieldCheck} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import umaLogo from '../../assets/Uma_logo_w.png';
import iataLogo from '../../assets/iata-logo.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isDarkHeader = isHomePage && !scrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Track scroll for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Stories', path: '/stories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-3 px-3 sm:px-6 pointer-events-none">
      <header
        className={`max-w-7xl mx-auto rounded-[32px] transition-all duration-300 pointer-events-auto flex items-center justify-between px-6 sm:px-10 py-4 shadow-2xl border border-white/15 ${
          scrolled
            ? 'bg-[#0E545A]/95 backdrop-blur-xl py-3.5 shadow-[#0E545A]/30'
            : 'bg-[#0E545A] py-4.5'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group py-1 shrink-0">
          <img
            src={umaLogo}
            alt="Uma International Travel Services"
            className="h-10 sm:h-12 w-auto max-w-[210px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links (Uma International Typography) */}
        <nav className="hidden lg:flex items-center gap-8 font-['Afacad',sans-serif]">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-semibold transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-[#ECA815] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ECA815] after:rounded-full'
                    : 'text-white/90 hover:text-[#ECA815]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA / Admin Action / IATA Supporting Logo */}
        <div className="hidden sm:flex items-center gap-3.5 font-['Afacad',sans-serif]">
          {/* IATA Supporting Trust Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md">
            <img src={iataLogo} alt="IATA Accredited" className="h-5 w-auto object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9.5px] font-extrabold tracking-wider uppercase leading-none">IATA Accredited</span>
              <span className="text-[8px] font-semibold text-[#ECA815] leading-none mt-0.5">Global Partner</span>
            </div>
          </div>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-white/10 text-[#ECA815] border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}

          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#86C232] hover:bg-[#A3E635] text-[#0A2540] text-sm sm:text-base font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Book Tour</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-3 max-w-7xl mx-auto rounded-[28px] bg-[#0E545A]/98 backdrop-blur-xl border border-white/15 shadow-2xl px-6 py-6 space-y-4 pointer-events-auto font-['Afacad',sans-serif]"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                      isActive
                        ? 'bg-[#86C232] text-[#0A2540]'
                        : 'text-white hover:bg-white/10 hover:text-[#ECA815]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-full bg-white/10 text-[#ECA815] font-bold text-center border border-white/20 block"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/packages"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#86C232] text-[#0A2540] font-extrabold text-center shadow-lg block"
              >
                Book Your Tour
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
