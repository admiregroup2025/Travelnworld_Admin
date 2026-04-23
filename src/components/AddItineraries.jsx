import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  HiOutlineViewBoards, HiOutlineGlobe, HiOutlineLocationMarker,
  HiOutlineCalendar, HiOutlineTag, HiOutlinePhotograph, HiOutlineMap,
  HiOutlinePlus, HiOutlineDocumentText, HiOutlineCreditCard,
  HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineBan,
  HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineEye,
  HiOutlineTrash, HiChevronDown, HiChevronUp, HiGlobeAlt,
} from "react-icons/hi";
import ProfileButton from "../components/ProfileButton";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const DURATION_OPTIONS = [
  "1 Night / 2 Days", "2 Nights / 3 Days", "3 Nights / 4 Days",
  "4 Nights / 5 Days", "5 Nights / 6 Days", "6 Nights / 7 Days",
  "7 Nights / 8 Days", "10 Nights / 11 Days", "14 Nights / 15 Days",
];
const THEMES = [
  "Family", "Honeymoon", "Adventures", "Solo", "Wildlife", "Beach",
  "Pilgrimage", "Hill Station", "Heritage Tour", "Ayurveda Tour",
  "Cultural Tour", "Luxury Tour", "Budget Tour", "Family Tour",
  "Bachelor Tour", "Women Group", "Special Interest",
];
const CLASSIFICATIONS = ["Trending", "Exclusive", "Weekend", "Top Selling"];
const TYPE_OPTIONS    = ["Flexible", "Fixed", "Group", "Customizable"];
const VISIBILITY_OPTIONS = ["Public", "Private", "Draft"];
const DEFAULT_CANCELLATION = `◆ Airfare/Train fare cancellation applied original booking refund policy
◆ Before 30 days of cancellation: 100% refund of total booking amount
◆ Between 15-30 days: 50% refund of total booking amount
◆ Between 7-15 days: 25% refund of total booking amount
◆ Less than 7 days: No refund`;

/* ─── Global Styles ──────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after {
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-sizing: border-box;
    }

    .ai-fade-in { animation: aiFadeUp .35s ease both; }

    @keyframes aiFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }

    .ai-input {
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
    .ai-input::placeholder { color: #9ca3af; font-weight: 400; }
    .ai-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,.12);
    }

    .ai-section {
      background: white;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
      overflow: hidden;
      transition: box-shadow .2s;
    }
    .ai-section:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }

    .ai-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 28px;
      border-bottom: 1px solid #f3f4f6;
      background: #fafafa;
    }

    .ai-day-card { animation: aiFadeUp .25s ease both; }

    .ai-progress-bar {
      height: 4px;
      border-radius: 999px;
      background: rgba(255,255,255,.15);
      overflow: hidden;
    }
    .ai-progress-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #fca5a5, #f87171);
      transition: width .5s ease;
    }
  `}</style>
);

/* ─── Small reusable pieces ──────────────────────────────────────────────── */
const FieldLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-1.5 mb-2">
    {Icon && <Icon style={{ color: "#9ca3af", fontSize: 14 }} />}
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", margin: 0 }}>
      {children}
    </p>
  </div>
);

