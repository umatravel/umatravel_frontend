import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Filter,
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { PackageCard } from '../components/packages/PackageCard.jsx';
import { TravelBackgroundCanvas } from '../components/common/TravelBackgroundCanvas.jsx';

export const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params extraction
  const urlDestination = searchParams.get('destination') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';
  const urlDuration = searchParams.get('duration') || '';
  const urlCustomizable = searchParams.get('customizable') === 'true';
  const urlSearch = searchParams.get('search') || '';
  const urlPage = Number(searchParams.get('page')) || 1;

  // Local filter states (sync with URL query initially and on prop changes)
  const [localDest, setLocalDest] = useState(urlDestination);
  const [localCategory, setLocalCategory] = useState(urlCategory);
  const [localMaxPrice, setLocalMaxPrice] = useState(urlMaxPrice || '100000');
  const [localDuration, setLocalDuration] = useState(urlDuration);
  const [localCustomizable, setLocalCustomizable] = useState(urlCustomizable);
  const [localSearch, setLocalSearch] = useState(urlSearch);

  // UI state
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync local inputs when URL parameters change externally (e.g. browser back/forward)
  useEffect(() => {
    setLocalDest(urlDestination);
    setLocalCategory(urlCategory);
    setLocalMaxPrice(urlMaxPrice || '100000');
    setLocalDuration(urlDuration);
    setLocalCustomizable(urlCustomizable);
    setLocalSearch(urlSearch);
  }, [urlDestination, urlCategory, urlMaxPrice, urlDuration, urlCustomizable, urlSearch]);

  // Debounced search effect (Search-as-you-type)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (localSearch.trim()) params.set('search', localSearch.trim());
      else params.delete('search');

      params.set('page', '1');
      setSearchParams(params);
    }, 450);

    return () => clearTimeout(handler);
  }, [localSearch]);

  // Fetch packages whenever search parameters or page changes
  const fetchPackages = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (urlDestination) params.append('destination', urlDestination);
    if (urlCategory) params.append('category', urlCategory);
    if (urlMaxPrice && urlMaxPrice !== '100000') params.append('maxPrice', urlMaxPrice);
    if (urlDuration) params.append('duration', urlDuration);
    if (urlCustomizable) params.append('customizable', 'true');
    if (urlSearch) params.append('search', urlSearch);
    params.append('page', urlPage.toString());
    params.append('limit', '9');

    try {
      const res = await api.get(`/packages?${params.toString()}`);
      if (res?.success) {
        setPackages(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again or check network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [urlDestination, urlCategory, urlMaxPrice, urlDuration, urlCustomizable, urlSearch, urlPage]);

  // Apply button inside sidebar filter
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (localDest.trim()) params.set('destination', localDest.trim());
    else params.delete('destination');

    if (localCategory.trim()) params.set('category', localCategory.trim());
    else params.delete('category');

    if (localMaxPrice && localMaxPrice !== '100000') params.set('maxPrice', localMaxPrice);
    else params.delete('maxPrice');

    if (localDuration.trim()) params.set('duration', localDuration.trim());
    else params.delete('duration');

    if (localCustomizable) params.set('customizable', 'true');
    else params.delete('customizable');

    params.set('page', '1');
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setLocalDest('');
    setLocalCategory('');
    setLocalMaxPrice('100000');
    setLocalDuration('');
    setLocalCustomizable(false);
    setLocalSearch('');
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  const categories = ['Adventure', 'Honeymoon', 'Cultural', 'Wildlife', 'Luxury Escape', 'Beach Resort'];
  const hasActiveFilters = Boolean(
    urlDestination || urlCategory || (urlMaxPrice && urlMaxPrice !== '100000') || urlDuration || urlCustomizable || urlSearch
  );

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28 font-['Afacad',sans-serif]">
      {/* 1. HERO HEADER (Uma International Rounded Teal Header Container) */}
      <section className="relative bg-[#0E545A] text-white pt-36 pb-24 rounded-b-[40px] sm:rounded-b-[50px] overflow-hidden shadow-2xl border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
            alt="Global luxury expeditions"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-10000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E545A] via-[#0E545A]/80 to-[#0E545A]/40" />
        </div>

        {/* Animated Flight Path Vectors */}
        <TravelBackgroundCanvas variant="dark" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-['Kaushan_Script',cursive] text-3xl sm:text-4xl text-[#ECA815] block mb-2 drop-shadow-sm">
              Discover More Tours & Packages
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-4xl sm:text-6xl text-white tracking-tight drop-shadow-md"
          >
            Explore Handcrafted <span className="text-[#ECA815]">Luxury Journeys</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed drop-shadow"
          >
            Filter by private luxury themes, exact budget range, duration, or specific worldwide destinations to find your extraordinary escape.
          </motion.p>

          {/* Quick Category Pills Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2.5 pt-4 max-w-4xl mx-auto"
          >
            <button
              onClick={() => {
                setLocalCategory('');
                const p = new URLSearchParams(searchParams);
                p.delete('category');
                p.set('page', '1');
                setSearchParams(p);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 cursor-pointer shadow-md ${
                !urlCategory
                  ? 'bg-[#86C232] text-[#0A2540] scale-105'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md hover:text-[#ECA815]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isSelected = urlCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const nextCat = isSelected ? '' : cat;
                    setLocalCategory(nextCat);
                    const p = new URLSearchParams(searchParams);
                    if (nextCat) p.set('category', nextCat);
                    else p.delete('category');
                    p.set('page', '1');
                    setSearchParams(p);
                  }}
                  className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-[#86C232] text-[#0A2540] scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md hover:border-[#ECA815]/50 hover:text-[#ECA815]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN CATALOG WORKSPACE (Sidebar + Search + Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Top Search & Mobile Drawer Trigger Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar with Debounced Search-as-You-Type */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tours by keyword, title, or destination..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-sm font-medium focus:outline-none focus:border-[#D96B27] focus:ring-2 focus:ring-[#D96B27]/20 transition-all"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle & Quick Info */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0A2540] text-white font-bold text-sm shadow-md hover:bg-[#0F3B4C] transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#E69536]" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#E69536]" />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="hidden sm:block text-xs font-bold text-slate-500 bg-[#FAFAF7] px-4 py-3 rounded-2xl border border-slate-200">
              Showing <span className="text-[#0A2540] font-extrabold">{pagination.total || packages.length}</span> Tours
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:sticky lg:top-28 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-lg space-y-7 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-heading font-extrabold text-lg text-[#0A2540] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#D96B27]" />
                <span>Refine Catalog</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#D96B27] hover:underline font-bold transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-6">
              {/* Destination Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Switzerland, Tokyo..."
                    value={localDest}
                    onChange={(e) => setLocalDest(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Tour Category
                </label>
                <select
                  value={localCategory}
                  onChange={(e) => setLocalCategory(e.target.value)}
                  aria-label="Tour Category"
                  className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm font-medium focus:outline-none focus:border-[#D96B27] focus:bg-white transition cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Max Price Limit
                  </label>
                  <span className="text-xs font-extrabold text-[#D96B27]">
                    ₹{Number(localMaxPrice || 100000).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={localMaxPrice || '100000'}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-full accent-[#D96B27] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>₹1,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000+</span>
                </div>
              </div>

              {/* Max Duration Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Max Duration (Days)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="Any length (e.g. 14)"
                    value={localDuration}
                    onChange={(e) => setLocalDuration(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* "Customizable Only" Checkbox */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group bg-[#FAFAF7] p-3.5 rounded-2xl border border-slate-200 hover:border-[#D96B27] transition">
                  <input
                    type="checkbox"
                    checked={localCustomizable}
                    onChange={(e) => setLocalCustomizable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D96B27] focus:ring-[#D96B27] accent-[#D96B27] cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E69536]" />
                      <span>Customizable Only</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Tailor hotel, dates & guide pacing
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D96B27] via-[#E69536] to-[#D96B27] hover:shadow-xl hover:shadow-[#D96B27]/30 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply Filters</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </aside>

          {/* MAIN PACKAGES GRID / STATES */}
          <main className="lg:col-span-3 space-y-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-[460px] bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between animate-pulse shadow-xs"
                  >
                    <div className="h-56 bg-slate-200 rounded-2xl" />
                    <div className="space-y-3 pt-4">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-6 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </div>
                    <div className="h-12 bg-slate-200 rounded-2xl mt-4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 border border-red-200 shadow-lg text-center max-w-xl mx-auto space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-xs">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                    Failed to Load Tour Catalog
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    {error}
                  </p>
                </div>
                <button
                  onClick={fetchPackages}
                  className="px-8 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Fetching Catalog</span>
                </button>
              </motion.div>
            ) : packages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-14 border border-slate-200/80 shadow-sm text-center max-w-xl mx-auto space-y-5"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center mx-auto border border-slate-200 shadow-xs">
                  <Compass className="w-10 h-10 text-[#D96B27]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-2xl text-[#0A2540]">
                    No Matching Expeditions Found
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    We couldn't find any tour packages matching your exact filters. Try loosening your destination keyword, budget limit, or clearing active filters.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-8 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {packages.map((pkg, idx) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={idx} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-10 border-t border-slate-200/80">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(Number(pagination.page) - 1));
                    setSearchParams(params);
                  }}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#D96B27] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-bold text-[#0A2540] bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
                  Page <span className="text-[#D96B27] font-extrabold">{pagination.page}</span> of {pagination.totalPages}
                </div>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(Number(pagination.page) + 1));
                    setSearchParams(params);
                  }}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#D96B27] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER FOR FILTERS */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-heading font-extrabold text-xl text-[#0A2540] flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#D96B27]" />
                    <span>Filter Catalog</span>
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
                    aria-label="Close filter drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleApplyFilters} className="space-y-6">
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Switzerland, Tokyo..."
                        value={localDest}
                        onChange={(e) => setLocalDest(e.target.value)}
                        className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27]"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Tour Category
                    </label>
                    <select
                      value={localCategory}
                      onChange={(e) => setLocalCategory(e.target.value)}
                      aria-label="Tour Category"
                      className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm font-medium focus:outline-none focus:border-[#D96B27]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Slider */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Max Price Limit
                      </label>
                      <span className="text-xs font-extrabold text-[#D96B27]">
                        ₹{Number(localMaxPrice || 100000).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={localMaxPrice || '100000'}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="w-full accent-[#D96B27]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>₹1,000</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000+</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Max Duration (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="Any length (e.g. 14)"
                      value={localDuration}
                      onChange={(e) => setLocalDuration(e.target.value)}
                      className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm font-medium focus:outline-none focus:border-[#D96B27]"
                    />
                  </div>

                  {/* Customizable Only */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer bg-[#FAFAF7] p-3.5 rounded-2xl border border-slate-200">
                      <input
                        type="checkbox"
                        checked={localCustomizable}
                        onChange={(e) => setLocalCustomizable(e.target.checked)}
                        className="w-4 h-4 rounded text-[#D96B27] focus:ring-[#D96B27] accent-[#D96B27]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#E69536]" />
                          <span>Customizable Only</span>
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="flex-1 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Clear All
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D96B27] via-[#E69536] to-[#D96B27] text-white font-bold text-xs shadow-md"
                    >
                      Apply Filters
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Packages;
