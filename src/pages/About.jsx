import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Award,
  ShieldCheck,
  HeartHandshake,
  Globe,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TravelBackgroundCanvas } from '../components/common/TravelBackgroundCanvas.jsx';

export const About = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28 font-['Afacad',sans-serif]">
      {/* Cinematic Animated Hero Banner (Uma International Rounded Teal Style) */}
      <section className="relative bg-[#0E545A] text-white pt-36 pb-28 rounded-b-[40px] sm:rounded-b-[50px] overflow-hidden shadow-2xl border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80"
            alt="Heritage background"
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
              Our Heritage, Mission &amp; Vision
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-4xl sm:text-6xl text-white tracking-tight drop-shadow-md"
          >
            Architects of Extraordinary Global Expeditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            At Uma International Travel Services, we believe travel is not merely about checking destinations off a map - it is about profound transformation, uncompromising comfort, and authentic human connection.
          </motion.p>
        </div>
      </section>

      {/* STATS COUNTERS SECTION (Floating over Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              value: '15+',
              label: 'Years of Excellence',
              desc: 'Pioneering bespoke luxury itineraries since 2011',
              icon: Clock,
            },
            {
              value: '15,000+',
              label: 'Delighted Travelers',
              desc: 'Families, honeymooners & VIP corporate groups',
              icon: Users,
            },
            {
              value: '65+',
              label: 'Countries Handcrafted',
              desc: 'Curated access to 6 continents & island sanctuaries',
              icon: Globe,
            },
            {
              value: '300+',
              label: 'Master Local Guides',
              desc: 'Private historians, naturalists & Michelin chefs',
              icon: Award,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xl space-y-3 flex flex-col justify-between hover:border-[#D96B27]/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A2540]/5 text-[#0A2540] group-hover:bg-[#D96B27] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D96B27] bg-[#D96B27]/10 px-2.5 py-1 rounded-full">
                    Verified
                  </span>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0A2540]">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                    {stat.label}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* COMPANY STORY & MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-xs font-bold uppercase tracking-widest border border-[#D96B27]/20">
              <span>Our Origins & Philosophy</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2540] leading-tight">
              From Bihar to the World: The Story of Uma International
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              Founded in Gopalganj and Kuchaikote, <strong className="text-[#0A2540] font-bold">Uma International Travel Services</strong> began with a singular, uncompromising vision: to elevate travel planning from standard ticketing into an art form. We recognized that travelers sought more than generic packages - they craved bespoke attention, seamless logistics, and insider access.
            </p>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              Today, our reach spans over 65 countries. Whether arranging private helicopter transfers over the Swiss Alps, booking exclusive water villas in the Maldives, or organizing heritage spiritual circuits across India, we maintain direct relationships with master hoteliers, airlines, and local specialists to guarantee every guest is treated like VIP royalty.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Bespoke Customization', desc: 'No two itineraries are ever identical. Every tour is tailored to your dates, preferences, and pace.' },
                { title: '24/7 Concierge Hotline', desc: 'Our senior designers monitor your journey real-time across timezones to handle any surprise needs.' },
                { title: 'Best Price Guarantee', desc: 'Direct contract pricing with global luxury resorts ensures you never overpay for 5-star hospitality.' },
                { title: 'Global VIP Airport Access', desc: 'Fast-track immigration assistance, private lounge access, and chauffeured limousine pick-ups.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-xs">
                  <h4 className="font-heading font-bold text-sm text-[#0A2540] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D96B27] shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#0A2540]/20 transition-all active:scale-95"
              >
                <span>Explore Tour Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0A2540] font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition"
              >
                <span>Contact Our Offices</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 grid grid-cols-2 gap-6 relative"
          >
            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
                alt="Luxury Hotel Lobby"
                className="rounded-3xl shadow-2xl object-cover h-64 w-full border border-slate-200 hover:scale-102 transition-transform duration-500"
              />
              <div className="bg-[#D96B27] text-white p-6 rounded-3xl shadow-xl space-y-1">
                <span className="font-heading font-extrabold text-3xl">99.4%</span>
                <span className="text-xs font-extrabold uppercase tracking-wider block">Guest Satisfaction Score</span>
                <p className="text-[11px] text-white/80 pt-1 leading-relaxed">Based on 15,000+ completed guest surveys since 2011.</p>
              </div>
            </div>
            <div className="space-y-6 pt-10">
              <div className="bg-[#0A2540] text-white p-6 rounded-3xl shadow-xl space-y-1 border border-slate-700">
                <span className="font-heading font-extrabold text-3xl text-[#E69536]">100%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">Financial Protection</span>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">Guaranteed secure bookings & certified partner networks.</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                alt="Tropical Beach Sanctuary"
                className="rounded-3xl shadow-2xl object-cover h-64 w-full border border-slate-200 hover:scale-102 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-3.5 py-1.5 rounded-full border border-[#D96B27]/20">
            Guiding Principles
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2540] tracking-tight">
            Our Pillars of Hospitality
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Every itinerary we construct and every reservation we secure is anchored by three uncompromising promises to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: 'Authentic Immersion',
              desc: 'We prioritize meaningful cultural encounters with local artisans, historians, and award-winning chefs over rushed sightseeing checklists.',
            },
            {
              icon: ShieldCheck,
              title: 'Absolute Peace of Mind',
              desc: 'With 24/7 global tracking, private chauffeur backups, and dedicated emergency contingency planning, you explore with total confidence.',
            },
            {
              icon: HeartHandshake,
              title: 'Sustainable Heritage',
              desc: 'We partner exclusively with eco-conscious lodges and reinvest in wildlife conservation and cultural preservation in every region we visit.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -8 }}
              className="bg-white p-9 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#D96B27]/40 space-y-5 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540]/5 text-[#0A2540] group-hover:bg-[#D96B27] group-hover:text-white flex items-center justify-center shadow-xs transition-colors">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#0A2540] group-hover:text-[#D96B27] transition-colors">{item.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM LEADERSHIP PLACEHOLDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-3.5 py-1.5 rounded-full border border-[#D96B27]/20">
            The Faces Behind Your Journeys
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2540] tracking-tight">
            Meet Our Senior Travel Designers & Leadership
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Our team brings together decades of hospitality management, expedition leadership, and personal passion for global discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: 'Rajeshwar Kushwaha',
              role: 'Founder & Managing Director',
              bio: '30+ years in travel logistics across Bihar and international travel networks. Visionary behind Uma International.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
              location: 'Gopalganj Headquarters',
            },
            {
              name: 'Priya Sharma',
              role: 'Head of European Expeditions',
              bio: 'Former luxury hotelier in Zurich & Paris. Specialist in Alpine skiing, rail journeys, and private wine estate tours.',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
              location: 'International Desk',
            },
            {
              name: 'Vikramaditya Singh',
              role: 'Senior Wildlife & Safari Director',
              bio: 'Certified naturalist with 14 seasons leading private photographic expeditions across Kenya, Tanzania, and Ranthambore.',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
              location: 'Expedition Operations',
            },
            {
              name: 'Ananya Deshmukh',
              role: 'Island Sanctuaries Specialist',
              bio: 'Expert in Indian Ocean resort pairings, private yacht charters, and bespoke honeymoon celebrations across Maldives & Bali.',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
              location: 'Concierge Desk',
            },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 flex flex-col justify-between group transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden bg-[#0A2540]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E69536] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    {member.location}
                  </span>
                  <h4 className="font-heading font-extrabold text-xl text-white mt-2">{member.name}</h4>
                  <span className="text-xs font-bold text-slate-300 block">{member.role}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{member.bio}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A2540]">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>Assigned Designer</span>
                  </span>
                  <Link to="/contact" className="text-[#D96B27] hover:underline">
                    Inquire →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
        <div className="bg-gradient-to-br from-[#0A2540] to-[#0F3B4C] rounded-3xl p-12 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl border border-[#0A2540]">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#D96B27]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-[#E69536] text-xs font-bold uppercase tracking-wider border border-white/15">
              <span>Let's Build Your Dream Itinerary</span>
            </span>
            <h3 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
              Ready to Experience Travel Like Never Before?
            </h3>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Contact our senior planners today or explore our curated selection of featured packages across Europe, Asia, and luxury island retreats.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-9 py-4 rounded-full bg-[#D96B27] hover:bg-[#E69536] text-white font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Speak With a Senior Designer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/packages"
                className="px-9 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition backdrop-blur-md"
              >
                <span>Browse Package Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