const Alert = ({ type, msg, onClose }) => {
  const s = type === "error"
    ? { bg: "#fff1f2", border: "#fecdd3", color: "#be123c" }
    : { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500, marginBottom: 16, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span>{type === "error" ? "⚠" : "✓"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      {onClose && <button onClick={onClose} style={{ opacity: 0.5, fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer", color: "inherit" }}>×</button>}
    </div>
  );
};

/* ─── Pill Toggle ────────────────────────────────────────────────────────── */
const PillToggle = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 6, padding: 4, borderRadius: 12, background: "#f3f4f6", width: "fit-content" }}>
    {options.map(opt => (
      <button
        key={opt} type="button"
        onClick={() => onChange(opt)}
        style={{
          padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          border: "none", cursor: "pointer", transition: "all .15s",
          background: value === opt ? "white" : "transparent",
          color:      value === opt ? "#dc2626" : "#9ca3af",
          boxShadow:  value === opt ? "0 1px 6px rgba(0,0,0,.1)" : "none",
        }}
      >
        {opt}
      </button>
    ))}
  </div>
);

/* ─── Tag Checkbox ───────────────────────────────────────────────────────── */
const RedCheck = ({ label, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
    <span
      onClick={onChange}
      style={{
        width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? "#ef4444" : "#d1d5db"}`,
        background: checked ? "#ef4444" : "white", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, transition: "all .15s",
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span style={{ fontSize: 13, fontWeight: 500, color: checked ? "#dc2626" : "#374151", textTransform: "capitalize" }}>
      {label}
    </span>
  </label>
);

/* ─── Section Card ───────────────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, step, children, collapsible = false }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="ai-section">
      <div
        className="ai-section-header"
        style={{ cursor: collapsible ? "pointer" : "default" }}
        onClick={() => collapsible && setOpen(o => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {step && (
            <span style={{
              width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0,
              background: "linear-gradient(135deg,#991b1b,#ef4444)", color: "white",
            }}>
              {step}
            </span>
          )}
          {Icon && <Icon style={{ color: "#6b7280", fontSize: 18 }} />}
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{title}</h2>
        </div>
        {collapsible && (
          <span style={{ color: "#9ca3af", fontSize: 18 }}>
            {open ? <HiChevronUp /> : <HiChevronDown />}
          </span>
        )}
      </div>
      {(!collapsible || open) && (
        <div style={{ padding: "24px 28px" }}>{children}</div>
      )}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, color }) => (
  <div style={{ background: "white", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
    <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color }}>{label}</p>
    <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#111827" }}>{value}</p>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
const AddItineraries = ({ onSubmit }) => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  /* ── destinations fetched from API ───────────────────────────────────── */
  const [domesticDestinations,       setDomesticDestinations]       = useState([]);
  const [internationalDestinations,  setInternationalDestinations]  = useState([]);
  const [destinationsLoading,        setDestinationsLoading]        = useState(false);
  const [destinationsError,          setDestinationsError]          = useState("");

  /* ── form state ──────────────────────────────────────────────────────── */
  const [title,              setTitle]              = useState("");
  const [travelType,         setTravelType]         = useState("Domestic");
  const [destination,        setDestination]        = useState("");
  const [duration,           setDuration]           = useState("");
  const [themes,             setThemes]             = useState([]);
  const [classification,     setClassification]     = useState([]);
  const [packageType,        setPackageType]        = useState("Flexible");
  const [visibility,         setVisibility]         = useState("Public");
  const [destinationDetail,  setDestinationDetail]  = useState("");
  const [selectedMedia,      setSelectedMedia]      = useState([]);
  const [days,               setDays]               = useState([]);
  const [dayForm,            setDayForm]            = useState({ title: "", day: 1, locationDetail: "" });
  const [inclusions,         setInclusions]         = useState("");
  const [exclusions,         setExclusions]         = useState("");
  const [asPerCategory,      setAsPerCategory]      = useState(false);
  const [asBestQuote,        setAsBestQuote]        = useState(false);
  const [standardPrice,      setStandardPrice]      = useState("");
  const [discountedPrice,    setDiscountedPrice]    = useState("");
  const [termsConditions,    setTermsConditions]    = useState("");
  const [paymentMode,        setPaymentMode]        = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState(DEFAULT_CANCELLATION);

  /* ── ui state ────────────────────────────────────────────────────────── */
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError,   setSubmitError]   = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  /* ── auth helper ─────────────────────────────────────────────────────── */
  const getAuthToken = useCallback(() => {
    let token = localStorage.getItem("token") || localStorage.getItem("twz_auth_token");
    if (token) token = token.replace(/^["']|["']$/g, "");
    if (!token || token === "undefined" || token === "null" || token.split(".").length !== 3) {
      localStorage.removeItem("token");
      localStorage.removeItem("twz_auth_token");
      return null;
    }
    return token;
  }, []);

  const redirectLogin = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("twz_auth_token");
    window.location.href = "/login";
  }, []);

  /* ── fetch destinations from API ─────────────────────────────────────── */
  const fetchDestinations = useCallback(async () => {
    try {
      setDestinationsLoading(true);
      setDestinationsError("");

      const token = getAuthToken();
      if (!token) { redirectLogin(); return; }

      const headers = { Authorization: `Bearer ${token}` };

      const [domRes, intRes] = await Promise.all([
        axios.get(`${API_BASE}/api/destinations/type/domestic`,      { headers }),
        axios.get(`${API_BASE}/api/destinations/type/international`, { headers }),
      ]);

      setDomesticDestinations(domRes.data.data      || []);
      setInternationalDestinations(intRes.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) { redirectLogin(); return; }
      setDestinationsError("Could not load destinations. Please refresh.");
    } finally {
      setDestinationsLoading(false);
    }
  }, [API_BASE, getAuthToken, redirectLogin]);

  useEffect(() => { fetchDestinations(); }, [fetchDestinations]);

  /* Reset destination selection when travel type changes */
  const handleTravelTypeChange = (type) => {
    setTravelType(type);
    setDestination("");
  };

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const toggle = (setter, arr, val) =>
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedMedia(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleAddDay = () => {
    if (!dayForm.title.trim()) return;
    setDays(prev => [...prev, { id: Date.now(), ...dayForm }]);
    setDayForm(prev => ({ title: "", day: prev.day + 1, locationDetail: "" }));
  };

  const handleDeleteDay = (id) => setDays(prev => prev.filter(d => d.id !== id));

  /**
   * Submit the itinerary form to the backend API.
   * Maps AddItineraries form fields to the Itinerary model and POSTs to
   * /api/itineraries with the admin auth token.
   */
  const handleSubmit = async () => {
    /* ── Client-side validation ─────────────────────────────────────────── */
    if (!title.trim())  { setSubmitError("Itinerary title is required.");  return; }
    if (!destination)   { setSubmitError("Please select a destination."); return; }
    if (!duration)      { setSubmitError("Please select a duration.");    return; }

    /* ── Read and validate auth token ───────────────────────────────────── */
    let token = localStorage.getItem("token") || localStorage.getItem("twz_auth_token");
    if (token) token = token.replace(/^["']|["']$/g, "");
    if (!token || token === "undefined" || token === "null" || token.split(".").length !== 3) {
      localStorage.removeItem("token");
      localStorage.removeItem("twz_auth_token");
      setSubmitError("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    /* ── Build payload matching mapPayloadToModel in the controller ─────── */
    const payload = {
      title:             title.trim(),
      travelType,                          // "Domestic" | "International"
      destination,                         // destination name e.g. "Goa"
      duration,                            // e.g. "3 Nights / 4 Days"
      themes,                              // string[]
      classification,                      // string[] e.g. ["Trending"]
      packageType,
      visibility,
      destinationDetail,
      mediaUrls: selectedMedia,
      // eslint-disable-next-line no-unused-vars
      days: days.map(({ id: _id, ...rest }) => rest), // strip local-only `id`
      inclusions,                          // controller handles string → array
      exclusions,
      asPerCategory,
      asBestQuote,
      standardPrice:    asBestQuote ? 0 : Number(standardPrice)    || 0,
      discountedPrice:  asBestQuote ? 0 : Number(discountedPrice)  || 0,
      termsConditions,
      paymentMode,
      cancellationPolicy,
    };

    try {
      setSubmitLoading(true);
      setSubmitError("");

      const response = await axios.post(`${API_BASE}/api/itineraries`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      /* ── Success: allow parent to react if needed, then show message ──── */
      if (onSubmit) onSubmit(response.data.data);

      setSubmitSuccess("Itinerary created successfully! It is now live.");
      // Reset form fields
      setTitle(""); setDestination(""); setDuration(""); setThemes([]);
      setClassification([]); setPackageType("Flexible"); setVisibility("Public");
      setDestinationDetail(""); setSelectedMedia([]); setDays([]);
      setDayForm({ title: "", day: 1, locationDetail: "" });
      setInclusions(""); setExclusions(""); setAsPerCategory(false);
      setAsBestQuote(false); setStandardPrice(""); setDiscountedPrice("");
      setTermsConditions(""); setPaymentMode(""); setCancellationPolicy(DEFAULT_CANCELLATION);

      setTimeout(() => setSubmitSuccess(""), 4000);
    } catch (err) {
      // Handle 401 Unauthorized
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("twz_auth_token");
        setSubmitError("Session expired. Please log in again.");
        window.location.href = "/login";
        return;
      }
      setSubmitError(err.response?.data?.message || err.message || "Failed to create itinerary.");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ── derived ─────────────────────────────────────────────────────────── */
  const activeDestinations = travelType === "Domestic"
    ? domesticDestinations
    : internationalDestinations;

  const completedSections = [
    !!title && !!destination && !!duration,
    !!destinationDetail,
    days.length > 0,
    !!inclusions,
    asBestQuote || !!standardPrice,
  ].filter(Boolean).length;

  const savingPct = standardPrice && discountedPrice && Number(discountedPrice) < Number(standardPrice)
    ? Math.round((1 - discountedPrice / standardPrice) * 100)
    : 0;

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <GlobalStyle />
      <div className="ai-fade-in" style={{ minHeight: "100vh", background: "#f4f4f5" }}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg,#1e0a0a 0%,#7f1d1d 50%,#b91c1c 100%)",
        }}>
          {/* decorative orbs */}
          <div style={{ position: "absolute", top: -48, right: -48, width: 288, height: 288, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.06),transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0,  left: 40,  width: 192, height: 192, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.04),transparent)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 896, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
                Itinerary Builder
              </p>
              <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, lineHeight: 1.2, margin: "0 0 4px" }}>
                Create New Itinerary
              </h1>
              <p style={{ color: "rgba(252,165,165,.7)", fontSize: 13, margin: 0 }}>
                Design a complete travel package with all details
              </p>
              {/* progress */}
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, maxWidth: 360 }}>
                <div className="ai-progress-bar" style={{ flex: 1 }}>
                  <div className="ai-progress-fill" style={{ width: `${(completedSections / 5) * 100}%` }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fca5a5", whiteSpace: "nowrap" }}>
                  {completedSections} / 5 sections
                </span>
              </div>
            </div>
            <ProfileButton />
          </div>
        </header>

        <div style={{ maxWidth: 896, margin: "0 auto", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── STAT CARDS ────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16 }}>
            <StatCard label="Domestic"      value={domesticDestinations.length}      color="#2563eb" />
            <StatCard label="International" value={internationalDestinations.length} color="#d97706" />
            <StatCard label="Days Planned"  value={days.length}                      color="#16a34a" />
            <StatCard label="Sections Done" value={completedSections}                color="#dc2626" />
          </div>

          {/* ── GLOBAL ALERTS ─────────────────────────────────────────── */}
          {submitError   && <Alert type="error"   msg={submitError}   onClose={() => setSubmitError("")} />}
          {submitSuccess && <Alert type="success" msg={submitSuccess} />}
          {destinationsError && <Alert type="error" msg={destinationsError} onClose={() => setDestinationsError("")} />}

          {/* ══ 1. CORE DETAILS ════════════════════════════════════════ */}
          <Section icon={HiOutlineViewBoards} title="Core Details" step="1">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>

              {/* Title — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel icon={HiOutlineViewBoards}>Itinerary Title *</FieldLabel>
                <input
                  type="text"
                  className="ai-input"
                  placeholder="e.g. Enchanting Goa Escape — 4 Days"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              {/* Travel Type */}
              <div>
                <FieldLabel icon={HiOutlineGlobe}>Travel Type</FieldLabel>
                <PillToggle
                  options={["Domestic", "International"]}
                  value={travelType}
                  onChange={handleTravelTypeChange}
                />
              </div>

              {/* Destination — dynamic */}
              <div>
                <FieldLabel icon={HiOutlineLocationMarker}>Destination *</FieldLabel>
                {destinationsLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fafafa", fontSize: 13, color: "#9ca3af" }}>
                    <span style={{ width: 14, height: 14, border: "2px solid #e5e7eb", borderTopColor: "#ef4444", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Loading destinations…
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (
                  <select
                    className="ai-input"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">
                      {activeDestinations.length === 0
                        ? `No ${travelType.toLowerCase()} destinations found`
                        : `— Select ${travelType} Destination —`}
                    </option>
                    {activeDestinations.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                )}
                {!destinationsLoading && activeDestinations.length === 0 && !destinationsError && (
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#f59e0b" }}>
                    ⚠ No {travelType.toLowerCase()} destinations saved yet. Add them in Destination Manager first.
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <FieldLabel icon={HiOutlineCalendar}>Duration *</FieldLabel>
                <select className="ai-input" value={duration} onChange={e => setDuration(e.target.value)} style={{ cursor: "pointer" }}>
                  <option value="">— Select Duration —</option>
                  {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Package Type */}
              <div>
                <FieldLabel icon={HiOutlineViewBoards}>Package Type</FieldLabel>
                <select className="ai-input" value={packageType} onChange={e => setPackageType(e.target.value)} style={{ cursor: "pointer" }}>
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Visibility */}
              <div>
                <FieldLabel icon={HiOutlineEye}>Visibility</FieldLabel>
                <select className="ai-input" value={visibility} onChange={e => setVisibility(e.target.value)} style={{ cursor: "pointer" }}>
                  {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Themes — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel icon={HiOutlineTag}>Themes</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "10px 16px", padding: 16, borderRadius: 12, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                  {THEMES.map(t => (
                    <RedCheck key={t} label={t} checked={themes.includes(t)}
                      onChange={() => toggle(setThemes, themes, t)} />
                  ))}
                </div>
              </div>

              {/* Classification — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel icon={HiOutlineViewBoards}>Classification</FieldLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 16, borderRadius: 12, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                  {CLASSIFICATIONS.map(cls => (
                    <RedCheck key={cls} label={cls} checked={classification.includes(cls)}
                      onChange={() => toggle(setClassification, classification, cls)} />
                  ))}
                </div>
              </div>

            </div>
          </Section>

          {/* ══ 2. DESTINATION DETAILS ═════════════════════════════════ */}
          <Section icon={HiOutlineDocumentText} title="Destination Details" step="2" collapsible>
            <FieldLabel icon={HiOutlineOfficeBuilding}>About the Destination</FieldLabel>
            <textarea
              className="ai-input"
              rows={5}
              placeholder="Write a vivid, engaging description of this destination…"
              value={destinationDetail}
              onChange={e => setDestinationDetail(e.target.value)}
              style={{ resize: "vertical", minHeight: 100 }}
            />
          </Section>

          {/* ══ 3. MEDIA ═══════════════════════════════════════════════ */}
          <Section icon={HiOutlinePhotograph} title="Media" step="3" collapsible>
            {!destination ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 12, background: "#fff7ed", border: "1px solid #fde68a", color: "#92400e", fontSize: 13 }}>
                <span>ℹ️</span> Select a destination first to enable media upload.
              </div>
            ) : (
              <>
                <label
                  htmlFor="ai-media-upload"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    width: "100%", padding: "32px 0", borderRadius: 16, border: "2px dashed #fca5a5",
                    background: "#fff5f5", cursor: "pointer", transition: "border-color .15s",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <HiOutlinePhotograph style={{ fontSize: 22, color: "#dc2626" }} />
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6b7280" }}>
                    <span style={{ color: "#dc2626", fontWeight: 700 }}>Click to upload</span> or drag & drop
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>PNG, JPG, WEBP up to 10MB · Multiple allowed</p>
                  <input id="ai-media-upload" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleMediaUpload} />
                </label>

                {selectedMedia.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                    {selectedMedia.map((src, i) => (
                      <div key={i} className="ai-day-card" style={{ position: "relative", width: 88, height: 88, borderRadius: 12, overflow: "hidden", border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => setSelectedMedia(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", border: "none", color: "white", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Section>

          {/* ══ 4. DAY-WISE PLAN ═══════════════════════════════════════ */}
          <Section icon={HiOutlineMap} title="Day-wise Plan" step="4">

            {/* Existing days */}
            {days.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {days.map(d => (
                  <div key={d.id} className="ai-day-card" style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    padding: 16, borderRadius: 14, background: "#fff5f5", border: "1px solid #fecaca",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{
                        width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, marginTop: 2,
                        background: "linear-gradient(135deg,#991b1b,#ef4444)", color: "white",
                      }}>
                        {d.day}
                      </span>
                      <div>
                        <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: "#991b1b" }}>{d.title}</p>
                        {d.locationDetail && (
                          <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{d.locationDetail}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDay(d.id)}
                      style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}
                    >
                      <HiOutlineTrash style={{ fontSize: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Day form */}
            <div style={{ padding: 20, borderRadius: 14, border: "1.5px dashed #e5e7eb", background: "#fafafa" }}>
              <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>Add New Day</p>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <FieldLabel>Day Title</FieldLabel>
                  <input type="text" className="ai-input" placeholder="e.g. Arrival & Beach Time"
                    value={dayForm.title} onChange={e => setDayForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel>Day #</FieldLabel>
                  <input type="number" min={1} className="ai-input"
                    value={dayForm.day} onChange={e => setDayForm(p => ({ ...p, day: Number(e.target.value) }))} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <FieldLabel>Location Detail</FieldLabel>
                <textarea rows={3} className="ai-input" placeholder="Describe the day's activities…"
                  value={dayForm.locationDetail}
                  onChange={e => setDayForm(p => ({ ...p, locationDetail: e.target.value }))}
                  style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleAddDay}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 22px",
                    borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                    background: "linear-gradient(135deg,#991b1b,#ef4444)", color: "white",
                    boxShadow: "0 4px 12px rgba(220,38,38,.3)",
                  }}
                >
                  <HiOutlinePlus style={{ fontSize: 16 }} /> Add Day
                </button>
              </div>
            </div>
          </Section>

          {/* ══ 5. INCLUSIONS / EXCLUSIONS ════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            <Section icon={HiOutlineCheckCircle} title="Inclusions" step="5">
              <FieldLabel icon={HiOutlineCheckCircle}>What's included (comma-separated)</FieldLabel>
              <textarea rows={4} className="ai-input" placeholder="Hotel stay, Daily breakfast, Airport transfer…"
                value={inclusions} onChange={e => setInclusions(e.target.value)} style={{ resize: "vertical" }} />
            </Section>
            <Section icon={HiOutlineBan} title="Exclusions">
              <FieldLabel icon={HiOutlineBan}>What's excluded (comma-separated)</FieldLabel>
              <textarea rows={4} className="ai-input" placeholder="Personal expenses, Travel insurance…"
                value={exclusions} onChange={e => setExclusions(e.target.value)} style={{ resize: "vertical" }} />
            </Section>
          </div>

          {/* ══ 6. HOTEL DETAILS ══════════════════════════════════════ */}
          <Section icon={HiOutlineOfficeBuilding} title="Hotel Details" collapsible>
            <RedCheck
              label="As per category (hotels assigned based on package tier)"
              checked={asPerCategory}
              onChange={() => setAsPerCategory(p => !p)}
            />
          </Section>

          {/* ══ 7. PRICING ════════════════════════════════════════════ */}
          <Section icon={HiOutlineCurrencyRupee} title="Pricing" step="6">
            <RedCheck
              label="Price as per best quote (hide fixed pricing)"
              checked={asBestQuote}
              onChange={() => setAsBestQuote(p => !p)}
            />
            {!asBestQuote && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginTop: 20 }}>
                <div>
                  <FieldLabel icon={HiOutlineCurrencyRupee}>Standard Price (₹)</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 600, fontSize: 13 }}>₹</span>
                    <input type="number" placeholder="0" className="ai-input"
                      value={standardPrice} onChange={e => setStandardPrice(e.target.value)}
                      style={{ paddingLeft: 28 }} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Discounted Price (₹)</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 600, fontSize: 13 }}>₹</span>
                    <input type="number" placeholder="0" className="ai-input"
                      value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)}
                      style={{ paddingLeft: 28 }} />
                  </div>
                  {savingPct > 0 && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
                      🎉 {savingPct}% savings for travellers
                    </p>
                  )}
                </div>
              </div>
            )}
          </Section>

          {/* ══ 8. TERMS & CONDITIONS ═════════════════════════════════ */}
          <Section icon={HiOutlineDocumentText} title="Terms & Conditions" collapsible>
            <FieldLabel icon={HiOutlineDocumentText}>Terms & Conditions</FieldLabel>
            <textarea rows={5} className="ai-input" placeholder="Auto-filled from settings…"
              value={termsConditions} onChange={e => setTermsConditions(e.target.value)} style={{ resize: "vertical" }} />
          </Section>

          {/* ══ 9. PAYMENT MODE ═══════════════════════════════════════ */}
          <Section icon={HiOutlineCreditCard} title="Payment Mode" collapsible>
            <FieldLabel icon={HiOutlineCreditCard}>Accepted Payment Modes</FieldLabel>
            <textarea rows={4} className="ai-input" placeholder="Auto-filled from settings…"
              value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ resize: "vertical" }} />
          </Section>

          {/* ══ 10. CANCELLATION POLICY ═══════════════════════════════ */}
          <Section icon={HiOutlineShieldCheck} title="Cancellation Policy" collapsible>
            <FieldLabel icon={HiOutlineShieldCheck}>Policy Terms</FieldLabel>
            <textarea rows={7} className="ai-input"
              value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} style={{ resize: "vertical" }} />
          </Section>

          {/* ══ SUBMIT ════════════════════════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", paddingBottom: 40, paddingTop: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
              {completedSections} of 5 key sections completed
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "16px 48px",
                borderRadius: 14, border: "none", cursor: submitLoading ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 800, letterSpacing: "0.03em", transition: "all .15s",
                background: submitLoading
                  ? "#d1d5db"
                  : "linear-gradient(135deg,#991b1b,#ef4444)",
                color: "white",
                boxShadow: submitLoading ? "none" : "0 6px 20px rgba(220,38,38,.35)",
              }}
            >
              {submitLoading
                ? <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                : <span style={{ fontSize: 18 }}>→</span>
              }
              {submitLoading ? "Submitting…" : "Submit Itinerary"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddItineraries;