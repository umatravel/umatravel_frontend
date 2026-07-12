import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  User,
  Calendar,
  ArrowLeft,
  Share2,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { formatDate } from '../utils/format.js';

export const StoryDetail = () => {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [relatedStories, setRelatedStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryAndRelated = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stories/${slug}`);
        const currentStory = res.data || null;
        setStory(currentStory);

        if (currentStory) {
          try {
            const relRes = await api.get('/stories?limit=4');
            if (relRes.data && Array.isArray(relRes.data)) {
              setRelatedStories(
                relRes.data.filter((s) => s.slug !== slug && s.id !== currentStory.id).slice(0, 3)
              );
            }
          } catch (e) {
            console.error('Failed to fetch related stories:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load story details:', err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStoryAndRelated();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return '4 min read';
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 180))} min read`;
  };

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse pb-28 bg-[#FAFAF7] min-h-screen pt-28">
        <div className="h-[480px] bg-slate-900 w-full" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-10 bg-slate-200 rounded w-3/4" />
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="space-y-4 pt-8">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4 py-36 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center mx-auto border border-slate-200">
            <BookOpen className="w-10 h-10 text-[#D96B27]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-extrabold text-3xl text-[#0A2540]">
              Chronicle Not Found
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              This travel field note may have been unpublished, archived, or moved to another seasonal volume.
            </p>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A2540] hover:bg-[#D96B27] text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Stories</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 pb-28">
      {/* Cinematic Cover Photo Header */}
      <section className="relative h-[60vh] sm:h-[70vh] bg-[#0A2540] text-white flex items-end overflow-hidden pb-16 pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src={
              story.cover_image_url ||
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85'
            }
            alt={story.title}
            className="w-full h-full object-cover opacity-55 scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/60 to-[#0A2540]/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E69536] hover:text-white transition bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-md"
          >
            {story.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20 text-xs sm:text-sm text-slate-200 font-bold"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-10 h-10 rounded-full bg-[#D96B27] text-white flex items-center justify-center font-extrabold text-xs shadow-md border border-white/20">
                  {story.author_name ? story.author_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span className="block text-white leading-tight">By {story.author_name || 'Senior Editor'}</span>
                  <span className="text-[11px] text-slate-300 font-normal">Senior Travel Designer</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <Calendar className="w-3.5 h-3.5 text-[#E69536]" />
                <span>{formatDate(story.created_at)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <Clock className="w-3.5 h-3.5 text-[#E69536]" />
                <span>{calculateReadTime(story.content)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: story.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#E69536]" />
              <span>Share Chronicle</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Article Body Content */}
      <motion.article
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12"
      >
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-slate-200/80 shadow-xl space-y-10">
          {/* Rich Content Rendering */}
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-normal whitespace-pre-line text-base sm:text-lg space-y-6">
            {story.content}
          </div>

          {/* Author Info Card */}
          <div className="bg-[#FAFAF7] p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left mt-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0A2540] to-[#0F3B4C] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-md shrink-0 border-2 border-[#E69536]">
              {story.author_name ? story.author_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-heading font-extrabold text-lg text-[#0A2540]">
                  {story.author_name || 'Senior Expedition Specialist'}
                </h4>
                <span className="bg-[#D96B27]/10 text-[#D96B27] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Contributor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Senior travel designer and expedition leader with Uma International Travel Services. Documenting bespoke itineraries, hidden sanctuaries, and cultural encounters across Europe, Asia, and luxury cruise departures.
              </p>
            </div>
          </div>

          {/* Back to Stories Link & Share */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A2540] hover:text-[#D96B27] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Stories</span>
            </Link>

            <Link
              to="/packages"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D96B27] hover:text-[#E69536] transition"
            >
              <span>Explore Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RELATED STORIES SECTION AT THE BOTTOM */}
        {relatedStories && relatedStories.length > 0 && (
          <section className="space-y-8 pt-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-3.5 py-1.5 rounded-full border border-[#D96B27]/20">
                  More From Our Journal
                </span>
                <h2 className="font-heading font-extrabold text-3xl text-[#0A2540] mt-2">
                  Related Travel Chronicles
                </h2>
              </div>
              <Link
                to="/stories"
                className="text-xs font-bold text-[#0A2540] hover:text-[#D96B27] flex items-center gap-1 transition"
              >
                <span>View Full Journal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedStories.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  to={`/stories/${rel.slug}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 hover:border-[#D96B27]/40 flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-[#0A2540]">
                    <img
                      src={
                        rel.cover_image_url ||
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">
                        {formatDate(rel.created_at)} • By {rel.author_name}
                      </span>
                      <h4 className="font-heading font-extrabold text-base text-[#0A2540] group-hover:text-[#D96B27] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#0A2540] group-hover:text-[#D96B27] flex items-center gap-1 pt-3 border-t border-slate-100">
                      <span>Read Chronicle</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner at bottom */}
        <div className="bg-gradient-to-br from-[#0A2540] to-[#0F3B4C] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#0A2540]">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#E69536] flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspired By This Chronicle?</span>
            </span>
            <h4 className="font-heading font-extrabold text-2xl text-white">
              Let Our Designers Build Your Bespoke Itinerary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Explore our luxury tour catalog or contact our senior planners to tailor a VIP journey to this destination.
            </p>
          </div>
          <Link
            to="/packages"
            className="px-8 py-4 rounded-full bg-[#D96B27] hover:bg-[#E69536] text-white font-bold text-xs sm:text-sm transition shadow-lg shrink-0 flex items-center gap-2 active:scale-95"
          >
            <span>Explore Tour Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.article>
    </div>
  );
};

export default StoryDetail;
