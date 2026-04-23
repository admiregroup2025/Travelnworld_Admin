import React, { useState, useEffect } from 'react';
import { HiGlobeAlt, HiLocationMarker, HiPhotograph, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';
import axios from 'axios';

/* ─── Global Styles ──────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after {
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-sizing: border-box;
    }

    .cd-fade-in  { animation: cdFadeUp .35s ease both; }
    .cd-row:hover { background: #fff5f5 !important; }

    @keyframes cdFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }

    .cd-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1.5px solid #e5e7eb;
      background: #fafafa;
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      outline: none;
      transition: border-color .15s, box-shadow .15s;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .cd-input::placeholder { color: #9ca3af; font-weight: 400; }
    .cd-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,.12);
    }

    .cd-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .3px;
      text-transform: capitalize;
    }
  `}</style>
);

/* ─── Category badge colours ─────────────────────────────────────────────── */
const CAT_COLORS = {
  trending:  { bg:'#fff7ed', color:'#c2410c' },
  exclusive: { bg:'#f0fdf4', color:'#15803d' },
  weekend:   { bg:'#eff6ff', color:'#1d4ed8' },
  home:      { bg:'#fdf4ff', color:'#7e22ce' },
  honeymoon: { bg:'#fff1f2', color:'#be123c' },
};

/* ─── Small reusable pieces ──────────────────────────────────────────────── */
const FieldLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{children}</p>
);

const Alert = ({ type, msg, onClose }) => {
  const s = type === 'error'
    ? { bg:'#fff1f2', border:'#fecdd3', color:'#be123c' }
    : { bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d' };
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-4"
      style={{ background: s.bg, border:`1px solid ${s.border}`, color: s.color }}>
      <span>{type === 'error' ? '⚠' : '✓'}</span>
      <span className="flex-1">{msg}</span>
      {onClose && <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg leading-none">×</button>}
    </div>
  );
};

/* ─── Custom Checkbox ────────────────────────────────────────────────────── */
const RedCheck = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <span
      className="flex-shrink-0 flex items-center justify-center rounded-md border-2 transition-all"
      style={{
        width: 18, height: 18,
        borderColor: checked ? '#ef4444' : '#d1d5db',
        background:  checked ? '#ef4444' : 'white',
      }}
      onClick={onChange}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
    <span className="text-sm font-medium capitalize" style={{ color: checked ? '#dc2626' : '#374151' }}>
      {label}
    </span>
  </label>
);

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm flex flex-col gap-1">
    <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
    <span className="text-3xl font-extrabold text-gray-900">{value}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
