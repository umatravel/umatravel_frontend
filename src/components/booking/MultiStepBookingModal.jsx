import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Printer,
  ShieldCheck,
  Building2,
  Clock,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api.js';
import { formatCurrency } from '../../utils/format.js';

// Zod schema for multi-step checkout
const multiStepBookingSchema = z.object({
  travel_date: z.string().refine((val) => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(selected.getTime()) && selected >= today;
  }, 'Please select a valid date (today or a future date)'),
  travelers_count: z.number({ invalid_type_error: 'Travelers must be a number' }).int().min(1, 'At least 1 traveler required'),
  room_preference: z.string().optional(),
  custom_requirements: z.string().optional(),
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits'),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms & cancellation policy to finalize booking',
  }),
});

export const MultiStepBookingModal = ({ pkg, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Travel Details | 2: Contact Info | 3: Review & Confirm | 4: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const unitPrice = pkg?.discount_price || pkg?.price || 0;
  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(multiStepBookingSchema),
    defaultValues: {
      travel_date: todayStr,
      travelers_count: 2,
      room_preference: pkg?.is_customizable ? '5-Star Heritage Palace / Luxury Lodge' : 'Standard VIP Accommodation',
      custom_requirements: '',
      full_name: '',
      email: '',
      phone: '',
      agree_terms: false,
    },
  });

  const travelersCount = watch('travelers_count') || 1;
  const travelDate = watch('travel_date');
  const roomPreference = watch('room_preference');
  const customRequirements = watch('custom_requirements');
  const fullName = watch('full_name');
  const email = watch('email');
  const phone = watch('phone');
  const agreeTerms = watch('agree_terms');

  const calculatedTotal = unitPrice * (travelersCount > 0 ? travelersCount : 1);

  // Step validation helpers
  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['travel_date', 'travelers_count'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['full_name', 'email', 'phone'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error('Please fix highlighted errors before continuing.');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final submission to POST /api/bookings
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Compose full requirements combining room choice and dietary notes
      let finalReqs = [];
      if (data.room_preference) {
        finalReqs.push(`[Accommodation Choice: ${data.room_preference}]`);
      }
      if (data.custom_requirements && data.custom_requirements.trim()) {
        finalReqs.push(`[Notes/Dietary: ${data.custom_requirements.trim()}]`);
      }

      const payload = {
        package_id: pkg.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        travel_date: data.travel_date,
        travelers_count: Number(data.travelers_count),
        custom_requirements: finalReqs.join(' '),
      };

      const res = await api.post('/bookings', payload);
      toast.success('🎉 Tour package booked successfully!');
      setConfirmedBooking(res.booking || res.data || { ...payload, reference_code: 'UMA-CONFIRMED' });
      setCurrentStep(4);
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error(err.message || 'Failed to submit reservation. Please verify your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && currentStep !== 4) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && currentStep !== 4 && !isSubmitting) {
            onClose && onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-8"
        >
          {/* Header Bar */}
          <div className="bg-[#0A2540] text-white px-6 py-5 flex items-center justify-between border-b border-[#0F3B4C]">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E69536] block">
                Instant Guest Checkout • No Account Needed
              </span>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white truncate max-w-md">
                Reserve {pkg?.title}
              </h2>
            </div>
            {currentStep !== 4 && (
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close booking wizard"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Step Progress Bar (Only visible steps 1 to 3) */}
          {currentStep <= 3 && (
            <div className="bg-[#FAFAF7] px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between max-w-lg mx-auto relative">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="absolute left-6 top-4 h-0.5 bg-[#D96B27] transition-all duration-500 -z-0"
                  style={{ width: `${((currentStep - 1) / 2) * 88}%` }}
                />

                {[
                  { step: 1, label: 'Travel Details' },
                  { step: 2, label: 'Guest Contact' },
                  { step: 3, label: 'Review & Pay' },
                ].map((s) => {
                  const isDone = currentStep > s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div key={s.step} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#D96B27] text-white ring-4 ring-[#D96B27]/20 scale-110'
                            : 'bg-white border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : s.step}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-1.5 ${
                          isCurrent ? 'text-[#0A2540]' : isDone ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            {/* STEP 1: TRAVEL DETAILS */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-extrabold text-xl text-[#0A2540]">Step 1: Customize Your Dates & Travelers</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select your preferred arrival date and group size.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Travel Date */}
                  <div>
                    <label htmlFor="travel_date" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Departure / Travel Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="travel_date"
                        type="date"
                        min={todayStr}
                        {...register('travel_date')}
                        className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-3 pl-10 pr-3 text-sm font-semibold focus:outline-none focus:border-[#D96B27] transition cursor-pointer"
                      />
                    </div>
                    {errors.travel_date && <p className="text-xs text-red-600 font-semibold mt-1">{errors.travel_date.message}</p>}
                  </div>

                  {/* Travelers Count */}
                  <div>
                    <label htmlFor="travelers_count" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Number of Travelers *
                    </label>
                    <div className="flex items-center bg-[#FAFAF7] border border-slate-200 rounded-2xl p-1.5">
                      <button
                        type="button"
                        onClick={() => setValue('travelers_count', Math.max(1, travelersCount - 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center"
                        aria-label="Decrease travelers"
                      >
                        -
                      </button>
                      <input
                        id="travelers_count"
                        type="number"
                        min="1"
                        max={pkg?.max_group_size || 50}
                        {...register('travelers_count', { valueAsNumber: true })}
                        className="flex-1 bg-transparent text-center font-heading font-extrabold text-lg text-[#0A2540] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setValue('travelers_count', Math.min(pkg?.max_group_size || 50, travelersCount + 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center"
                        aria-label="Increase travelers"
                      >
                        +
                      </button>
                    </div>
                    {errors.travelers_count && <p className="text-xs text-red-600 font-semibold mt-1">{errors.travelers_count.message}</p>}
                  </div>
                </div>

                {/* Structured Room / Customization Options (if is_customizable) */}
                {pkg?.is_customizable && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E69536]" />
                      <span>Select Accommodation & Customization Tier</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          title: '5-Star Heritage Palace / Luxury Lodge',
                          desc: 'Premium suites, private chauffeur transfers & master naturalists.',
                          recommended: true,
                        },
                        {
                          title: '4-Star Premium Boutique Hotel',
                          desc: 'Handpicked authentic comfort with private airport reception.',
                          recommended: false,
                        },
                        {
                          title: 'Private Suite / Water Villa Luxury',
                          desc: 'Ultimate seclusion, private butler service & helicopter transfer options.',
                          recommended: false,
                        },
                      ].map((tier) => (
                        <label
                          key={tier.title}
                          className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                            roomPreference === tier.title
                              ? 'bg-amber-50/60 border-[#D96B27] ring-1 ring-[#D96B27]/30 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={tier.title}
                            {...register('room_preference')}
                            className="mt-1 accent-[#D96B27] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-[#0A2540]">{tier.title}</span>
                              {tier.recommended && (
                                <span className="bg-[#D96B27]/10 text-[#D96B27] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 block mt-0.5">{tier.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Free-Text Custom Requirements */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label htmlFor="custom_requirements" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Special Dietary Notes / Hotel Requests (Optional)
                  </label>
                  <textarea
                    id="custom_requirements"
                    rows="3"
                    placeholder="Tell us about any flight times, anniversary notes, or dietary requirements..."
                    {...register('custom_requirements')}
                    className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl p-3.5 text-sm focus:outline-none focus:border-[#D96B27] transition"
                  />
                </div>

                {/* Price Preview Bar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Current Total Calculation</span>
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(unitPrice)} × {travelersCount} traveler(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-2xl text-[#0A2540]">
                      {formatCurrency(calculatedTotal)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Taxes & transfers included</span>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-4 rounded-2xl bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Continue to Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: CONTACT DETAILS */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-extrabold text-xl text-[#0A2540]">Step 2: Guest Contact Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Where should we dispatch your reservation ticket and itinerary?</p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Full Name (Lead Traveler) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="full_name"
                        type="text"
                        placeholder="e.g. Alexander Wright"
                        {...register('full_name')}
                        className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-3 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27] transition"
                      />
                    </div>
                    {errors.full_name && <p className="text-xs text-red-600 font-semibold mt-1">{errors.full_name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Email Address (For Instant Confirmation) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        placeholder="e.g. alexander@example.com"
                        {...register('email')}
                        className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-3 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27] transition"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-600 font-semibold mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Phone Number / WhatsApp (For Concierge Updates) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +1 (555) 019-2834"
                        {...register('phone')}
                        className="w-full bg-[#FAFAF7] border border-slate-200 rounded-2xl py-3 pl-10 pr-3 text-sm font-medium focus:outline-none focus:border-[#D96B27] transition"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-600 font-semibold mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Trust Reminder */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We never share your contact details. Your email and phone are used solely by your dedicated travel designer to coordinate transfers and hotel check-in.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-4 rounded-2xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-4 rounded-2xl bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Proceed to Review & Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-extrabold text-xl text-[#0A2540]">Step 3: Review & Confirm Reservation</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Please check all details before securing your instant reservation.</p>
                </div>

                {/* Summary Table */}
                <div className="bg-[#FAFAF7] rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-200/80 pb-4">
                    <div>
                      <span className="text-xs font-extrabold text-[#D96B27] uppercase tracking-wider">{pkg?.category}</span>
                      <h4 className="font-heading font-extrabold text-xl text-[#0A2540]">{pkg?.title}</h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{pkg?.destination}</span> • <span>{pkg?.duration_days} Days / {pkg?.duration_nights} Nights</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs py-2">
                    <div>
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Travel Date</span>
                      <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{travelDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Travelers</span>
                      <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{travelersCount} Guest(s)</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Lead Guest</span>
                      <span className="font-extrabold text-slate-800 text-sm mt-0.5 block truncate">{fullName}</span>
                    </div>
                  </div>

                  {roomPreference && (
                    <div className="pt-3 border-t border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Accommodation Tier</span>
                      <span className="font-bold text-[#0A2540] mt-0.5 block">{roomPreference}</span>
                    </div>
                  )}

                  {customRequirements && (
                    <div className="pt-3 border-t border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Special Requests</span>
                      <span className="text-slate-600 mt-0.5 block italic">"{customRequirements}"</span>
                    </div>
                  )}

                  {/* Total Price Breakdown */}
                  <div className="pt-4 border-t border-slate-300 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Base Package Price ({formatCurrency(unitPrice)} × {travelersCount})</span>
                      <span>{formatCurrency(calculatedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 font-bold">
                      <span>Taxes & VIP Concierge Support</span>
                      <span>INCLUDED</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                      <span className="font-heading font-extrabold text-base sm:text-lg text-[#0A2540]">Total Due Today:</span>
                      <span className="font-heading font-extrabold text-3xl text-[#D96B27]">{formatCurrency(calculatedTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-1">
                  <label className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#D96B27] transition cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('agree_terms')}
                      className="mt-1 w-4 h-4 rounded text-[#D96B27] accent-[#D96B27] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I confirm that all guest names and dates match official travel documents, and I accept Uma International's <span className="text-[#0A2540] font-bold underline">Terms of Service</span> and <span className="text-[#0A2540] font-bold underline">Flexible Cancellation Policy</span>.
                    </span>
                  </label>
                  {errors.agree_terms && <p className="text-xs text-red-600 font-semibold mt-1 pl-2">{errors.agree_terms.message}</p>}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="px-6 py-4 rounded-2xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#D96B27] via-[#E69536] to-[#D96B27] hover:shadow-xl hover:shadow-[#D96B27]/40 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Securing Your Reservation...</span>
                      </span>
                    ) : (
                      <span>Confirm & Place Instant Booking</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS SCREEN */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
                    Reservation Confirmed
                  </span>
                  <h3 className="font-heading font-extrabold text-3xl text-[#0A2540]">
                    We Can't Wait to Welcome You!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{fullName}</strong>! We have dispatched your official reservation ticket and day-by-day itinerary to <strong className="text-emerald-700 underline">{email}</strong>.
                  </p>
                </div>

                {/* Reference Box */}
                <div className="bg-[#0A2540] text-white p-6 rounded-3xl max-w-md mx-auto space-y-2 shadow-xl border border-slate-700">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">
                    Your Official Booking Reference
                  </span>
                  <div className="font-mono font-extrabold text-2xl sm:text-3xl text-[#E69536] tracking-wider">
                    {confirmedBooking?.reference_code || 'UMA-CONFIRMED'}
                  </div>
                  <span className="text-xs text-slate-300 block pt-1 border-t border-white/10">
                    Keep this reference number handy for fast check-in.
                  </span>
                </div>

                <div className="bg-[#FAFAF7] p-5 rounded-3xl border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2">
                  <h5 className="font-bold text-[#0A2540] uppercase tracking-wider text-[11px]">Next Steps & Concierge Support:</h5>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                    <li>Your personal travel designer will call/WhatsApp (<span className="font-semibold">{phone}</span>) within 24 hours.</li>
                    <li>No upfront deposit is required until your custom flight schedule and hotel tiers are fully approved.</li>
                    <li>Need immediate assistance? Call our 24/7 desk at <strong className="text-[#0A2540]">+91 6156359772</strong>.</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-bold text-xs shadow-sm flex items-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#D96B27]" />
                    <span>Download / Print Summary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose && onClose();
                      window.location.href = '/packages';
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                  >
                    <span>Explore More Tours</span>
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MultiStepBookingModal;
