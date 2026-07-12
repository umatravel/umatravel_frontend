import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Star,
  Sparkles,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  X,
  Share2,
  Heart,
  HelpCircle,
  PhoneCall,
  Mail,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { formatCurrency } from '../utils/format.js';
import { BookingForm } from '../components/booking/BookingForm.jsx';
import { MultiStepBookingModal } from '../components/booking/MultiStepBookingModal.jsx';
import { PackageCard } from '../components/packages/PackageCard.jsx';

export const PackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'itinerary' | 'inclusions' | 'customization'
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openDays, setOpenDays] = useState({ 1: true });
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [multiStepModalOpen, setMultiStepModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/packages/${slug}`);
        const packageData = res.data || null;
        setPkg(packageData);

        if (packageData) {
          // Initialize first day of itinerary as open
          if (packageData.itinerary && packageData.itinerary.length > 0) {
            setOpenDays({ [packageData.itinerary[0].day_number]: true });
          }

          // Fetch related packages
          try {
            const relRes = await api.get(`/packages?category=${encodeURIComponent(packageData.category)}&limit=4`);
            if (relRes.data && Array.isArray(relRes.data)) {
              setRelatedPackages(relRes.data.filter((p) => p.id !== packageData.id).slice(0, 3));
            }
          } catch (e) {
            console.error('Failed to load related tours:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load package details:', err);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const toggleDay = (dayNum) => {
    setOpenDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const expandAllDays = () => {
    if (!pkg?.itinerary) return;
    const allOpen = {};
    pkg.itinerary.forEach((day) => {
      allOpen[day.day_number] = true;
    });
    setOpenDays(allOpen);
  };

  const collapseAllDays = () => {
    setOpenDays({});
  };

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse pb-28 bg-[#FAFAF7] min-h-screen pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-6 bg-slate-200 rounded w-32" />
          <div className="h-12 bg-slate-200 rounded w-2/3" />
          <div className="h-[460px] bg-slate-200 rounded-3xl w-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-14 bg-slate-200 rounded-2xl w-full" />
            <div className="h-64 bg-slate-200 rounded-3xl w-full" />
            <div className="h-96 bg-slate-200 rounded-3xl w-full" />
          </div>
          <div className="h-[580px] bg-slate-200 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4 py-36 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center mx-auto border border-slate-200 shadow-xs">
            <Compass className="w-10 h-10 text-[#D96B27]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-extrabold text-3xl text-[#0A2540]">
              Tour Package Not Found
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The expedition you requested may have been archived, updated, or moved to another seasonal itinerary.
            </p>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tour Catalog</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const rawImages = pkg.package_images || pkg.images;
  const images =
    rawImages && rawImages.length > 0
      ? [...rawImages].sort(
          (a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || (a.sort_order || 0) - (b.sort_order || 0)
        )
      : [
          {
            id: 'placeholder',
            image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
          },
        ];

  const itinerary = pkg.itinerary
    ? [...pkg.itinerary].sort((a, b) => a.day_number - b.day_number)
    : pkg.package_itinerary
    ? [...pkg.package_itinerary].sort((a, b) => a.day_number - b.day_number)
    : [];

  const includedItems =
    pkg.included || (pkg.package_inclusions ? pkg.package_inclusions.filter((i) => i.type === 'included') : []);
  const excludedItems =
    pkg.excluded || (pkg.package_inclusions ? pkg.package_inclusions.filter((i) => i.type === 'excluded') : []);

  const displayPrice = pkg.discount_price || pkg.price || 0;
  const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-32">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="pt-28 pb-6 bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E69536] hover:text-white transition bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: pkg.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tour link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#E69536]" />
              <span>Share Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Title & Primary Metadata */}
      <section className="bg-[#0A2540] text-white pb-12 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-gradient-to-r from-[#D96B27] to-[#E69536] text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              {pkg.category || 'Luxury Expedition'}
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
              <MapPin className="w-4 h-4 text-[#E69536]" />
              <span>{pkg.destination}</span>
            </div>
            {pkg.is_customizable && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E69536] bg-black/40 px-3.5 py-1 rounded-full border border-[#E69536]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fully Customizable Itinerary</span>
              </div>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-md">
            {pkg.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-2 border-t border-white/15">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
                <Calendar className="w-4 h-4 text-[#E69536]" />
                <span>{pkg.duration_days} Days / {pkg.duration_nights} Nights</span>
              </div>

              {pkg.max_group_size && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
                  <Users className="w-4 h-4 text-[#E69536]" />
                  <span>Max Group: {pkg.max_group_size} Guests</span>
                </div>
              )}

              {/* Rating Placeholder */}
              <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-2xl font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0</span>
                <span className="text-xs font-normal text-slate-300 ml-1">(48 Verified Reviews)</span>
              </div>
            </div>

            {/* Price Badge Header */}
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Starting from</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                  {formatCurrency(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 font-semibold line-through">
                    {formatCurrency(pkg.price)}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-300 font-semibold">/ guest</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOP IMAGE GALLERY & CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xl space-y-4">
          {/* Main Hero Gallery Box */}
          <div className="relative h-[400px] sm:h-[520px] rounded-2xl overflow-hidden bg-[#0A2540] group">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={images[activeImageIndex]?.image_url}
              alt={pkg.title}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-102 transition-transform duration-700"
              onClick={() => setLightboxOpen(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Lightbox Trigger Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#0A2540] px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-2 transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-[#D96B27]" />
              <span>Full Screen Gallery ({activeImageIndex + 1}/{images.length})</span>
            </button>

            {/* Left/Right Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#0A2540] flex items-center justify-center shadow-lg backdrop-blur-md transition cursor-pointer hover:scale-110"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#0A2540] flex items-center justify-center shadow-lg backdrop-blur-md transition cursor-pointer hover:scale-110"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#D96B27] scale-105 shadow-md ring-2 ring-[#D96B27]/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT & SIDEBAR WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* LEFT 2 COLUMNS: TABS & SECTIONS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Tab Navigation Header */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-2 sticky top-20 z-30 backdrop-blur-md bg-white/95">
              {[
                { id: 'overview', label: 'Overview', icon: Compass },
                { id: 'itinerary', label: `Day-by-Day Itinerary (${itinerary.length})`, icon: Clock },
                { id: 'inclusions', label: 'Inclusions & Exclusions', icon: CheckCircle2 },
                ...(pkg.is_customizable
                  ? [{ id: 'customization', label: 'Customization VIP Notes', icon: Sparkles }]
                  : []),
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      const el = document.getElementById(`section-${tab.id}`);
                      if (el) {
                        const yOffset = -140;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0A2540] text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0A2540]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#E69536]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SECTION 1: OVERVIEW */}
            <section
              id="section-overview"
              className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6 scroll-mt-36"
            >
              <h2 className="font-heading font-extrabold text-2xl text-[#0A2540] flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Compass className="w-6 h-6 text-[#D96B27]" />
                <span>Expedition Overview & Highlights</span>
              </h2>
              <div className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
                {pkg.description}
              </div>

              {/* Quick Trust Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAFAF7] border border-slate-200/80">
                  <ShieldCheck className="w-6 h-6 text-[#D96B27] shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2540] block">24/7 Global Dispatch</span>
                    <span className="text-[11px] text-slate-500">Full concierge support</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAFAF7] border border-slate-200/80">
                  <Star className="w-6 h-6 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2540] block">Handpicked Hotels</span>
                    <span className="text-[11px] text-slate-500">Guaranteed VIP comfort</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAFAF7] border border-slate-200/80">
                  <Clock className="w-6 h-6 text-[#0A2540] shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2540] block">Flexible Booking</span>
                    <span className="text-[11px] text-slate-500">Reschedule peace of mind</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: DAY-BY-DAY ITINERARY ACCORDION */}
            <section id="section-itinerary" className="space-y-6 scroll-mt-36">
              <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-heading font-extrabold text-2xl text-[#0A2540] flex items-center gap-2.5">
                  <Clock className="w-6 h-6 text-[#D96B27]" />
                  <span>Day-by-Day Itinerary Schedule</span>
                </h2>
                {itinerary.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={expandAllDays}
                      className="text-xs font-bold text-[#0A2540] hover:text-[#D96B27] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllDays}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                )}
              </div>

              {itinerary.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-600 font-bold text-base">Daily Schedule Tailored Upon Request</p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Because this is a bespoke expedition, our senior travel designers build the exact daily timeline around your preferred flight arrival and pacing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itinerary.map((day, index) => {
                    const isOpen = openDays[day.day_number];
                    return (
                      <motion.div
                        key={day.id || day.day_number}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.04 }}
                        className={`border rounded-3xl overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? 'bg-white border-[#D96B27]/40 shadow-lg ring-1 ring-[#D96B27]/20'
                            : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleDay(day.day_number)}
                          className="w-full px-7 py-5 flex items-center justify-between text-left font-heading font-extrabold text-base sm:text-lg text-[#0A2540] hover:bg-slate-50 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`w-10 h-10 rounded-2xl font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                                isOpen
                                  ? 'bg-[#D96B27] text-white'
                                  : 'bg-[#0A2540] text-white'
                              }`}
                            >
                              Day {day.day_number}
                            </span>
                            <span className="text-[#0A2540] line-clamp-1 sm:line-clamp-none">{day.title}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 ml-2">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-[#D96B27]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-7 pb-7 pt-4 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFAF7]/70 space-y-3"
                            >
                              <p className="whitespace-pre-line">{day.description}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECTION 3: INCLUSIONS & EXCLUSIONS (TWO-COLUMN CHECK/CROSS LIST) */}
            <section
              id="section-inclusions"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md scroll-mt-36"
            >
              {/* Included Column */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900">What is Included</h3>
                    <span className="text-xs text-slate-400">Guaranteed in your reservation</span>
                  </div>
                </div>

                {includedItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Standard luxury accommodations, guided tours, and local transfers included.</p>
                ) : (
                  <ul className="space-y-4 text-sm text-slate-700">
                    {includedItems.map((inc) => (
                      <li key={inc.id || inc.description} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{inc.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Excluded Column */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-xs">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900">What is Excluded</h3>
                    <span className="text-xs text-slate-400">Personal expenses or extras</span>
                  </div>
                </div>

                {excludedItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No unusual exclusions noted.</p>
                ) : (
                  <ul className="space-y-4 text-sm text-slate-700">
                    {excludedItems.map((exc) => (
                      <li key={exc.id || exc.description} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{exc.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* SECTION 4: CUSTOMIZATION NOTES (IF IS_CUSTOMIZABLE) */}
            {pkg.is_customizable && (
              <section
                id="section-customization"
                className="bg-gradient-to-br from-[#0A2540] via-[#0F3B4C] to-[#0A2540] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden scroll-mt-36 border border-[#0A2540]"
              >
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D96B27]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#E69536] text-xs font-bold uppercase tracking-widest shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>VIP Customization Privileges</span>
                  </div>

                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                    Tailor Every Dimension of Your Journey
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Because this tour is marked as <strong className="text-white font-bold">100% Customizable</strong>, you are not bound to rigid group departures or standard hotels. Collaborate directly with our senior travel designers to adjust:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {[
                      {
                        title: 'Hotel & Resort Tier',
                        desc: 'Upgrade to 5-Star Heritage Palaces, private water villas, or secluded luxury safari lodges.',
                      },
                      {
                        title: 'Private Pacing & Extensions',
                        desc: 'Extend stays in favorite cities or insert private rest days without affecting group schedules.',
                      },
                      {
                        title: 'Chauffeur & Helicopter Transfers',
                        desc: 'Replace public rail passes with private Mercedes-Benz chauffeured sedans or private air transfers.',
                      },
                      {
                        title: 'Bespoke Culinary Dining',
                        desc: 'Arrange private wine tastings, Michelin-starred reservations, or custom dietary menus.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                        <h4 className="font-heading font-bold text-base text-[#E69536] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{item.title}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <a
                      href="tel:+916156359772"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D96B27] hover:bg-[#E69536] text-white text-xs font-bold shadow-lg transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Speak to a Senior Designer: +91 6156359772</span>
                    </a>
                    <a
                      href="mailto:umatravelskk@gmail.com"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Custom Request</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING SIDEBAR ON DESKTOP */}
          <aside className="hidden lg:block lg:sticky lg:top-28 w-full shrink-0 space-y-4">
            <div className="bg-[#0A2540] text-white p-5 rounded-2xl shadow-xl border border-slate-700 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#E69536]">Guided Guest Checkout</span>
                <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200">No Account Needed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prefer a step-by-step guided reservation wizard with date & room preferences?
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setMultiStepModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#D96B27] hover:bg-[#E69536] text-white font-bold text-xs shadow-md transition text-center cursor-pointer active:scale-95"
                >
                  Launch Wizard
                </button>
                <Link
                  to={`/packages/${slug}/book`}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition text-center cursor-pointer flex items-center justify-center"
                >
                  Full Page Portal
                </Link>
              </div>
            </div>

            <BookingForm pkg={pkg} />
          </aside>
        </div>
      </div>

      {/* RELATED PACKAGES SECTION AT THE BOTTOM */}
      {relatedPackages && relatedPackages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-slate-200/80 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-3.5 py-1.5 rounded-full border border-[#D96B27]/20">
                Similar Expeditions
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-[#0A2540] mt-2">
                Explore Related Tour Packages
              </h2>
            </div>
            <Link
              to="/packages"
              className="text-xs font-bold text-[#0A2540] hover:text-[#D96B27] flex items-center gap-1 transition"
            >
              <span>View Full Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {relatedPackages.map((relPkg, idx) => (
              <PackageCard key={relPkg.id} pkg={relPkg} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM BAR ON MOBILE ("Book This Package" Button) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starting from</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-extrabold text-2xl text-[#0A2540]">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 font-semibold line-through">
                {formatCurrency(pkg.price)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setMobileModalOpen(true)}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#0F3B4C] text-white font-bold text-xs shadow-lg shadow-[#0A2540]/30 flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <span>Book This Package</span>
          <ChevronRight className="w-4 h-4 text-[#E69536]" />
        </button>
      </div>

      {/* LIGHTBOX MODAL FOR IMAGE GALLERY */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer z-50"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[activeImageIndex]?.image_url}
                alt={pkg.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="text-white text-sm font-bold mt-4 bg-white/10 px-5 py-2 rounded-full border border-white/15">
                Photo {activeImageIndex + 1} of {images.length} • {pkg.title}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center shadow-2xl transition cursor-pointer"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center shadow-2xl transition cursor-pointer"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOOKING MODAL (Opens when clicking sticky bottom bar button) */}
      <AnimatePresence>
        {mobileModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white z-50 shadow-2xl rounded-t-3xl overflow-y-auto p-6 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-[#0A2540]">
                    Reserve {pkg.title}
                  </h3>
                  <span className="text-xs text-slate-500">Instant VIP Reservation</span>
                </div>
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <BookingForm pkg={pkg} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* STEP-BY-STEP GUIDED BOOKING MODAL */}
      <MultiStepBookingModal
        pkg={pkg}
        isOpen={multiStepModalOpen}
        onClose={() => setMultiStepModalOpen(false)}
      />
    </div>
  );
};

export default PackageDetail;
