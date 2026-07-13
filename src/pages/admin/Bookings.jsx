import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import {
  CalendarCheck,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Bookings = () => {
  // Data state
  const [bookings, setBookings] = useState([]);
  const [packagesList, setPackagesList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');

  // Selected Booking Drawer state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load packages catalog once for package filter dropdown
  useEffect(() => {
    const fetchPackagesForFilter = async () => {
      try {
        const res = await api.get('/packages?limit=100');
        if (res?.success) {
          setPackagesList(res.data || []);
        }
      } catch (err) {
        console.error('Error loading packages catalog for filters:', err);
      }
    };
    fetchPackagesForFilter();
  }, []);

  // Fetch bookings whenever filters or page change
  const fetchBookings = async (pageToLoad = 1, showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageToLoad.toString());
      params.append('limit', '10');
      params.append('sort', 'desc');

      if (statusFilter) params.append('status', statusFilter);
      if (dateFromFilter) params.append('date_from', dateFromFilter);
      if (dateToFilter) params.append('date_to', dateToFilter);
      if (packageFilter) params.append('package_id', packageFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/admin/bookings?${params.toString()}`);
      if (res?.success) {
        setBookings(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      toast.error('Failed to retrieve bookings list');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  // Debounced search trigger
  const searchTimeoutRef = useRef(null);
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchBookings(1);
    }, 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, statusFilter, dateFromFilter, dateToFilter, packageFilter]);

  // Handle status update via PATCH /api/admin/bookings/:id/status
  const handleStatusChange = async (bookingId, newStatus, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (!bookingId || !newStatus) return;

    setUpdatingId(bookingId);
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (res?.success) {
        toast.success(`Booking status updated to '${newStatus.toUpperCase()}'`);
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      const msg = err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setPackageFilter('');
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };

  const getReferenceCode = (b) => {
    if (b.reference_code) return b.reference_code;
    return `#${b.id?.slice(0, 8).toUpperCase()}`;
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending
          </span>
        );
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery || statusFilter || dateFromFilter || dateToFilter || packageFilter
  );

  return (
    <div className="space-y-6 pb-12 font-['Afacad',sans-serif]">
      {/* Top Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0E545A] uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            Reservations Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Guest Bookings Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review, filter, and manage tour inquiries and reservation confirmations.
          </p>
        </div>

        <button
          onClick={() => fetchBookings(pagination.page)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 shadow-2xs active:scale-98 disabled:opacity-50 self-start sm:self-center shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0E545A]' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0E545A]" />
            Search & Filter Records
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#0E545A] hover:text-[#0b4247] font-semibold transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search by guest name / email / reference */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or ref code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0E545A] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0E545A] transition cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0E545A] transition cursor-pointer"
              title="Travel Date From"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0E545A] transition cursor-pointer"
              title="Travel Date To"
            />
          </div>
        </div>

        {/* Optional Package Filter */}
        {packagesList.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium shrink-0">Filter by Tour:</span>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0E545A] transition cursor-pointer max-w-sm w-full truncate"
            >
              <option value="">All Tour Packages ({packagesList.length})</option>
              {packagesList.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} ({pkg.destination || 'Global'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bookings Display Table + Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-[#0E545A]/20 border-t-[#0E545A] animate-spin" />
            <p className="text-xs font-medium text-slate-400 animate-pulse">Loading reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No matching bookings found</h3>
            <p className="text-xs text-slate-400 max-w-md font-normal">
              {hasActiveFilters
                ? 'Try clearing your filters or search query to see more reservations.'
                : 'There are currently no guest reservations in the system.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-[#0E545A] text-white text-xs font-medium shadow-2xs hover:bg-[#0b4247] transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Responsive Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-medium text-slate-500">
                    <th className="py-3.5 px-6">Reference</th>
                    <th className="py-3.5 px-6">Guest Contact</th>
                    <th className="py-3.5 px-6">Tour Package</th>
                    <th className="py-3.5 px-6">Travel Date</th>
                    <th className="py-3.5 px-6 text-center">Pax</th>
                    <th className="py-3.5 px-6">Total Amount</th>
                    <th className="py-3.5 px-6">Status / Action</th>
                    <th className="py-3.5 px-6 text-right">Created Date</th>
                    <th className="py-3.5 px-6 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.map((b) => {
                    const isUpdating = updatingId === b.id;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => openBookingDetails(b)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      >
                        {/* Reference Code */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-mono font-semibold text-xs text-[#0E545A] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                            {getReferenceCode(b)}
                          </span>
                        </td>

                        {/* Guest Contact */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 group-hover:text-[#0E545A] transition-colors">
                            <User className="w-3.5 h-3.5 text-[#0E545A] shrink-0" />
                            <span>{b.full_name || 'Guest Traveler'}</span>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-1 font-normal">
                            {b.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                {b.email}
                              </span>
                            )}
                            {b.phone && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                {b.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Tour Package */}
                        <td className="py-4 px-6 max-w-[200px]">
                          <div className="font-medium text-slate-800 line-clamp-1">
                            {b.tour_packages?.title || 'Custom Tour Package'}
                          </div>
                          {b.tour_packages?.destination && (
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#0E545A]" />
                              {b.tour_packages.destination}
                            </div>
                          )}
                        </td>

                        {/* Travel Date */}
                        <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600 font-medium">
                          {b.travel_date ? formatDate(b.travel_date) : 'Flexible'}
                        </td>

                        {/* Travelers Count */}
                        <td className="py-4 px-6 text-center font-semibold text-slate-700 text-xs">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
                            {b.travelers_count || 1}
                          </span>
                        </td>

                        {/* Total Price */}
                        <td className="py-4 px-6 whitespace-nowrap font-heading font-bold text-slate-900 text-sm">
                          {formatCurrency(b.total_price || 0)}
                        </td>

                        {/* Status + Row Action Dropdown */}
                        <td className="py-4 px-6 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {isUpdating ? (
                              <div className="flex items-center gap-1.5 text-xs text-[#0E545A] font-medium">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <select
                                value={b.status || 'pending'}
                                onChange={(e) => handleStatusChange(b.id, e.target.value, e)}
                                className={`px-3 py-1.5 rounded-xl font-medium text-xs border cursor-pointer focus:outline-none transition ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : b.status === 'cancelled'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                              >
                                <option value="pending">⏳ Pending</option>
                                <option value="confirmed">✅ Confirmed</option>
                                <option value="cancelled">❌ Cancelled</option>
                              </select>
                            )}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-6 text-right whitespace-nowrap text-slate-400 text-xs font-normal">
                          {formatDate(b.created_at)}
                        </td>

                        {/* Details Action */}
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingDetails(b);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-[#0E545A] text-slate-600 hover:text-white border border-slate-200 transition shadow-2xs"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {bookings.map((b) => {
                const isUpdating = updatingId === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => openBookingDetails(b)}
                    className="p-5 space-y-4 hover:bg-slate-50/60 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold text-xs text-[#0E545A] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                        {getReferenceCode(b)}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <User className="w-4 h-4 text-[#0E545A]" />
                        {b.full_name || 'Guest Traveler'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        📦 {b.tour_packages?.title || 'Custom Tour Package'}
                      </p>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {b.email && <span>📧 {b.email}</span>}
                        {b.phone && <span>📞 {b.phone}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Travel Date</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {b.travel_date ? formatDate(b.travel_date) : 'Flexible'}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 font-medium block">Travelers</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {b.travelers_count || 1} Pax
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium block">Total Price</span>
                        <span className="font-heading font-bold text-slate-900 block mt-0.5">
                          {formatCurrency(b.total_price || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Status:</span>
                        {isUpdating ? (
                          <span className="text-[#0E545A] font-medium animate-pulse">Updating...</span>
                        ) : (
                          <select
                            value={b.status || 'pending'}
                            onChange={(e) => handleStatusChange(b.id, e.target.value, e)}
                            className="px-3 py-1.5 rounded-xl font-medium text-xs bg-white text-slate-800 border border-slate-300 focus:outline-none cursor-pointer"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        )}
                      </div>

                      <button
                        onClick={() => openBookingDetails(b)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#0E545A] text-slate-700 hover:text-white border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-slate-500 font-normal">
                Showing page <strong className="text-slate-800">{pagination.page}</strong> of{' '}
                <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.total} bookings)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchBookings(pagination.page - 1)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchBookings(pagination.page + 1)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Drawer */}
      {drawerOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden font-['Afacad',sans-serif]">
          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col">
              <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <span className="font-mono font-semibold text-xs text-[#0E545A] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                    {getReferenceCode(selectedBooking)}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                    Reservation Details
                  </h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block">
                      Current Status
                    </span>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Update:</span>
                    <select
                      value={selectedBooking.status || 'pending'}
                      onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value, e)}
                      disabled={updatingId === selectedBooking.id}
                      className="px-3.5 py-2 rounded-xl font-medium text-xs bg-white text-slate-800 border border-slate-300 focus:outline-none focus:border-[#0E545A] cursor-pointer"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                  <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0E545A]" />
                    Guest Contact Information
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Full Name:</span>
                      <span className="font-semibold text-slate-900 text-sm">{selectedBooking.full_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Email Address:</span>
                      <a
                        href={`mailto:${selectedBooking.email}`}
                        className="font-semibold text-[#0E545A] hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {selectedBooking.email}
                      </a>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Phone Number:</span>
                      <a
                        href={`tel:${selectedBooking.phone}`}
                        className="font-semibold text-slate-800 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedBooking.phone}
                      </a>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">Booking UUID:</span>
                      <span className="font-mono text-[11px] text-slate-400">{selectedBooking.id}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                  <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#0E545A]" />
                    Tour & Schedule Details
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-start py-2 border-b border-slate-100 gap-4">
                      <span className="text-slate-500 shrink-0">Package Name:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {selectedBooking.tour_packages?.title || 'Custom Tour Package'}
                      </span>
                    </div>
                    {selectedBooking.tour_packages?.destination && (
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Destination:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0E545A]" />
                          {selectedBooking.tour_packages.destination}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Travel Date:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedBooking.travel_date ? formatDate(selectedBooking.travel_date) : 'Flexible'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Travelers Count:</span>
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {selectedBooking.travelers_count || 1} Traveler(s)
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">Inquiry Received On:</span>
                      <span className="text-slate-600 font-medium">
                        {formatDate(selectedBooking.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-tr from-[#0E545A]/10 to-teal-50/50 rounded-2xl p-5 border border-[#0E545A]/20 space-y-3">
                  <h4 className="text-xs font-semibold text-[#0E545A] flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Financial Summary
                  </h4>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200/60 text-xs text-slate-600">
                    <span>Base Price per Traveler:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        (selectedBooking.total_price || 0) / (selectedBooking.travelers_count || 1)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-slate-900">Total Cost:</span>
                    <span className="font-heading font-bold text-2xl text-slate-900">
                      {formatCurrency(selectedBooking.total_price || 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0E545A]" />
                    Custom Requirements & Notes
                  </h4>
                  {selectedBooking.custom_requirements ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedBooking.custom_requirements}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl border border-slate-200/50">
                      No special dietary, accommodation, or travel notes submitted by the guest.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                  disabled={selectedBooking.status === 'confirmed' || updatingId === selectedBooking.id}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </button>
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                  disabled={selectedBooking.status === 'cancelled' || updatingId === selectedBooking.id}
                  className="flex-1 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Reservation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
