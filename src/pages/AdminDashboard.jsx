import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Package, BookOpen, Calendar, DollarSign, Users, Plus, CheckCircle, XCircle, Clock, Trash2, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { api } from '../lib/api.js';
import { formatCurrency, formatDate } from '../utils/format.js';

export const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [stories, setStories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // New Package Form Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isSubmittingPackage, setIsSubmittingPackage] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgDest, setNewPkgDest] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgDays, setNewPkgDays] = useState('5');
  const [newPkgNights, setNewPkgNights] = useState('4');
  const [newPkgCategory, setNewPkgCategory] = useState('Adventure');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgImages, setNewPkgImages] = useState([]);
  const [newPkgImageUrls, setNewPkgImageUrls] = useState('');

  // Edit Package Form Modal State
  const [editingPkg, setEditingPkg] = useState(null);
  const [isSubmittingEditPackage, setIsSubmittingEditPackage] = useState(false);
  const [editPkgTitle, setEditPkgTitle] = useState('');
  const [editPkgDest, setEditPkgDest] = useState('');
  const [editPkgPrice, setEditPkgPrice] = useState('');
  const [editPkgDays, setEditPkgDays] = useState('5');
  const [editPkgNights, setEditPkgNights] = useState('4');
  const [editPkgCategory, setEditPkgCategory] = useState('Adventure');
  const [editPkgDesc, setEditPkgDesc] = useState('');
  const [editPkgImages, setEditPkgImages] = useState([]);
  const [editPkgImageUrls, setEditPkgImageUrls] = useState('');
  const [editRemoveImageIds, setEditRemoveImageIds] = useState([]);

  // New Story Form Modal State
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryAuthor, setNewStoryAuthor] = useState('');
  const [newStoryContent, setNewStoryContent] = useState('');
  const [newStoryImage, setNewStoryImage] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Admin authentication required.');
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, bookingsRes, packagesRes, storiesRes] = await Promise.all([
        api.get('/admin/dashboard/stats').catch(() => ({ data: null })),
        api.get('/admin/bookings?limit=50').catch(() => ({ data: [] })),
        api.get('/packages?limit=50&all=true').catch(() => ({ data: [] })),
        api.get('/stories?limit=50&all=true').catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      setBookings(bookingsRes.data || []);
      setPackages(packagesRes.data || []);
      setStories(storiesRes.data || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update booking status');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      toast.success('Package deleted successfully');
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete package');
    }
  };

  const handleUpdatePackageStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await api.patch(`/admin/packages/${id}/status`, { status: newStatus });
      toast.success(`Package status updated to ${newStatus}`);
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update package status');
    }
  };

  const handleUpdatePackageFeatured = async (id, currentFeatured) => {
    try {
      const newFeatured = !currentFeatured;
      await api.patch(`/admin/packages/${id}/status`, { is_featured: newFeatured });
      toast.success(`Package ${newFeatured ? 'marked as featured ⭐' : 'removed from featured'}`);
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update featured state');
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this travel story?')) return;
    try {
      await api.delete(`/stories/${id}`);
      toast.success('Story deleted successfully');
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete story');
    }
  };

  const handleUpdateStoryStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.patch(`/stories/${id}/status`, { is_published: newStatus });
      toast.success(`Story status updated to ${newStatus ? 'published' : 'draft'}`);
      loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update story status');
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (isSubmittingPackage) return;
    setIsSubmittingPackage(true);
    try {
      const formData = new FormData();
      formData.append('title', newPkgTitle);
      formData.append('destination', newPkgDest);
      formData.append('price', Number(newPkgPrice));
      formData.append('duration_days', Number(newPkgDays));
      formData.append('duration_nights', Number(newPkgNights));
      formData.append('category', newPkgCategory);
      formData.append('description', newPkgDesc);
      formData.append('status', 'published');

      if (newPkgImages && newPkgImages.length > 0) {
        newPkgImages.forEach((file) => {
          formData.append('images', file);
        });
      }

      if (newPkgImageUrls.trim()) {
        const urls = newPkgImageUrls
          .split('\n')
          .map((u) => u.trim())
          .filter((u) => u.length > 0);
        if (urls.length > 0) {
          formData.append('image_urls', JSON.stringify(urls));
        }
      }

      await api.post('/admin/packages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Tour package created successfully along with multiple photos!');
      setShowPackageModal(false);
      setNewPkgTitle('');
      setNewPkgDest('');
      setNewPkgPrice('');
      setNewPkgDesc('');
      setNewPkgImages([]);
      setNewPkgImageUrls('');
      await loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to create package');
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  const openEditPackageModal = (pkg) => {
    const existingImages = pkg.package_images || pkg.images || [];
    setEditingPkg({ ...pkg, package_images: existingImages, images: existingImages });
    setEditPkgTitle(pkg.title || '');
    setEditPkgDest(pkg.destination || '');
    setEditPkgPrice(pkg.price || '');
    setEditPkgDays(pkg.duration_days || '5');
    setEditPkgNights(pkg.duration_nights || '4');
    setEditPkgCategory(pkg.category || 'Adventure');
    setEditPkgDesc(pkg.description || '');
    setEditPkgImages([]);
    setEditPkgImageUrls('');
    setEditRemoveImageIds([]);
  };

  const handleUpdatePackageDetails = async (e) => {
    e.preventDefault();
    if (!editingPkg || isSubmittingEditPackage) return;
    setIsSubmittingEditPackage(true);
    try {
      const formData = new FormData();
      formData.append('title', editPkgTitle);
      formData.append('destination', editPkgDest);
      formData.append('price', Number(editPkgPrice));
      formData.append('duration_days', Number(editPkgDays));
      formData.append('duration_nights', Number(editPkgNights));
      formData.append('category', editPkgCategory);
      formData.append('description', editPkgDesc);

      if (editPkgImages && editPkgImages.length > 0) {
        editPkgImages.forEach((file) => {
          formData.append('images', file);
        });
      }

      if (editPkgImageUrls.trim()) {
        const urls = editPkgImageUrls
          .split('\n')
          .map((u) => u.trim())
          .filter((u) => u.length > 0);
        if (urls.length > 0) {
          formData.append('image_urls', JSON.stringify(urls));
        }
      }

      if (editRemoveImageIds.length > 0) {
        formData.append('remove_image_ids', JSON.stringify(editRemoveImageIds));
      }

      await api.put(`/admin/packages/${editingPkg.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Tour package & photos updated successfully!');
      setEditingPkg(null);
      await loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update package');
    } finally {
      setIsSubmittingEditPackage(false);
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (isSubmittingStory) return;
    setIsSubmittingStory(true);
    try {
      const formData = new FormData();
      formData.append('title', newStoryTitle);
      formData.append('author_name', newStoryAuthor);
      formData.append('content', newStoryContent);
      formData.append('is_published', 'true');
      if (newStoryImage) {
        formData.append('cover_image', newStoryImage);
      }

      await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Story published successfully!');
      setShowStoryModal(false);
      setNewStoryTitle('');
      setNewStoryAuthor('');
      setNewStoryContent('');
      setNewStoryImage(null);
      await loadAllAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to publish story');
    } finally {
      setIsSubmittingStory(false);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Control Panel
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Admin Management Portal
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Logged in as {user?.email}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              await logout();
              toast.success('Signed out cleanly.');
            } catch (err) {
              console.error('Logout error:', err);
            } finally {
              navigate('/admin/login', { replace: true });
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#E69536]" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'overview', name: 'Overview Stats', icon: DollarSign },
          { id: 'bookings', name: `Guest Bookings (${bookings.length})`, icon: Calendar },
          { id: 'packages', name: `Tour Packages (${packages.length})`, icon: Package },
          { id: 'stories', name: `Travel Stories (${stories.length})`, icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {loadingData ? (
        <div className="py-20 text-center text-slate-500">Loading admin metrics and tables...</div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">Total Revenue</span>
                  <div className="font-heading font-extrabold text-3xl text-blue-950">
                    {formatCurrency(stats.stats?.totalRevenue || 0)}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">
                    +{formatCurrency(stats.stats?.revenueThisMonth || 0)} this month
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">Total Reservations</span>
                  <div className="font-heading font-extrabold text-3xl text-slate-900">
                    {stats.stats?.totalBookings || 0}
                  </div>
                  <span className="text-xs text-amber-600 font-semibold">
                    {stats.stats?.pendingBookings || 0} pending confirmation
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">Tour Catalog</span>
                  <div className="font-heading font-extrabold text-3xl text-slate-900">
                    {stats.stats?.totalPackages || 0}
                  </div>
                  <span className="text-xs text-slate-500">
                    {stats.stats?.publishedPackages || 0} active packages
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">Confirmed Tours</span>
                  <div className="font-heading font-extrabold text-3xl text-emerald-600">
                    {stats.stats?.confirmedBookings || 0}
                  </div>
                  <span className="text-xs text-slate-500">Guaranteed departures</span>
                </div>
              </div>

              {/* Top Packages Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <h3 className="font-heading font-bold text-lg text-slate-900">Top Performing Tour Packages</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 font-semibold">
                        <th className="py-3 px-4">Package Title</th>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4">Total Bookings</th>
                        <th className="py-3 px-4">Confirmed Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stats.topPackages || []).map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-800">{p.title}</td>
                          <td className="py-3 px-4 text-slate-600">{p.destination}</td>
                          <td className="py-3 px-4 font-bold text-blue-900">{p.bookings_count}</td>
                          <td className="py-3 px-4 text-emerald-700 font-bold">{formatCurrency(p.confirmed_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
              <h3 className="font-heading font-bold text-lg text-slate-900">Guest Reservations List</h3>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No bookings placed yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 font-semibold">
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Guest</th>
                        <th className="py-3 px-4">Tour / Package</th>
                        <th className="py-3 px-4">Travel Date</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-xs text-blue-900">
                            {b.reference_code || 'UMA-CONF'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{b.full_name}</div>
                            <div className="text-xs text-slate-400">{b.email} • {b.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">
                            {b.tour_packages?.title || 'Custom Tour'}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{formatDate(b.travel_date)}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(b.total_price)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 space-x-2">
                            {b.status !== 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-xl text-slate-900">Catalog Management</h3>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-900 text-white text-xs font-semibold shadow-md hover:bg-blue-800 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Tour Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-amber-700 uppercase">{p.category}</span>
                        <div className="flex items-center gap-1.5">
                          {p.is_featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                              ⭐ Featured
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-heading font-bold text-lg text-slate-900 mt-1">{p.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{p.destination} • {p.duration_days} Days</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900">{formatCurrency(p.price)}</span>
                        <button
                          onClick={() => handleUpdatePackageFeatured(p.id, p.is_featured)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold border transition flex items-center gap-1 ${
                            p.is_featured
                              ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {p.is_featured ? '⭐ Unstar' : '⭐ Make Featured'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleUpdatePackageStatus(p.id, p.status)}
                          className={`flex-1 py-1.5 rounded text-xs font-semibold transition text-center ${
                            p.status === 'published'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {p.status === 'published' ? 'Unpublish to Draft' : 'Publish Now'}
                        </button>
                        <button
                          onClick={() => openEditPackageModal(p)}
                          className="text-[#0E545A] hover:text-[#0B5E63] p-1.5 rounded-lg hover:bg-[#0E545A]/10 transition flex items-center gap-1 text-xs font-bold"
                          title="Edit Photos & Package Details"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Photos & Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePackage(p.id)}
                          className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-xl text-slate-900">Travel Chronicles</h3>
                <button
                  onClick={() => setShowStoryModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-900 text-white text-xs font-semibold shadow-md hover:bg-blue-800 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Story</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 block">By {s.author_name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {s.is_published ? 'published' : 'draft'}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-lg text-slate-900 mt-1 line-clamp-1">{s.title}</h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{s.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleUpdateStoryStatus(s.id, s.is_published)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          s.is_published
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {s.is_published ? 'Unpublish' : 'Publish Now'}
                      </button>
                      <button
                        onClick={() => handleDeleteStory(s.id)}
                        className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Delete Story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE PACKAGE MODAL */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-slate-900">Create New Tour Package</h3>
            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={newPkgDest}
                    onChange={(e) => setNewPkgDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Days *</label>
                  <input
                    type="number"
                    required
                    value={newPkgDays}
                    onChange={(e) => setNewPkgDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nights *</label>
                  <input
                    type="number"
                    required
                    value={newPkgNights}
                    onChange={(e) => setNewPkgNights(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newPkgCategory}
                    onChange={(e) => setNewPkgCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  >
                    {['Adventure', 'Honeymoon', 'Cultural', 'Wildlife', 'Luxury Escape'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>

              {/* MULTIPLE IMAGES UPLOAD ZONE */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Package Photos & Gallery (Multiple)
                  </label>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    First photo = Cover Image
                  </span>
                </div>

                {/* File Dropzone / Selector */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-[#0E545A] transition-colors bg-slate-50/70">
                  <input
                    type="file"
                    id="create-package-images"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const fileArray = Array.from(e.target.files);
                        setNewPkgImages((prev) => [...prev, ...fileArray]);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="create-package-images"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0E545A]/10 text-[#0E545A] flex items-center justify-center font-bold text-lg shadow-sm">
                      +
                    </div>
                    <span className="text-sm font-bold text-[#0E545A] hover:underline">
                      Click to Select Multiple Photos
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Select multiple files or hold Ctrl/Cmd to choose several photos
                    </span>
                  </label>
                </div>

                {/* Selected Previews Grid */}
                {newPkgImages.length > 0 && (
                  <div className="space-y-2 bg-slate-100 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Selected Photos ({newPkgImages.length})</span>
                      <button
                        type="button"
                        onClick={() => setNewPkgImages([])}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {newPkgImages.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 aspect-video group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-[#ECA815] text-[#0E545A] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setNewPkgImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paste URLs (Optional) */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Or Paste Direct Image URLs (Optional — One URL per line)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="https://images.unsplash.com/photo-1..."
                    value={newPkgImageUrls}
                    onChange={(e) => setNewPkgImageUrls(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isSubmittingPackage}
                  onClick={() => setShowPackageModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPackage}
                  className="px-6 py-2.5 rounded-xl bg-[#0E545A] text-white text-xs font-bold shadow-md hover:bg-[#0B5E63] disabled:opacity-50 transition"
                >
                  {isSubmittingPackage ? 'Saving Package...' : 'Save Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE & PHOTOS MODAL */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">Edit Tour Package & Gallery</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage details and photos for {editingPkg.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdatePackageDetails} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={editPkgTitle}
                  onChange={(e) => setEditPkgTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={editPkgDest}
                    onChange={(e) => setEditPkgDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={editPkgPrice}
                    onChange={(e) => setEditPkgPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Days *</label>
                  <input
                    type="number"
                    required
                    value={editPkgDays}
                    onChange={(e) => setEditPkgDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nights *</label>
                  <input
                    type="number"
                    required
                    value={editPkgNights}
                    onChange={(e) => setEditPkgNights(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={editPkgCategory}
                    onChange={(e) => setEditPkgCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  >
                    {['Adventure', 'Honeymoon', 'Cultural', 'Wildlife', 'Luxury Escape'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={editPkgDesc}
                  onChange={(e) => setEditPkgDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>

              {/* EXISTING PHOTOS GALLERY AND REMOVAL */}
              {editingPkg.package_images && editingPkg.package_images.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Existing Package Photos ({editingPkg.package_images.filter(img => !editRemoveImageIds.includes(img.id)).length} Active)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-100 p-3 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
                    {editingPkg.package_images.map((img) => {
                      const isRemoved = editRemoveImageIds.includes(img.id);
                      return (
                        <div
                          key={img.id}
                          className={`relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 aspect-video transition ${
                            isRemoved ? 'opacity-30 grayscale border-red-500' : ''
                          }`}
                        >
                          <img
                            src={img.image_url}
                            alt="Package view"
                            className="w-full h-full object-cover"
                          />
                          {img.is_cover && !isRemoved && (
                            <span className="absolute bottom-1 left-1 bg-[#ECA815] text-[#0E545A] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          )}
                          {isRemoved ? (
                            <button
                              type="button"
                              onClick={() => setEditRemoveImageIds((prev) => prev.filter((id) => id !== img.id))}
                              className="absolute inset-0 bg-red-900/60 text-white flex flex-col items-center justify-center text-[11px] font-bold"
                            >
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditRemoveImageIds((prev) => [...prev, img.id])}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                              title="Delete this photo"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ADD MORE PHOTOS SECTION */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0E545A] block">
                  + Upload More Photos to Gallery
                </label>

                <div className="border-2 border-dashed border-[#0E545A]/30 rounded-2xl p-4 text-center hover:border-[#0E545A] transition-colors bg-teal-50/30">
                  <input
                    type="file"
                    id="edit-package-images"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const fileArray = Array.from(e.target.files);
                        setEditPkgImages((prev) => [...prev, ...fileArray]);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-package-images"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0E545A]/10 text-[#0E545A] flex items-center justify-center font-bold text-lg shadow-sm">
                      +
                    </div>
                    <span className="text-sm font-bold text-[#0E545A] hover:underline">
                      Select Additional Photos
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Select multiple photo files to append to this package
                    </span>
                  </label>
                </div>

                {/* New Previews Grid */}
                {editPkgImages.length > 0 && (
                  <div className="space-y-2 bg-teal-50/50 p-3 rounded-2xl border border-teal-200">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0E545A]">
                      <span>New Photos to Add ({editPkgImages.length})</span>
                      <button
                        type="button"
                        onClick={() => setEditPkgImages([])}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Clear New Photos
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {editPkgImages.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 aspect-video group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditPkgImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                            title="Remove new photo"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Or Paste Additional Image URLs (One URL per line)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="https://images.unsplash.com/photo-1..."
                    value={editPkgImageUrls}
                    onChange={(e) => setEditPkgImageUrls(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isSubmittingEditPackage}
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEditPackage}
                  className="px-6 py-2.5 rounded-xl bg-[#0E545A] text-white text-xs font-bold shadow-md hover:bg-[#0B5E63] disabled:opacity-50 transition"
                >
                  {isSubmittingEditPackage ? 'Saving Changes...' : 'Save Changes & Photos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE STORY MODAL */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-slate-900">Publish New Travel Story</h3>
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Story Title *</label>
                <input
                  type="text"
                  required
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={newStoryAuthor}
                  onChange={(e) => setNewStoryAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Content *</label>
                <textarea
                  rows="6"
                  required
                  value={newStoryContent}
                  onChange={(e) => setNewStoryContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Cover Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewStoryImage(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  disabled={isSubmittingStory}
                  onClick={() => setShowStoryModal(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStory}
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white text-xs font-semibold shadow-md hover:bg-blue-800 disabled:opacity-50"
                >
                  {isSubmittingStory ? 'Publishing Story...' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
