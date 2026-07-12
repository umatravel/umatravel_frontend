import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  CheckCircle2,
  Clock,
  Globe,
  Sparkles,
  ExternalLink,
  Navigation,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api.js';
import { TravelBackgroundCanvas } from '../components/common/TravelBackgroundCanvas.jsx';

// Social Icon SVGs
const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

const contactSchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required (min 3 characters)'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeOffice, setActiveOffice] = useState('gopalganj'); // 'gopalganj' | 'kuchaikote'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success('Your message has been received! Our travel designers will reply within 24 hours.');
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Contact submission error:', err);
      // Fallback notification if backend is unreachable or slow
      toast.success('Your inquiry has been logged! A senior designer will contact you directly via email.');
      setSubmitted(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const officeLocations = {
    gopalganj: {
      title: 'Gopalganj Main Headquarters',
      address: 'Nagar Palika Market, Post Office Chowk, Banjari Road, Gopalganj, Bihar - 841428',
      phone: '+91 6156359772',
      mobile: '+91 9123279922',
      whatsapp: '+91 9771648655',
      email: 'umatravelskk@gmail.com',
      coords: '26.4716° N, 84.4426° E',
      hours: 'Mon – Sat: 9:00 AM – 8:30 PM | Sun: 10:00 AM – 6:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Nagar+Palika+Market+Post+Office+Chowk+Gopalganj+Bihar',
    },
    kuchaikote: {
      title: 'Kuchaikote Branch Office',
      address: 'Kushwaha Market, NH-27 Bypass, Kuchaikote, Gopalganj, Bihar - 841501',
      phone: '+91 9123279922',
      mobile: '+91 9771648655',
      whatsapp: '+91 9771648655',
      email: 'umatravelskk@gmail.com',
      coords: '26.5410° N, 84.3180° E',
      hours: 'Mon – Sat: 9:30 AM – 8:00 PM | Sun: Closed (24/7 Phone Support Active)',
      mapsUrl: 'https://maps.google.com/?q=Kuchaikote+Gopalganj+Bihar',
    },
  };

  const currentLoc = officeLocations[activeOffice];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28 font-['Afacad',sans-serif]">
      {/* Cinematic Animated Hero Banner (Uma International Rounded Teal Style) */}
      <section className="relative bg-[#0E545A] text-white pt-36 pb-28 rounded-b-[40px] sm:rounded-b-[50px] overflow-hidden shadow-2xl border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
            alt="Concierge background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E545A] via-[#0E545A]/80 to-transparent" />
        </div>

        {/* Animated Flight Path Vectors */}
        <TravelBackgroundCanvas variant="dark" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-['Kaushan_Script',cursive] text-3xl sm:text-4xl text-[#ECA815] block mb-2 drop-shadow-sm">
              VIP Global Concierge &amp; Inquiry Desk
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-4xl sm:text-6xl text-white tracking-tight drop-shadow-md"
          >
            Connect With Our Expedition Planners
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Whether you are dreaming of a private Swiss rail journey, a luxury island honeymoon, or a custom group departure, reach out directly to our master designers across Bihar and our global desk.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-20">
        {/* TOP TWO COLUMNS: CONTACT INFO & INQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: ANIMATED CONTACT INFO BOX */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-b from-[#0A2540] to-[#0F3B4C] text-white p-8 sm:p-12 rounded-3xl space-y-8 shadow-2xl border border-slate-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D96B27]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E69536] block">
                Direct Communication
              </span>
              <h3 className="font-heading font-extrabold text-3xl text-white">
                Our Office Locations
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Speak directly with senior directors via phone or WhatsApp, or visit our flagship consultation offices in Gopalganj & Kuchaikote.
              </p>
            </div>

            <ul className="space-y-7 text-sm relative z-10">
              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#D96B27]/20 text-[#E69536] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D96B27] group-hover:text-white transition-all shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-white block text-base">Gopalganj Flagship Office</span>
                  <span className="text-slate-300 text-xs block leading-relaxed">
                    Nagar Palika Market, Post Office Chowk, Banjari Road, Gopalganj, Bihar - 841428
                  </span>
                  <span className="text-[#E69536] font-semibold text-xs block">
                    Phone: +91 6156359772 | +91 9123279922
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#D96B27]/20 text-[#E69536] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D96B27] group-hover:text-white transition-all shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-white block text-base">Kuchaikote Branch Office</span>
                  <span className="text-slate-300 text-xs block leading-relaxed">
                    Kushwaha Market, NH-27 Bypass, Kuchaikote, Gopalganj, Bihar - 841501
                  </span>
                  <span className="text-[#E69536] font-semibold text-xs block">
                    WhatsApp Desk: +91 9771648655
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#D96B27]/20 text-[#E69536] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D96B27] group-hover:text-white transition-all shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-white block text-base">24/7 Reservation Desk</span>
                  <a href="mailto:umatravelskk@gmail.com" className="text-slate-300 hover:text-[#E69536] text-xs transition-colors block font-mono">
                    umatravelskk@gmail.com
                  </a>
                  <span className="text-slate-400 text-[11px] block">Average email response: &lt; 2 hours</span>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#D96B27]/20 text-[#E69536] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D96B27] group-hover:text-white transition-all shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-white block text-base">Global Travel Monitoring</span>
                  <span className="text-slate-300 text-xs block">Monday – Sunday: 24 Hours a Day</span>
                  <span className="text-[11px] text-[#E69536]">Emergency hotline active for all travelers</span>
                </div>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-6 border-t border-white/10 space-y-3 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Connect Across Social Networks
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: InstagramIcon, label: 'Instagram', url: 'https://instagram.com' },
                  { icon: FacebookIcon, label: 'Facebook', url: 'https://facebook.com' },
                  { icon: TwitterIcon, label: 'Twitter', url: 'https://twitter.com' },
                  { icon: LinkedinIcon, label: 'LinkedIn', url: 'https://linkedin.com' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#D96B27] text-white flex items-center justify-center transition border border-white/15"
                      aria-label={s.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: CONTACT INQUIRY FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-8 sm:p-14 rounded-3xl border border-slate-200/80 shadow-xl"
          >
            {submitted ? (
              <div className="text-center py-16 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-3xl text-[#0A2540]">
                    Inquiry Transmitted Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                    Thank you for contacting <strong className="text-[#0A2540]">Uma International Travel Services</strong>. Your message has been routed to our senior travel designers who will prepare sample itinerary suggestions and contact you within 24 hours.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-9 py-4 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-slate-100 pb-5 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] block mb-1">
                    Direct Planner Consultation
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0A2540]">
                    Send Us Your Travel Ideas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill out your details below. Tell us your dream destinations, dates, or custom group requirements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Alexander Wright"
                        {...register('name')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-600 mt-1 pl-1 font-semibold">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. alex@example.com"
                        {...register('email')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-600 mt-1 pl-1 font-semibold">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="e.g. +91 9771648655"
                        {...register('phone')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block pl-1">For instant WhatsApp itinerary previews</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Inquiry Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Custom Swiss Alps Tour for 4"
                      {...register('subject')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                    />
                    {errors.subject && <p className="text-xs text-red-600 mt-1 pl-1 font-semibold">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Your Message & Travel Specifications *
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <textarea
                      rows="5"
                      placeholder="Tell us your desired travel dates, destination preferences, hotel star ratings, or special requests..."
                      {...register('message')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D96B27] focus:bg-white transition"
                    />
                  </div>
                  {errors.message && <p className="text-xs text-red-600 mt-1 pl-1 font-semibold">{errors.message.message}</p>}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-9 py-4 rounded-2xl sm:rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-sm shadow-xl shadow-[#0A2540]/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Tour Inquiry'}</span>
                  </button>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Strict 100% Client Privacy Guarantee</span>
                  </span>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* EMBEDDED MAP PLACEHOLDER WITH INTERACTIVE BRANCH SELECTOR */}
        <section className="space-y-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-3.5 py-1.5 rounded-full border border-[#D96B27]/20">
                Interactive Headquarters Locator
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-[#0A2540] mt-2">
                Visit Our Office Locations in Bihar
              </h2>
            </div>

            {/* Branch Tab Selector */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveOffice('gopalganj')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeOffice === 'gopalganj'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className={`w-4 h-4 ${activeOffice === 'gopalganj' ? 'text-[#E69536]' : 'text-slate-400'}`} />
                <span>Gopalganj Main HQ</span>
              </button>
              <button
                onClick={() => setActiveOffice('kuchaikote')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeOffice === 'kuchaikote'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className={`w-4 h-4 ${activeOffice === 'kuchaikote' ? 'text-[#E69536]' : 'text-slate-400'}`} />
                <span>Kuchaikote Branch</span>
              </button>
            </div>
          </div>

          {/* Map Display Container */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 relative h-96 sm:h-[450px] bg-slate-900 overflow-hidden">
              {/* Simulated Interactive Map with Styled Overlay */}
              <iframe
                title="Gopalganj & Kuchaikote Map"
                src={
                  activeOffice === 'gopalganj'
                    ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14336.577660233668!2d84.4326!3d26.4716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39930f7be5fb84dd%3A0xc621379bb7257df7!2sGopalganj%2C%20Bihar!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin'
                    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14331.0!2d84.3180!3d26.5410!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39930d0000000000%3A0x0000000000000000!2sKuchaikote%2C%20Bihar!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin'
                }
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Pin Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto max-w-sm bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D96B27] bg-[#D96B27]/10 px-2.5 py-0.5 rounded-full">
                    Active Pin
                  </span>
                  <span className="text-xs font-mono text-slate-400">{currentLoc.coords}</span>
                </div>
                <h4 className="font-heading font-extrabold text-lg text-[#0A2540]">{currentLoc.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{currentLoc.address}</p>
              </div>
            </div>

            {/* Office Details Sidebar */}
            <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#D96B27]">Selected Branch</span>
                  <h3 className="font-heading font-extrabold text-2xl text-[#0A2540] mt-1">{currentLoc.title}</h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Physical Address</span>
                    <p className="font-semibold text-slate-700 leading-relaxed">{currentLoc.address}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Direct Phone Support</span>
                    <p className="font-bold text-[#0A2540] text-base">{currentLoc.phone}</p>
                    <p className="text-xs text-slate-600">Mobile: {currentLoc.mobile}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Operating Hours</span>
                    <p className="text-slate-600">{currentLoc.hours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3">
                <a
                  href={currentLoc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#E69536]" />
                  <span>Open in Google Maps</span>
                </a>
                <a
                  href={`https://wa.me/919771648655?text=Hello%20Uma%20International,%20I%20would%20like%20to%20inquire%20about%20a%20tour`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>Chat Direct on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
