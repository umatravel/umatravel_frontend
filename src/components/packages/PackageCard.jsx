import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Star, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

export const PackageCard = ({ pkg, index = 0 }) => {
  const displayPrice = pkg.discount_price || pkg.price;
  const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-[#D96B27]/40 flex flex-col justify-between group transition-all duration-300 relative h-full"
    >
      {/* Visual Header */}
      <div className="relative h-60 overflow-hidden bg-[#0A2540]">
        <img
          src={
            (pkg.package_images && pkg.package_images.length > 0)
              ? pkg.package_images[0].image_url
              : (pkg.images && pkg.images.length > 0)
              ? pkg.images[0].image_url
              : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
          }
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent opacity-70" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
          <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#0A2540] shadow-sm">
            {pkg.category || 'Expedition'}
          </span>
          {pkg.is_featured && (
            <span className="bg-gradient-to-r from-amber-500 to-[#E69536] text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-slate-950" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Customizable Badge / Discount Badge */}
        <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-1.5">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold shadow-md animate-pulse">
              Save {formatCurrency(pkg.price - pkg.discount_price)}
            </span>
          )}
          {pkg.is_customizable && (
            <span className="bg-[#0A2540]/90 backdrop-blur-md border border-white/20 text-[#E69536] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Customizable</span>
            </span>
          )}
        </div>

        {/* Duration Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-bold">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-[#E69536]" />
            <span className="truncate max-w-[150px] sm:max-w-[180px]">{pkg.destination}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-[#E69536]" />
            <span>{pkg.duration_days}D / {pkg.duration_nights}N</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="font-heading font-extrabold text-xl text-[#0A2540] group-hover:text-[#D96B27] transition-colors line-clamp-1 leading-snug">
            {pkg.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {pkg.description}
          </p>
        </div>

        {/* Price & CTA Section */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Starting from
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
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

          <Link
            to={`/packages/${pkg.slug}`}
            className="px-5 py-2.5 rounded-2xl bg-[#0A2540] group-hover:bg-gradient-to-r group-hover:from-[#D96B27] group-hover:to-[#E69536] text-white text-xs font-bold transition-all shadow-md group-hover:shadow-lg flex items-center gap-1.5 group-hover:scale-105 active:scale-95 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
