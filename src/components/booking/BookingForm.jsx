import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Calendar, Mail, Phone, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api.js';
import { formatCurrency } from '../../utils/format.js';

// Zod Schema for instant guest checkout
const bookingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Phone number is required (min 7 digits)'),
  travel_date: z.string().refine((val) => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Travel date must be today or a future date'),
  travelers_count: z.number({ invalid_type_error: 'Travelers count must be a number' }).int().min(1, 'At least 1 traveler is required'),
  custom_requirements: z.string().optional(),
});

export const BookingForm = ({ pkg }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const unitPrice = pkg.discount_price || pkg.price || 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      travel_date: '',
      travelers_count: 2,
      custom_requirements: '',
    },
  });

  const travelersCount = watch('travelers_count') || 1;
  const calculatedTotal = unitPrice * (travelersCount > 0 ? travelersCount : 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        package_id: pkg.id,
        ...data,
        travelers_count: Number(data.travelers_count),
      };

      const res = await api.post('/bookings', payload);
      toast.success('Tour reservation placed successfully!');
      setBookingResult(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to place booking. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="font-heading font-bold text-xl text-emerald-900">
          Reservation Confirmed!
        </h3>
        <p className="text-sm text-emerald-700 leading-relaxed">
          Thank you, <span className="font-semibold">{bookingResult.full_name}</span>! We have sent your booking confirmation and reference number to <span className="font-semibold">{bookingResult.email}</span>.
        </p>
        <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-slate-800">
          Reference Code: {bookingResult.reference_code || 'UMA-CONFIRMED'}
        </div>
        <div className="text-xs text-slate-500">
          Our travel specialists will contact you within 24 hours to finalize your itinerary details.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Reserve This Tour
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-heading font-bold text-3xl text-blue-950">
            {formatCurrency(unitPrice)}
          </span>
          <span className="text-sm text-slate-500">/ traveler</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Alexander Wright"
              {...register('full_name')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-600 transition"
            />
          </div>
          {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              placeholder="e.g. alex@example.com"
              {...register('email')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-600 transition"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="tel"
              placeholder="e.g. +1 (555) 019-2834"
              {...register('phone')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-600 transition"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        {/* Travel Date and Travelers Count Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Travel Date *
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('travel_date')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition"
              />
            </div>
            {errors.travel_date && <p className="text-[11px] text-red-600 mt-1">{errors.travel_date.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Travelers *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="number"
                min="1"
                max={pkg.max_group_size || 50}
                {...register('travelers_count', { valueAsNumber: true })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-600 transition"
              />
            </div>
            {errors.travelers_count && <p className="text-[11px] text-red-600 mt-1">{errors.travelers_count.message}</p>}
          </div>
        </div>

        {/* Custom Requirements */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Special Requests / Dietary Notes (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <textarea
              rows="3"
              placeholder="Tell us about any preferences or hotel requests..."
              {...register('custom_requirements')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-600 transition"
            />
          </div>
        </div>

        {/* Total Price Breakdown */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>{formatCurrency(unitPrice)} x {travelersCount} travelers</span>
            <span>{formatCurrency(calculatedTotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
            <span>Estimated Total:</span>
            <span className="text-blue-900 font-heading text-lg">{formatCurrency(calculatedTotal)}</span>
          </div>
          <p className="text-[11px] text-slate-400">Taxes and local transfers included.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Securing Reservation...</span>
          ) : (
            <span>Place Instant Reservation</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
