import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass, Globe, Sparkles } from 'lucide-react';

/**
 * TravelBackgroundCanvas (V3 - Clean Executive Aurora & Gliding Flight Vector)
 * Renders an ultra-clean, clutter-free luxury travel background.
 * Zero overlapping text labels or boxes — only pure ambient aurora glows,
 * subtle latitude grids, and graceful high-altitude flight trajectories.
 */
export const TravelBackgroundCanvas = ({ variant = 'dark' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isDark = variant === 'dark';

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 16,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Subtle Architectural Travel Grid Mesh */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-15' : 'opacity-[0.07]'}`}>
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      {/* 2. Soft Ambient Aurora Glow Spheres (Breathes gently behind content without clutter) */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: isDark ? [0.25, 0.45, 0.25] : [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] ${
          isDark ? 'bg-[#E69536]/20' : 'bg-[#D96B27]/15'
        }`}
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: isDark ? [0.2, 0.4, 0.2] : [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] ${
          isDark ? 'bg-sky-500/15' : 'bg-[#0A2540]/10'
        }`}
      />

      {/* 3. Parallax Floating Vector Elements (Subtle & Clean) */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 80 }}
        className="absolute inset-0"
      >
        {/* Subtle Watermark Compass in upper right corner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className={`absolute top-[12%] right-[8%] ${isDark ? 'text-white/10' : 'text-[#0A2540]/[0.06]'}`}
        >
          <Compass className="w-32 h-32" />
        </motion.div>

        {/* Subtle Watermark Globe in lower left corner */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
          className={`absolute bottom-[10%] left-[6%] ${isDark ? 'text-[#E69536]/10' : 'text-[#D96B27]/[0.06]'}`}
        >
          <Globe className="w-40 h-40" />
        </motion.div>

        {/* High-Altitude Flight Arc 1 (Smooth, graceful sweep across the sky) */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cleanArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#E69536' : '#D96B27'} stopOpacity="0" />
              <stop offset="50%" stopColor={isDark ? '#E69536' : '#D96B27'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isDark ? '#38bdf8' : '#0A2540'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -10 35 Q 45 -5 110 45"
            fill="none"
            stroke="url(#cleanArcGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Gliding High-Altitude Jet 1 */}
        <motion.div
          initial={{ left: '-10%', top: '35%', opacity: 0 }}
          animate={{
            left: ['-10%', '110%'],
            top: ['35%', '45%'],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            delay: 1,
            ease: 'linear',
          }}
          style={{ transform: 'rotate(12deg)' }}
          className="absolute flex items-center gap-1.5"
        >
          {/* Contrail Glow */}
          <div
            className={`w-20 h-0.5 rounded-full ${
              isDark
                ? 'bg-gradient-to-r from-transparent via-amber-400/80 to-transparent blur-[0.5px]'
                : 'bg-gradient-to-r from-transparent via-[#D96B27]/70 to-transparent'
            }`}
          />
          <div
            className={`p-2 rounded-full shadow-lg backdrop-blur-md ${
              isDark
                ? 'bg-[#E69536]/90 text-[#0A2540] shadow-[#E69536]/40'
                : 'bg-[#0A2540]/90 text-white shadow-[#0A2540]/30'
            }`}
          >
            <Plane className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Gliding High-Altitude Jet 2 (Reverse Diagonal) */}
        <motion.div
          initial={{ left: '110%', top: '75%', opacity: 0 }}
          animate={{
            left: ['110%', '-10%'],
            top: ['75%', '55%'],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            delay: 10,
            ease: 'linear',
          }}
          style={{ transform: 'rotate(-168deg)' }}
          className="absolute flex items-center gap-1.5"
        >
          <div
            className={`w-16 h-0.5 rounded-full ${
              isDark
                ? 'bg-gradient-to-r from-transparent via-sky-400/60 to-transparent blur-[0.5px]'
                : 'bg-gradient-to-r from-transparent via-[#0A2540]/50 to-transparent'
            }`}
          />
          <div
            className={`p-1.5 rounded-full shadow-md backdrop-blur-md ${
              isDark
                ? 'bg-sky-400/80 text-[#0A2540]'
                : 'bg-[#D96B27]/90 text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Subtle Ambient Sparkles (Adds high-end shimmer without visual noise) */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[28%] left-[30%] ${isDark ? 'text-[#E69536]/40' : 'text-[#D96B27]/30'}`}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className={`absolute top-[65%] right-[25%] ${isDark ? 'text-sky-300/40' : 'text-[#0A2540]/30'}`}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TravelBackgroundCanvas;
