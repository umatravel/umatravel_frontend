import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Star,
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Quote,
  Send,
  Eye,
  Plane,
  Globe,
  Search,
  Cloud,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api.js';
import { formatCurrency } from '../utils/format.js';
import umaLogo from '../assets/Uma_logo_w.png';
import iataLogo from '../assets/iata-logo.png';
import { TravelBackgroundCanvas } from '../components/common/TravelBackgroundCanvas.jsx';

export const Home = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hero Search Widget State
  const [searchDestination, setSearchDestination] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('');

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [pkgRes, storyRes] = await Promise.all([
          api.get('/packages/featured').catch(() => ({ data: [] })),
          api.get('/stories?limit=3').catch(() => ({ data: [] })),
        ]);
        setFeaturedPackages(pkgRes.data || []);
        setLatestStories(storyRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination.trim()) params.append('destination', searchDestination.trim());
    if (searchMonth) params.append('month', searchMonth);
    if (searchTravelers) params.append('travelers', searchTravelers);
    navigate(`/packages?${params.toString()}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Welcome to the Uma VIP Dispatch! We will send private itineraries to your inbox soon.');
    setNewsletterEmail('');
  };

  const destinations = [
    {
      name: 'Varanasi & Sacred Ganges',
      region: 'India Cultural Heritage',
      filterQuery: 'Varanasi',
      toursCount: '5+ Packages',
      img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Swiss Alps & Zermatt',
      region: 'Europe Alpine Luxury',
      filterQuery: 'Switzerland',
      toursCount: '4+ Packages',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kyoto & Tokyo Heritage',
      region: 'Japan VIP Expeditions',
      filterQuery: 'Japan',
      toursCount: '6+ Packages',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Amalfi Coast & Capri',
      region: 'Italy Coastal Elegance',
      filterQuery: 'Italy',
      toursCount: '7+ Packages',
      img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Serengeti & Ngorongoro',
      region: 'Tanzania Safari Adventures',
      filterQuery: 'Tanzania',
      toursCount: '3+ Packages',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Machu Picchu & Cusco',
      region: 'Peru Sacred Wonders',
      filterQuery: 'Peru',
      toursCount: '4+ Packages',
      img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "Our 12-day private tour across Japan was flawlessly orchestrated. From our private tea ceremony with an executive master in Kyoto to the bullet train VIP transfers, Uma International anticipated every detail.",
      author: 'Eleanor & Marcus Vance',
      location: 'New York, USA',
      tour: 'Japan Imperial Heritage',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      quote:
        "Visiting Varanasi during our golden anniversary trip was deeply spiritual. Having a dedicated 24/7 concierge and private riverboat at sunrise made us feel safe and cared for entirely.",
      author: 'Dr. Rajesh & Sunita Sharma',
      location: 'London, UK',
      tour: 'Sacred Ganges Expedition',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      quote:
        "We compared luxury tour quotes from three agencies, and Uma International not only offered the Best Price Guarantee with zero hidden fees, but their local guides unlocked doors we couldn't have dreamt of.",
      author: 'Sofia & Alejandro Mendoza',
      location: 'Madrid, Spain',
      tour: 'Amalfi Coastal Escape',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-[#FAFAF7] text-slate-800 pb-24">
      {/* 1. UMA INTERNATIONAL HERO SECTION */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <section className="relative min-h-[86vh] rounded-[40px] bg-gradient-to-br from-[#0B5E63] via-[#0E545A] to-[#0A3D42] overflow-hidden shadow-2xl border border-white/15 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
          
          {/* Right Side Mountain & Traveler Imagery + Diagonal Golden Curve Swoosh */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85"
              alt="Mountain adventure traveler with luggage"
              className="w-full h-full object-cover object-center scale-105 opacity-90"
            />
            {/* Dark overlay & teal gradient fade on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E545A] via-[#0E545A]/70 to-transparent lg:hidden" />
            
            {/* Signature Diagonal Golden Swoosh Divider */}
            <svg className="absolute top-0 bottom-0 left-0 h-full w-40 sm:w-60 lg:w-80 text-[#ECA815] fill-current pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 C60,30 20,70 80,100 L0,100 Z" />
            </svg>
            <svg className="absolute top-0 bottom-0 -left-10 h-full w-48 sm:w-72 lg:w-96 text-[#0E545A] fill-current pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 C60,30 20,70 80,100 L0,100 Z" />
            </svg>
          </div>

          {/* Floating Realistic Clouds & Dashed Airplane Path (Exact Picture 2 Trajectory) */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ x: [-20, 20, -20], y: [-5, 5, -5] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[15%] right-[35%] text-white/80"
            >
              <Cloud className="w-20 h-20 fill-white/40 drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ x: [15, -15, 15] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-[25%] right-[15%] text-white/70"
            >
              <Cloud className="w-16 h-16 fill-white/30 drop-shadow-md" />
            </motion.div>

            {/* Dashed Airplane Flight Loop */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 32 42 Q 42 18 55 35 T 72 48"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeDasharray="8 10"
                vectorEffect="non-scaling-stroke"
                className="opacity-75"
              />
            </svg>

            {/* Gliding White Airplane along Trajectory */}
            <motion.div
              animate={{
                left: ['32%', '72%'],
                top: ['42%', '48%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'rotate(25deg)' }}
              className="absolute text-white drop-shadow-xl"
            >
              <Plane className="w-10 h-10 -rotate-45 fill-white" />
            </motion.div>
          </div>

          {/* Left-Aligned Hero Content (Exact Picture 2 Brush / Script Typography & CTA) */}
          <div className="relative z-20 max-w-xl text-left space-y-5 pt-8 sm:pt-14">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-['Kaushan_Script',cursive] text-3xl sm:text-5xl text-white block font-normal tracking-wide drop-shadow-md"
            >
              Discover
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-['Kaushan_Script',cursive] font-bold text-6xl sm:text-8xl lg:text-9xl text-white tracking-tight leading-none drop-shadow-2xl block"
            >
              The World
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/95 text-lg sm:text-2xl font-medium tracking-wide drop-shadow-md pt-2"
            >
              The Safety of our customers at all stages
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-4"
            >
              <Link
                to="/contact"
                className="inline-block px-9 py-4 rounded-full bg-[#86C232] hover:bg-[#A3E635] text-[#0A2540] font-extrabold text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>

          {/* Bottom Left: The White Pill Quick Finder Widget + Social Strip */}
          <div className="relative z-20 space-y-6 pt-12">
            {/* White Pill Search Box (Exact Picture 2 Layout) */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-full p-2 sm:p-2.5 shadow-2xl max-w-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border border-slate-100"
            >
              {/* Location Box */}
              <div className="flex-1 min-w-[120px] px-4 py-1.5 border-r border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">Location</span>
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="w-full bg-transparent text-slate-500 text-xs font-semibold placeholder-slate-400 focus:outline-none truncate mt-0.5"
                />
              </div>

              {/* Date Box */}
              <div className="flex-1 min-w-[110px] px-4 py-1.5 border-r border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">Date</span>
                <select
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(e.target.value)}
                  aria-label="Travel Dates / Season"
                  className="w-full bg-transparent text-slate-500 text-xs font-semibold focus:outline-none cursor-pointer truncate mt-0.5"
                >
                  <option value="">Any Date</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="autumn">Autumn</option>
                  <option value="winter">Winter</option>
                </select>
              </div>

              {/* Traveler Box */}
              <div className="flex-1 min-w-[100px] px-4 py-1.5">
                <span className="text-xs font-bold text-slate-800 block">Traveler</span>
                <select
                  value={searchTravelers}
                  onChange={(e) => setSearchTravelers(e.target.value)}
                  aria-label="Number of Travelers"
                  className="w-full bg-transparent text-slate-500 text-xs font-semibold focus:outline-none cursor-pointer truncate mt-0.5"
                >
                  <option value="">Any size</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3-5">3-5 Guests</option>
                  <option value="6+">6+ Guests</option>
                </select>
              </div>

              {/* Lime-Green Circle Search Button */}
              <button
                type="submit"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#86C232] hover:bg-[#A3E635] text-[#0A2540] flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Search Packages"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 font-extrabold stroke-[3]" />
              </button>
            </form>

            {/* Social Follow Strip below search box */}
            <div className="flex items-center gap-4 text-white text-xs font-bold uppercase tracking-widest pt-2">
              <span className="text-[11px] font-extrabold tracking-widest opacity-90">FOLLOW US</span>
              <div className="w-12 h-px bg-white/40 hidden sm:block" />
              <div className="flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#86C232] hover:text-[#0A2540] flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#86C232] hover:text-[#0A2540] flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#86C232] hover:text-[#0A2540] flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. TRUST & ACCREDITATION RIBBON */}
      <section className="bg-gradient-to-r from-[#FAFAF7] via-white to-[#FAFAF7] border-b border-slate-200/80 pt-14 pb-12 relative z-20 shadow-xs overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <TravelBackgroundCanvas variant="light" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-around gap-8 text-slate-700 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200 shrink-0 shadow-xs">
              <img src={iataLogo} alt="IATA Accredited Agency" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider block">IATA Accredited Agency</span>
              <span className="text-[11px] text-[#D96B27] font-semibold block flex items-center gap-1">
                <Plane className="w-3 h-3 animate-pulse" />
                <span>Certified Global Travel Authority</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0A2540] p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              <img src={umaLogo} alt="Uma International Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider block">Uma International LLC</span>
              <span className="text-[11px] text-[#D96B27] font-semibold block">15+ Years of Luxury Expeditions</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider block">100% Vetted Master Guides</span>
              <span className="text-[11px] text-slate-500 font-medium block">Personalized 24/7 Concierge</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider block">Best Price Guarantee</span>
              <span className="text-[11px] text-slate-500 font-medium block">Transparent Luxury Pricing</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. "WHY CHOOSE US" SECTION */}
      <section className="bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] py-28 relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <TravelBackgroundCanvas variant="light" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 border border-[#D96B27]/25 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-xs">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>The Uma Advantage</span>
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2540] tracking-tight">
              Why Discerning Travelers Choose Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Handpicked Packages',
                desc: 'Every tour itinerary is carefully curated and inspected by our senior designers for unparalleled luxury, comfort, and authenticity.',
              },
              {
                icon: HeartHandshake,
                title: 'Customizable Trips',
                desc: 'Bespoke flexibility to tailor boutique lodges, private master guides, dietary preferences, and pacing exactly to your personal style.',
              },
              {
                icon: ShieldCheck,
                title: '24/7 Support',
                desc: 'Our global monitoring desk is standing by day and night to assist with reservations, flight adjustments, or instant recommendations.',
              },
              {
                icon: Star,
                title: 'Best Price Guarantee',
                desc: 'Direct relationships with boutique luxury lodges and VIP local suppliers ensure transparent, guaranteed pricing with zero hidden markup.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-8 rounded-3xl space-y-5 hover:border-[#D96B27] hover:shadow-2xl hover:shadow-[#D96B27]/15 transition-all duration-300 group shadow-md relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D96B27]/10 text-[#D96B27] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#0A2540] group-hover:text-white transition-all relative z-10">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0A2540] relative z-10">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 border border-[#D96B27]/25 px-3.5 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-[#E69536] fill-[#E69536]" />
              <span>Curated Escapes</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
              Featured Tour Packages
            </h2>
          </div>
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0A2540] hover:text-[#D96B27] transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D96B27]" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm animate-pulse space-y-5">
                <div className="h-60 bg-slate-200 rounded-2xl w-full" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-7 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-4">
            <Compass className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-xl text-slate-800">No featured packages available right now</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Explore our full catalog to discover active tours across Europe, Asia, and the Americas.</p>
            <Link
              to="/packages"
              className="inline-block mt-2 px-8 py-3 rounded-full bg-[#0A2540] text-white text-sm font-bold shadow-md hover:bg-[#0F3B4C] transition cursor-pointer"
            >
              Browse All Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, idx) => {
              const displayPrice = pkg.discount_price || pkg.price;
              const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/80 hover:border-[#E69536]/50 flex flex-col group transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={
                        (pkg.package_images && pkg.package_images.length > 0)
                          ? pkg.package_images[0].image_url
                          : (pkg.images && pkg.images.length > 0)
                          ? pkg.images[0].image_url
                          : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md">
                        Save {formatCurrency(pkg.price - pkg.discount_price)}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D96B27]">
                        <MapPin className="w-4 h-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <h3 className="font-heading font-extrabold text-2xl text-slate-900 line-clamp-1">{pkg.title}</h3>
                    </div>
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="font-heading font-extrabold text-2xl text-[#0A2540]">{formatCurrency(displayPrice)}</span>
                      <Link
                        to={`/packages/${pkg.slug}`}
                        className="px-6 py-3 rounded-full bg-[#0A2540] group-hover:bg-gradient-to-r group-hover:from-[#D96B27] group-hover:to-[#E69536] text-white text-xs font-bold transition-all shadow-md group-hover:shadow-lg flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. POPULAR DESTINATIONS SECTION (Exact Picture 3 TOP! DESTINATION Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#0E545A] rounded-[40px] p-8 sm:p-14 lg:p-16 text-white overflow-hidden relative shadow-2xl border border-white/10">
          {/* Top Header split layout (Picture 3) */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 relative z-10">
            <div className="space-y-4 max-w-md">
              <h2 className="font-bold text-3xl sm:text-4xl text-[#ECA815]">
                Most Favorite <span className="text-white">Tour Places!</span>
              </h2>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Choosing a destination can be exciting but also overwhelming with so many amazing places! Let's narrow it down to peaceful nature, buzzing cities, or relaxing luxury beaches.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/packages"
                  className="inline-block px-7 py-3 rounded-full bg-[#86C232] hover:bg-[#A3E635] text-[#0A2540] font-extrabold text-sm shadow-xl transition hover:scale-105 active:scale-95"
                >
                  View More Destinations
                </Link>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <span className="font-extrabold text-[#ECA815] text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none block">
                TOP!
              </span>
              <span className="font-black text-white text-4xl sm:text-6xl lg:text-7xl tracking-wider leading-none block">
                DESTINATION
              </span>
            </div>
          </div>

          {/* Destinations Grid inside the Forest Teal Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/packages?destination=${encodeURIComponent(dest.filterQuery)}`)}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer border border-white/20 transition-all duration-300"
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E545A]/95 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                  <h3 className="font-bold text-2xl text-white group-hover:text-[#ECA815] transition-colors">{dest.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    &rarr;
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EASY STEPS FOR BOOKINGS (Exact Picture 4 Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="font-bold text-3xl sm:text-5xl text-[#0E545A]">
            Easy Steps <span className="text-[#ECA815]">For Bookings</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Destinations worth exploring! Here are a few simple steps to plan your luxury trip effortlessly.
          </p>
        </div>

        {/* 3 Floating White Cards (Exact Picture 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-4">
          {[
            { step: '01', title: 'Choose Destination', desc: 'All you have to do is select your preferred destination and customized itinerary from our global catalog.' },
            { step: '02', title: 'Make Payment', desc: 'You are important to us. We offer flexible secure payments and transparent VIP pricing with zero hidden fees.' },
            { step: '03', title: 'Ready For Travelling', desc: 'We have fulfilled all your requirements, flight reservations, and boutique hotels. Now you are ready to travel with 24/7 concierge support.' }
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-slate-100 space-y-5 relative group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="w-14 h-14 rounded-2xl bg-[#0E545A] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {item.step}
                </span>
                <div className="w-14 h-14 rounded-full border-2 border-[#ECA815] text-[#ECA815] flex items-center justify-center font-bold group-hover:bg-[#ECA815] group-hover:text-white transition-colors">
                  &check;
                </div>
              </div>
              <h3 className="font-bold text-2xl text-[#0E545A]">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Exact Picture 4 Golden Orange Promo Banner */}
        <div className="bg-gradient-to-r from-[#F59E0B] via-[#ECA815] to-[#D97706] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl mt-12 text-left">
          <div className="space-y-1">
            <span className="font-['Kaushan_Script',cursive] text-2xl sm:text-3xl text-white block drop-shadow-xs">Get Special Offer</span>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-black text-6xl sm:text-7xl leading-none">48% OFF</span>
              <span className="font-bold text-2xl sm:text-3xl tracking-wide">Tours and Trip Packages, Globally</span>
            </div>
          </div>
          <Link
            to="/packages"
            className="px-8 py-4 rounded-full bg-white text-[#0E545A] font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            Discover More
          </Link>
        </div>
      </section>

      {/* 8. TESTIMONIALS & LATEST STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-bold text-3xl sm:text-5xl text-[#0E545A]">Latest Travel Stories & Journal</h2>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#86C232] text-[#0A2540] font-bold text-sm shadow-md hover:scale-105 transition"
          >
            <span>Read All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestStories.map((story, idx) => (
            <Link
              key={story.id}
              to={`/stories/${story.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 h-full"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={story.cover_image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-7">
                <h3 className="font-bold text-xl text-[#0E545A] group-hover:text-[#ECA815] transition-colors">{story.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