const CreateDestination = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  /* form state */
  const [destinationType, setDestinationType] = useState('Domestic');
  const [destinationName, setDestinationName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categories, setCategories] = useState({
    trending: false, exclusive: false, weekend: false, home: false, honeymoon: false,
  });
  const [coverImageFile, setCoverImageFile] = useState(null);

  /* list state — "destinations" is the currently-visible filtered list */
  const [destinations, setDestinations]       = useState([]);
  /* allDestinations holds BOTH domestic + international for accurate stats */
  const [allDestinations, setAllDestinations] = useState([]);

  /* ui state */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  /* modal state */
  const [isEditModalOpen,    setIsEditModalOpen]    = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);

  /* ── on mount: fetch all once for stats ──────────────────────────────── */
  useEffect(() => { fetchAll(); }, []);
  /* re-fetch filtered list whenever tab changes */
  useEffect(() => { fetchFiltered(); }, [destinationType]);

  /* fetch only the current-tab destinations (shown in table) */
  const fetchFiltered = async () => {
    try {
      setLoading(true);
      const type = destinationType.toLowerCase(); // 'domestic' | 'international'
      const res  = await axios.get(`${API_BASE}/api/destinations/type/${type}`);
      setDestinations(res.data.data || []);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) { redirectLogin(); return; }
      setError('Failed to load destinations');
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  /* fetch both domestic + international so stat cards are always accurate */
  const fetchAll = async () => {
    try {
      const [domRes, intRes] = await Promise.all([
        axios.get(`${API_BASE}/api/destinations/type/domestic`),
        axios.get(`${API_BASE}/api/destinations/type/international`),
      ]);
      setAllDestinations([
        ...(domRes.data.data || []),
        ...(intRes.data.data || []),
      ]);
    } catch (_) { /* stats are best-effort */ }
  };

  const redirectLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('twz_auth_token');
    window.location.href = '/login';
  };

  /* ── auth token helper ──────────────────────────────────────────────── */
  const getAuthToken = () => {
    let token = localStorage.getItem('token') || localStorage.getItem('twz_auth_token');
    if (token) token = token.replace(/^["']|["']$/g, '');
    if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      localStorage.removeItem('twz_auth_token');
      return null;
    }
    return token;
  };

  /* ── handlers ───────────────────────────────────────────────────────── */
  const handleCategoryChange = (cat) =>
    setCategories(p => ({ ...p, [cat]: !p[cat] }));

  const clearForm = () => {
    setDestinationName('');
    setShortDescription('');
    setCoverImageFile(null);
    setCategories({ trending:false, exclusive:false, weekend:false, home:false, honeymoon:false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!destinationName.trim()) { setError('Destination name is required'); return; }
    try {
      setLoading(true); setError('');
      const token = getAuthToken();
      if (!token) { setError('Authentication token not found. Please log in again.'); return; }

      const fd = new FormData();
      fd.append('name', destinationName.trim());
      fd.append('type', destinationType.toLowerCase());
      fd.append('shortDescription', shortDescription);
      fd.append('categories', JSON.stringify(categories));
      if (coverImageFile) fd.append('coverImage', coverImageFile);

      await axios.post(`${API_BASE}/api/destinations`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Destination created successfully!');
      clearForm();
      await Promise.all([fetchFiltered(), fetchAll()]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) { redirectLogin(); return; }
      setError(err.response?.data?.message || 'Failed to create destination');
    } finally { setLoading(false); }
  };

  const handleEdit = (dest) => {
    setEditingDestination({ ...dest });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError('');
      const token = getAuthToken();
      if (!token) { setError('Please log in again.'); return; }

      const fd = new FormData();
      fd.append('name', editingDestination.name);
      fd.append('type', editingDestination.type?.toLowerCase() || 'domestic');
      fd.append('shortDescription', editingDestination.shortDescription || '');
      fd.append('categories', JSON.stringify(editingDestination.categories || {}));
      if (editingDestination.newCoverImageFile)
        fd.append('coverImage', editingDestination.newCoverImageFile);
      else if (editingDestination.coverImageUrl)
        fd.append('coverImageUrl', editingDestination.coverImageUrl);

      await axios.put(`${API_BASE}/api/destinations/${editingDestination._id}`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Destination updated successfully!');
      setIsEditModalOpen(false);
      setEditingDestination(null);
      await Promise.all([fetchFiltered(), fetchAll()]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) { redirectLogin(); return; }
      setError(err.response?.data?.message || 'Failed to update destination');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      setLoading(true); setError('');
      const token = getAuthToken();
      if (!token) { setError('Please log in again.'); return; }

      await axios.delete(`${API_BASE}/api/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Destination deleted successfully!');
      await Promise.all([fetchFiltered(), fetchAll()]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) { redirectLogin(); return; }
      setError(err.response?.data?.message || 'Failed to delete destination');
    } finally { setLoading(false); }
  };

  /* ── derived counts — always from allDestinations ─────────────────── */
  const domCount   = allDestinations.filter(d => d.type?.toLowerCase() === 'domestic').length;
  const intCount   = allDestinations.filter(d => d.type?.toLowerCase() === 'international').length;
  const totalCount = allDestinations.length;

  const activeCatCount = Object.values(categories).filter(Boolean).length;

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <GlobalStyle />
      <div className="min-h-screen cd-fade-in" style={{ background: '#f4f4f5' }}>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e0a0a 0%,#7f1d1d 50%,#b91c1c 100%)' }}
        >
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(255,255,255,.06),transparent)' }} />
          <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(255,255,255,.04),transparent)' }} />

          <div className="relative max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
            <div>
              <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-1">
                Destination Manager
              </p>
              <h1 className="text-white text-3xl font-extrabold leading-tight">
                Create Destination
              </h1>
              <p className="text-red-200/70 text-sm mt-0.5">
                Add and manage travel locations across your platform
              </p>
            </div>
            <ProfileButton />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-7">

          {/* ── STAT CARDS ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total"         value={totalCount} color="#6b7280" />
            <StatCard label="Domestic"      value={domCount}   color="#2563eb" />
            <StatCard label="International" value={intCount}   color="#d97706" />
            <StatCard label="Active"        value={totalCount} color="#16a34a" />
          </div>

          {/* ── ALERTS ──────────────────────────────────────────────────── */}
          {error   && <Alert type="error"   msg={error}   onClose={() => setError('')} />}
          {success && <Alert type="success" msg={success} />}

          {/* ── MAIN GRID ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <aside className="lg:col-span-4">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm sticky top-6">
                <div className="px-6 py-5"
                  style={{ background:'linear-gradient(135deg,#7f1d1d,#dc2626)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background:'rgba(255,255,255,.15)' }}>
                    <HiGlobeAlt className="text-white text-xl" />
                  </div>
                  <h2 className="text-white font-bold text-base">Destination Details</h2>
                  <p className="text-red-100/80 text-xs mt-1 leading-relaxed">
                    High-quality visuals and accurate categories improve discoverability.
                  </p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {[
                    { icon:'📐', tip:'Use 1200×800 px images' },
                    { icon:'✏️', tip:'Keep descriptions under 120 chars' },
                    { icon:'🏷️', tip:'Select all relevant categories' },
                    { icon:'🌐', tip:'Separate domestic & international' },
                  ].map(({ icon, tip }) => (
                    <div key={tip} className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <p className="text-sm text-gray-500">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── FORM ────────────────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-6">New Destination</h2>

                <form onSubmit={handleSave} className="space-y-5">

                  {/* Destination Type */}
                  <div>
                    <FieldLabel>Destination Type</FieldLabel>
                    <div className="flex gap-2 p-1 rounded-xl w-fit bg-gray-100">
                      {['Domestic','International'].map(t => (
                        <button
                          key={t} type="button"
                          onClick={() => setDestinationType(t)}
                          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                          style={{
                            background: destinationType === t ? 'white'       : 'transparent',
                            color:      destinationType === t ? '#dc2626'     : '#9ca3af',
                            boxShadow:  destinationType === t ? '0 1px 6px rgba(0,0,0,.1)' : 'none',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Name */}
                  <div>
                    <FieldLabel>Destination Name *</FieldLabel>
                    <div className="relative">
                      <HiLocationMarker className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                      <input
                        type="text"
                        className="cd-input"
                        style={{ paddingLeft: 38 }}
                        placeholder="e.g. Goa, Paris, Bali…"
                        value={destinationName}
                        onChange={e => setDestinationName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <FieldLabel>Short Description</FieldLabel>
                    <input
                      type="text"
                      className="cd-input"
                      placeholder="A one-liner for listing cards…"
                      value={shortDescription}
                      onChange={e => setShortDescription(e.target.value)}
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <FieldLabel>Cover Image</FieldLabel>
                    <label
                      htmlFor="cover-file"
                      className="flex flex-col items-center justify-center w-full py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                      style={{
                        borderColor: coverImageFile ? '#ef4444' : '#d1d5db',
                        background:  coverImageFile ? '#fff5f5' : '#fafafa',
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all"
                        style={{ background: coverImageFile ? '#fee2e2' : '#f3f4f6' }}
                      >
                        <HiPhotograph className="text-xl" style={{ color: coverImageFile ? '#dc2626' : '#9ca3af' }} />
                      </div>
                      {coverImageFile ? (
                        <p className="text-sm font-semibold text-red-600">{coverImageFile.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-red-600">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Recommended 1200×800</p>
                        </>
                      )}
                      <input id="cover-file" type="file" accept="image/*" className="hidden"
                        onChange={e => setCoverImageFile(e.target.files[0])} />
                    </label>
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <FieldLabel>Categories</FieldLabel>
                      {activeCatCount > 0 && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600">
                          {activeCatCount} selected
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      {Object.keys(categories).map(cat => (
                        <RedCheck
                          key={cat} label={cat}
                          checked={categories[cat]}
                          onChange={() => handleCategoryChange(cat)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                    style={{
                      background: loading
                        ? '#d1d5db'
                        : 'linear-gradient(135deg,#991b1b,#ef4444)',
                      boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,.35)',
                    }}
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <HiPlus className="text-lg" />
                    }
                    {loading ? 'Saving…' : 'Save Destination'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── DESTINATION TABLE ───────────────────────────────────────── */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 bg-gray-50/60">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {destinationType} Destinations
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {/* Show count for the currently-visible tab */}
                  {destinations.length} {destinations.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
              <div className="flex gap-2">
                {['Domestic','International'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setDestinationType(t)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: destinationType === t ? '#dc2626' : '#f3f4f6',
                      color:      destinationType === t ? 'white'   : '#6b7280',
                    }}
                  >
                    {t}
                    {/* show count per tab from allDestinations */}
                    <span className="ml-1 opacity-70">
                      ({t === 'Domestic' ? domCount : intCount})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {loading && destinations.length === 0 ? (
              <div className="py-14 text-center text-sm text-gray-400">Loading…</div>
            ) : destinations.length === 0 ? (
              <div className="py-14 text-center text-sm text-gray-400 italic">
                No {destinationType.toLowerCase()} destinations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Destination','Categories','Actions'].map((h,i) => (
                        <th
                          key={h}
                          className={`px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-400 text-left${i===2?' text-right':''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {destinations.map((dest) => (
                      <tr key={dest._id} className="cd-row transition-colors">
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background:'linear-gradient(135deg,#991b1b,#ef4444)' }}
                            >
                              {dest.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{dest.name}</p>
                              <p className="text-xs text-gray-400 capitalize">{dest.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-7 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(dest.categories || {})
                              .filter(([,v]) => v)
                              .map(([k]) => (
                                <span key={k} className="cd-badge"
                                  style={{
                                    background: CAT_COLORS[k]?.bg || '#f3f4f6',
                                    color:      CAT_COLORS[k]?.color || '#6b7280',
                                  }}>
                                  {k}
                                </span>
                              ))}
                            {!Object.values(dest.categories||{}).some(Boolean) && (
                              <span className="text-gray-300 text-xs italic">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-7 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(dest)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                              style={{ background:'#eff6ff', color:'#2563eb' }}
                              onMouseEnter={e => e.currentTarget.style.background='#dbeafe'}
                              onMouseLeave={e => e.currentTarget.style.background='#eff6ff'}
                              title="Edit"
                            >
                              <HiPencil />
                            </button>
                            <button
                              onClick={() => handleDelete(dest._id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                              style={{ background:'#fff1f2', color:'#e11d48' }}
                              onMouseEnter={e => e.currentTarget.style.background='#ffe4e6'}
                              onMouseLeave={e => e.currentTarget.style.background='#fff1f2'}
                              title="Delete"
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>{/* /max-w container */}
      </div>{/* /page */}

      {/* ── EDIT MODAL ────────────────────────────────────────────────────── */}
      {isEditModalOpen && editingDestination && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto cd-fade-in">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Edit Destination</h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setError(''); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="px-6 py-6 space-y-5">
              {error   && <Alert type="error"   msg={error}   onClose={() => setError('')} />}
              {success && <Alert type="success" msg={success} />}

              <div>
                <FieldLabel>Destination Type</FieldLabel>
                <select
                  value={editingDestination.type || 'domestic'}
                  onChange={e => setEditingDestination({ ...editingDestination, type: e.target.value })}
                  className="cd-input"
                >
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <FieldLabel>Destination Name</FieldLabel>
                <input
                  type="text"
                  className="cd-input"
                  value={editingDestination.name || ''}
                  onChange={e => setEditingDestination({ ...editingDestination, name: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel>Short Description</FieldLabel>
                <input
                  type="text"
                  className="cd-input"
                  value={editingDestination.shortDescription || ''}
                  onChange={e => setEditingDestination({ ...editingDestination, shortDescription: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel>Cover Image</FieldLabel>
                <label
                  htmlFor="edit-cover-file"
                  className="flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                  style={{ borderColor:'#d1d5db', background:'#fafafa' }}
                >
                  <HiPhotograph className="text-2xl text-gray-300 mb-1" />
                  <p className="text-sm text-gray-500">
                    {editingDestination.newCoverImageFile
                      ? <span className="text-red-600 font-semibold">{editingDestination.newCoverImageFile.name}</span>
                      : <><span className="text-red-600 font-semibold">Click to upload</span> new image</>
                    }
                  </p>
                  <input id="edit-cover-file" type="file" accept="image/*" className="hidden"
                    onChange={e => setEditingDestination({ ...editingDestination, newCoverImageFile: e.target.files[0] })} />
                </label>
                {editingDestination.coverImageUrl && !editingDestination.newCoverImageFile && (
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <img src={editingDestination.coverImageUrl} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                    <p className="text-xs text-gray-400 truncate flex-1">
                      Current: {editingDestination.coverImageUrl}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Categories</FieldLabel>
                <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  {['trending','exclusive','weekend','home','honeymoon'].map(cat => (
                    <RedCheck
                      key={cat} label={cat}
                      checked={editingDestination.categories?.[cat] || false}
                      onChange={() => setEditingDestination({
                        ...editingDestination,
                        categories: {
                          ...editingDestination.categories,
                          [cat]: !editingDestination.categories?.[cat],
                        },
                      })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: loading
                      ? '#d1d5db'
                      : 'linear-gradient(135deg,#991b1b,#ef4444)',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,.3)',
                  }}
                >
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateDestination;