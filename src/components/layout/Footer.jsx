import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, Share2, Send, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import umaLogo from '../../assets/Uma_logo_w.png';
import iataLogo from '../../assets/iata-logo.png';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to Uma International travel updates!');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#FAF8F0] text-[#0E545A] pt-12 pb-10 border-t border-[#0E545A]/15 font-['Afacad',sans-serif] relative overflow-hidden">
      
      {/* Top Divider with Safari SUV Car & Island Horizon (Exact Picture 5 Top Border) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-14">
        <div className="flex items-center justify-between pb-4">
          <div className="hidden sm:block opacity-80">
            <svg className="w-40 sm:w-56 h-16 text-[#0E545A]" viewBox="0 0 200 60" fill="currentColor">
              {/* Cute Safari Car Vector */}
              <path d="M20,40 L35,25 L85,25 L105,40 L160,40 C165,40 170,45 170,50 L170,55 L15,55 L15,50 C15,45 18,40 20,40 Z" />
              <circle cx="45" cy="55" r="9" fill="#1E293B" />
              <circle cx="45" cy="55" r="4" fill="#FAF8F0" />
              <circle cx="140" cy="55" r="9" fill="#1E293B" />
              <circle cx="140" cy="55" r="4" fill="#FAF8F0" />
              <path d="M42,28 L80,28 L95,38 L32,38 Z" fill="#FAF8F0" />
            </svg>
          </div>
          <div className="hidden md:block opacity-85">
            <svg className="w-36 h-16 text-[#0E545A]" viewBox="0 0 160 60" fill="currentColor">
              {/* Tropical Island Vector */}
              <path d="M10,55 Q50,40 90,55 T150,55 Z" />
              <path d="M60,55 Q60,20 80,10 Q65,25 65,55 Z" fill="#86C232" />
              <path d="M65,25 Q90,15 105,30 Z" fill="#86C232" />
            </svg>
          </div>
        </div>
        <div className="w-full h-0.5 bg-[#0E545A]/25" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exact Rounded Forest Teal Subscribe Box (Picture 5 Bottom Banner) */}
        <div className="bg-[#0E545A] rounded-[36px] p-8 sm:p-12 max-w-5xl mx-auto mb-16 text-white flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 shadow-2xl relative z-20">
          <div className="space-y-2 max-w-lg">
            <h3 className="font-bold text-3xl sm:text-5xl tracking-tight">
              Subscribe <span className="text-[#ECA815]">Now!</span>
            </h3>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              Sign up to weekly newsletter to get the latest updates.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="bg-white rounded-full p-2 flex items-center max-w-md w-full shadow-lg">
            <input
              type="email"
              placeholder="Email address.."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none truncate"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0E545A] hover:bg-[#0B5E63] text-white flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>

        {/* 4 Column Footer Grid (Exact Picture 5 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[#0E545A]/20">
          {/* Column 1: Logo & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block group py-1">
              <span className="font-['Kaushan_Script',cursive] text-4xl font-bold text-[#86C232] drop-shadow-sm block">
                Uma <span className="text-[#0E545A] text-2xl font-['Afacad',sans-serif] block -mt-1 font-extrabold">International Travel</span>
              </span>
            </Link>
            <p className="text-[#0E545A]/80 text-sm leading-relaxed font-medium">
              Uma International is a multi-award-winning strategy and content creation agency specializing in luxury travel itineraries. We have one of India's most trusted travel networks, helping guests explore the world differently.
            </p>
            {/* Circular Colored Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0E545A] text-white hover:bg-[#ECA815] flex items-center justify-center transition-colors font-bold text-sm shadow-md">
                𝕏
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0E545A] text-white hover:bg-[#86C232] hover:text-[#0A2540] flex items-center justify-center transition-colors shadow-md">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0E545A] text-white hover:bg-[#F59E0B] flex items-center justify-center transition-colors shadow-md">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0E545A] text-white hover:bg-[#D96B27] flex items-center justify-center transition-colors font-bold text-sm shadow-md">
                P
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-xl text-[#0E545A]">Explore</h4>
            <ul className="space-y-2.5 text-base font-semibold text-[#0E545A]/80">
              <li><Link to="/about" className="hover:text-[#ECA815] transition-colors">About us</Link></li>
              <li><Link to="/about" className="hover:text-[#ECA815] transition-colors">FAQ's</Link></li>
              <li><Link to="/packages" className="hover:text-[#ECA815] transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-[#ECA815] transition-colors">Team</Link></li>
              <li><Link to="/stories" className="hover:text-[#ECA815] transition-colors">News & Articles</Link></li>
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-xl text-[#0E545A]">Destinations</h4>
            <ul className="space-y-2.5 text-base font-semibold text-[#0E545A]/80">
              <li><Link to="/packages?destination=Paris" className="hover:text-[#ECA815] transition-colors">Paris</Link></li>
              <li><Link to="/packages?destination=Maldives" className="hover:text-[#ECA815] transition-colors">Maldives</Link></li>
              <li><Link to="/packages?destination=Hongkong" className="hover:text-[#ECA815] transition-colors">Hongkong</Link></li>
              <li><Link to="/packages?destination=Thailand" className="hover:text-[#ECA815] transition-colors">Thailand</Link></li>
              <li><Link to="/packages?destination=Bangkok" className="text-[#ECA815] font-bold">Bangkok</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Contact Information */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <h4 className="font-bold text-xl text-[#0E545A] mb-3">Legal</h4>
              <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#0E545A]/80 mb-6">
                <Link to="/contact" className="hover:text-[#ECA815]">Terms & Condition</Link>
                <Link to="/contact" className="hover:text-[#ECA815]">Privacy Policy</Link>
                <Link to="/contact" className="hover:text-[#ECA815]">Contact</Link>
              </div>
            </div>

            {/* Telephone & Contact Box */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E545A]/10 text-[#0E545A] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <span className="font-['Kaushan_Script',cursive] text-2xl font-bold text-[#0E545A] leading-none block">
                    +91-6156359772
                  </span>
                  <span className="text-xs font-bold text-slate-500 block">+91-9771648655 (WhatsApp VIP)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E545A]/10 text-[#0E545A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 font-bold" />
                </div>
                <a href="mailto:umatravelskk@gmail.com" className="text-base font-bold text-[#0E545A] hover:text-[#ECA815] transition-colors">
                  umatravelskk@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-[#0E545A]/10 text-[#0E545A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 font-bold" />
                </div>
                <p className="text-sm font-bold text-[#0E545A]/90 leading-relaxed">
                  Post Office Chowk, Banjari Road, Gopalganj & Kushwaha Market, Kuchaikote, Bihar, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left text-sm font-bold text-[#0E545A]/70">
          <div>
            &copy; 2026 <strong className="text-[#ECA815]">UMA INTERNATIONAL TRAVEL SERVICES</strong> All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-[#0E545A] transition-colors flex items-center gap-1.5 font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#ECA815]" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
