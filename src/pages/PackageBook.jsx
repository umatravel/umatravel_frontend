import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Compass,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  PhoneCall,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { MultiStepBookingModal } from '../components/booking/MultiStepBookingModal.jsx';

export const PackageBook = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/packages/${slug}`);
        setPkg(res.data || null);
      } catch (err) {
        console.error('Error fetching package for booking:', err);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] pt-32 pb-24 flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-pulse">
          <Compass className="w-16 h-16 text-slate-300 mx-auto animate-spin" />
          <h2 className="font-heading font-extrabold text-2xl text-[#0A2540]">
            Preparing Your Booking Portal...
          </h2>
          <p className="text-sm text-slate-500">Loading live rates and availability for {slug}.</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] pt-32 pb-24 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl max-w-lg text-center space-y-5">
          <Compass className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="font-heading font-extrabold text-2xl text-[#0A2540]">
            Expedition Not Available
          </h2>
          <p className="text-sm text-slate-600">
            We couldn't load tour details for `{slug}`. It may have been updated or moved.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A2540] text-white text-xs font-bold shadow-md hover:bg-[#D96B27] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Tours</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28">
      {/* Top Header Banner */}
      <section className="bg-[#0A2540] text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to={`/packages/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E69536] hover:text-white transition bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tour Overview</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#D96B27] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
                  {pkg.category}
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E69536]" />
                  <span>{pkg.destination}</span>
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Complete Your Instant Reservation
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                You are booking <strong className="text-white">{pkg.title}</strong> ({pkg.duration_days} Days / {pkg.duration_nights} Nights). No account creation required.
              </p>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex flex-col gap-2.5 bg-white/10 p-4 rounded-2xl border border-white/15 max-w-sm shrink-0 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>24/7 Global Dispatch & Concierge Protection</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified IATA Accredited Travel Agency</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <PhoneCall className="w-4 h-4 text-[#E69536] shrink-0" />
                <span>Need help? Call +91 6156359772</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Step Booking Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-2 sm:p-4">
          <MultiStepBookingModal
            pkg={pkg}
            isOpen={true}
            onClose={() => navigate(`/packages/${slug}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default PackageBook;
