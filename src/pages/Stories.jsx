import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Clock,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { formatDate } from '../utils/format.js';
import { TravelBackgroundCanvas } from '../components/common/TravelBackgroundCanvas.jsx';

export const Stories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const page = searchParams.get('page') || '1';
        const res = await api.get(`/stories?page=${page}&limit=9`);
        const fetchedStories = res.data || [];
        setStories(fetchedStories);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({ page: Number(page), totalPages: Math.ceil(fetchedStories.length / 9) || 1, total: fetchedStories.length });
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const featuredStory = stories.length > 0 ? stories[0] : null;
  const gridStories = stories.length > 1 ? stories.slice(1) : stories;

  // Calculate read time from content length
  const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 180))} min read`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28 font-['Afacad',sans-serif]">
      {/* Cinematic Hero Header (Uma International Rounded Teal Style) */}
      <section className="relative bg-[#0E545A] text-white pt-36 pb-24 rounded-b-[40px] sm:rounded-b-[50px] overflow-hidden shadow-2xl border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b400?auto=format&fit=crop&w=2000&q=80"
            alt="Chronicles background"
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
              Editorial Dispatches &amp; Field Notes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-4xl sm:text-6xl text-white tracking-tight drop-shadow-md"
          >
            Travel Chronicles &amp; Essays
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Immersive dispatches, culinary guides, and firsthand travel reflections documented by our globetrotting designers and expedition leaders around the globe.
          </motion.p>
        </div>
      </section>

      {/* Main Journal Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">
        {loading ? (
          <div className="space-y-10 animate-pulse">
            <div className="h-[420px] bg-white rounded-3xl border border-slate-200 p-6 flex gap-6">
              <div className="w-1/2 bg-slate-200 rounded-2xl" />
              <div className="w-1/2 space-y-6 py-4">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded w-5/6" />
                <div className="h-24 bg-slate-200 rounded w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-white rounded-3xl border border-slate-200 p-4 space-y-4">
                  <div className="h-52 bg-slate-200 rounded-2xl" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-16 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-lg max-w-xl mx-auto space-y-5 px-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center mx-auto border border-slate-200">
              <BookOpen className="w-10 h-10 text-[#D96B27]" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#0A2540]">No Stories Published Yet</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our editorial team is preparing exciting destination dispatches and field notes. Please check back shortly for new travel journals!
            </p>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white text-xs font-bold shadow-md transition"
            >
              <span>Explore Tour Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* FEATURED STORY SPOTLIGHT (First Story) */}
            {featuredStory && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  to={`/stories/${featuredStory.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-slate-200/80 hover:border-[#D96B27]/40 transition-all duration-300"
                >
                  <div className="lg:col-span-7 h-80 sm:h-96 lg:h-auto overflow-hidden bg-[#0A2540] relative">
                    <img
                      src={
                        featuredStory.cover_image_url ||
                        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=85'
                      }
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 bg-[#D96B27] text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
                      Featured Field Note
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 text-[#D96B27]">
                          <User className="w-4 h-4" />
                          {featuredStory.author_name || 'Senior Designer'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(featuredStory.created_at)}
                        </span>
                      </div>

                      <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#0A2540] group-hover:text-[#D96B27] transition-colors leading-tight">
                        {featuredStory.title}
                      </h2>

                      <p className="text-slate-600 text-base leading-relaxed line-clamp-4 font-normal">
                        {featuredStory.content}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between font-bold text-sm text-[#0A2540] group-hover:text-[#D96B27] transition-colors">
                      <span className="flex items-center gap-2">
                        <span>Read Full Chronicle</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateReadTime(featuredStory.content)}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* STAGGERED GRID OF REMAINING STORIES */}
            {gridStories.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <h2 className="font-heading font-extrabold text-2xl text-[#0A2540]">
                    Latest Dispatches & Essays
                  </h2>
                  <span className="text-xs font-bold text-slate-500">
                    Showing {stories.length} published {stories.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridStories.map((story, idx) => (
                    <motion.div
                      key={story.id || story.slug}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 hover:border-[#D96B27]/40 flex flex-col justify-between group transition-all duration-300"
                    >
                      <Link to={`/stories/${story.slug}`} className="block relative h-56 overflow-hidden bg-[#0A2540]">
                        <img
                          src={
                            story.cover_image_url ||
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#0A2540] px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">
                          {calculateReadTime(story.content)}
                        </div>
                      </Link>

                      <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1 text-[#D96B27] truncate max-w-[140px]">
                              <User className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{story.author_name || 'Senior Editor'}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{formatDate(story.created_at)}</span>
                            </span>
                          </div>

                          <Link to={`/stories/${story.slug}`}>
                            <h3 className="font-heading font-extrabold text-xl text-[#0A2540] group-hover:text-[#D96B27] transition-colors line-clamp-2 leading-snug">
                              {story.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                            {story.content}
                          </p>
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            to={`/stories/${story.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2540] group-hover:text-[#D96B27] transition-colors group-hover:translate-x-1 duration-200"
                          >
                            <span>Continue Reading</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <span className="text-[11px] text-slate-400 font-semibold">Field Journal</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* PAGINATION BAR */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setSearchParams({ page: String(Number(pagination.page) - 1) })}
              className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-[#0A2540] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs sm:text-sm font-bold text-[#0A2540] bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setSearchParams({ page: String(Number(pagination.page) + 1) })}
              className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-[#0A2540] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
