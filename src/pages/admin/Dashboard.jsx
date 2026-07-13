import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import {
  Users,
  Calendar,
  Package,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Eye,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    revenueThisMonth: 0,
    publishedPackages: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/bookings?limit=5'),
      ]);

      if (statsRes?.success) {
        setStats(statsRes.data || {
          totalBookings: 0,
          pendingBookings: 0,
          revenueThisMonth: 0,
          publishedPackages: 0,
        });
      }
      if (bookingsRes?.success) {
        setRecentBookings(bookingsRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      toast.error('Failed to update dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      subtitle: 'All-time reservations',
      icon: Calendar,
      iconBg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Pending Inquiries',
      value: stats.pendingBookings,
      subtitle: stats.pendingBookings > 0 ? 'Requires attention' : 'All caught up',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.revenueThisMonth || 0),
      subtitle: 'Current calendar month',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Published Tours',
      value: stats.publishedPackages,
      subtitle: 'Active catalog packages',
      icon: Package,
      iconBg: 'bg-teal-50 text-[#0E545A]',
      border: 'border-teal-100',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-['Afacad',sans-serif]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0E545A] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Admin Overview
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Here is what is happening with your travel reservations today.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 active:scale-98 disabled:opacity-50 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0E545A]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{card.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} ${card.border} border`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-slate-100 rounded-md animate-pulse" />
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-slate-400 font-normal mt-1">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Recent Guest Bookings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest inquiries submitted via online package checkout.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E545A] hover:text-[#0b4247] transition"
          >
            <span>View All Bookings</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-9 h-9 rounded-full border-3 border-[#0E545A]/20 border-t-[#0E545A] animate-spin" />
            <p className="text-xs text-slate-400 font-medium animate-pulse">Loading recent reservations...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center space-y-2 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No recent reservations found</p>
            <p className="text-xs text-slate-400 max-w-sm font-normal">
              When guests book tour packages from the website, their reservation details will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 text-xs font-medium">
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Guest Traveler</th>
                  <th className="py-3.5 px-6">Package</th>
                  <th className="py-3.5 px-6">Travel Date</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-[#0E545A]">
                      {b.reference_code || `#${b.id?.slice(0, 8).toUpperCase()}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 text-sm">{b.full_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 max-w-[200px] truncate font-medium">
                      {b.tour_packages?.title || 'Custom Package'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {b.travel_date ? formatDate(b.travel_date) : 'Flexible'}
                    </td>
                    <td className="py-4 px-6 font-heading font-bold text-slate-900">
                      {formatCurrency(b.total_price || 0)}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/bookings"
                        className="p-2 inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-[#0E545A] text-slate-600 hover:text-white transition shadow-2xs"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
