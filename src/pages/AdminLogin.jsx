import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isAdmin, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (session && isAdmin) {
      navigate(destination, { replace: true });
    }
  }, [session, isAdmin, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('System Authenticated. Welcome to the Admin Portal.');
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const message = err.message || 'Invalid email or password credentials.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0A2540]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D96B27]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto relative z-10"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F3B4C] text-[#E69536] flex items-center justify-center mx-auto shadow-lg border border-[#0F3B4C]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D96B27] bg-[#D96B27]/10 px-2.5 py-0.5 rounded-full mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Restricted Access</span>
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0A2540]">
                Admin Command Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Sign in with your verified Supabase credentials to manage bookings, itineraries, and stories.
            </p>
          </div>

          {/* Inline Error Alert */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                Authorized Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="umatravelskk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#0A2540] focus:bg-white transition disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                Security Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#0A2540] focus:bg-white transition disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#0A2540] hover:bg-[#D96B27] text-white font-bold text-sm shadow-xl shadow-[#0A2540]/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E69536]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer & Back Link */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-[#D96B27] flex items-center gap-1.5 font-bold transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>
            <span className="font-mono text-[11px] text-slate-400">v2.4-SEC</span>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Protected by Supabase Auth (JWT Verification) • Uma International Travel Services
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
