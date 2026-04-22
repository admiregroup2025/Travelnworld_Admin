import React, { useState, useEffect } from "react";
import {
  HiOutlineViewBoards,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlinePhotograph,
  HiOutlineMap,
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyRupee,
  HiOutlineEye,
} from "react-icons/hi";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const DOMESTIC_DESTINATIONS = [
  "Goa", "Manali", "Kerala", "Rajasthan", "Andaman", "Darjeeling",
  "Shimla", "Leh Ladakh", "Varanasi", "Coorg",
];

const INTERNATIONAL_DESTINATIONS = [
  "France", "Japan", "Italy", "Dubai", "Singapore",
  "Thailand", "Maldives", "Switzerland", "USA", "Australia",
];

const DURATION_OPTIONS = [
  "1 Night / 2 Days", "2 Nights / 3 Days", "3 Nights / 4 Days",
  "4 Nights / 5 Days", "5 Nights / 6 Days", "6 Nights / 7 Days",
  "7 Nights / 8 Days", "10 Nights / 11 Days", "14 Nights / 15 Days",
];

const THEMES = [
  "Family", "Honeymoon", "Adventures", "Solo",
  "Wildlife", "Beach", "Pilgrimage", "Hill Station",
  "Heritage Tour", "Ayurveda Tour", "Cultural Tour",
  "Luxury Tour", "Budget Tour", "Family Tour",
  "Bachelor Tour", "Women Group", "Special Interest",
];

const CLASSIFICATIONS = ["Trending", "Exclusive", "Weekend", "Top Selling"];
const TYPE_OPTIONS = ["Flexible", "Fixed", "Group", "Customizable"];
const VISIBILITY_OPTIONS = ["Public", "Private", "Draft"];

const DEFAULT_CANCELLATION_POLICY = `◆ Airfare/Train fare cancellation applied original booking refund policy
◆ Before 30 days of cancellation: 100% refund of total booking amount
◆ Between 15-30 days: 50% refund of total booking amount
◆ Between 7-15 days: 25% refund of total booking amount
◆ Less than 7 days: No refund`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white/90 backdrop-blur-[10px] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-red-600/10 p-6 sm:p-8 mb-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)]">
    {title && (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className="text-red-600 text-xl" />}
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
      </div>
    )}
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FIELD LABEL
// ─────────────────────────────────────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold mb-2">
    {Icon && <Icon className="text-red-500 text-lg" />}
    <span>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const AddItineraries = ({ onSubmit }) => {
  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const bg = document.getElementById("animatedBg");
    if (!bg) return;

    bg.innerHTML = "";
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute rounded-full opacity-[0.03] animate-float bg-red-600";

      const size = Math.random() * 4 + 2;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 8 + "s";
      particle.style.animationDuration = Math.random() * 10 + 5 + "s";

      bg.appendChild(particle);
    }
  };

  const [title, setTitle] = useState("");
  const [travelType, setTravelType] = useState("Domestic");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [themes, setThemes] = useState([]);
  const [classification, setClassification] = useState([]);
  const [packageType, setPackageType] = useState("Flexible");
  const [visibility, setVisibility] = useState("Public");
  const [destinationDetail, setDestinationDetail] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [days, setDays] = useState([]);
  const [dayForm, setDayForm] = useState({ title: "", day: 1, locationDetail: "" });
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [asPerCategory, setAsPerCategory] = useState(false);
  const [asBestQuote, setAsBestQuote] = useState(false);
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState(DEFAULT_CANCELLATION_POLICY);

  const toggleArrayItem = (setter, arr, value) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleTravelTypeChange = (type) => {
    setTravelType(type);
    setDestination("");
  };

  const handleAddDay = () => {
    if (!dayForm.title.trim()) return;
    setDays([...days, { id: Date.now(), ...dayForm }]);
    setDayForm({ title: "", day: dayForm.day + 1, locationDetail: "" });
  };

  const handleRemoveDay = (id) => setDays(days.filter((d) => d.id !== id));

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setSelectedMedia([...selectedMedia, ...previews]);
  };

  const handleSubmit = () => {
    const payload = {
      title, travelType, destination, duration, themes, classification, packageType, visibility,
      destinationDetail, mediaUrls: selectedMedia,
      days: days.map(({ id, ...rest }) => rest),
      inclusions: inclusions.split(",").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusions.split(",").map((s) => s.trim()).filter(Boolean),
      asPerCategory, asBestQuote,
      standardPrice: asBestQuote ? null : Number(standardPrice),
      discountedPrice: asBestQuote ? null : Number(discountedPrice),
      termsConditions, paymentMode, cancellationPolicy,
    };
    console.log("Itinerary Payload →", payload);
    if (onSubmit) onSubmit(payload);
  };

  const destinationOptions = travelType === "Domestic" ? DOMESTIC_DESTINATIONS : INTERNATIONAL_DESTINATIONS;

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.08; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        
        .form-input {
          @apply w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm transition-all duration-200 outline-none;
        }
        .form-input:focus {
          @apply border-red-500 ring-4 ring-red-500/10 bg-white;
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-full -z-[1] overflow-hidden bg-slate-50" id="animatedBg"></div>

      <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            Create <span className="text-red-600">New Itinerary</span>
          </h1>
          <p className="text-gray-500 font-medium">Build a custom travel experience for your clients</p>
        </header>

        {/* ── SECTION 1: CORE DETAILS ─────────────────────────────────────── */}
        <SectionCard icon={HiOutlineViewBoards} title="Core Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FieldLabel icon={HiOutlineViewBoards} label="Itinerary Title" />
              <input
                type="text"
                placeholder="e.g. Luxury Escape to the Maldives"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
              />
            </div>

            <div>
              <FieldLabel icon={HiOutlineGlobe} label="Travel Type" />
              <div className="flex gap-8 mt-2">
                {["Domestic", "International"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="travelType"
                        value={type}
                        checked={travelType === type}
                        onChange={() => handleTravelTypeChange(type)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-600 transition-all"
                      />
                      <div className="absolute w-2.5 h-2.5 bg-red-600 rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-red-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel icon={HiOutlineLocationMarker} label="Destination" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1em_1em]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
              >
                <option value="">-- Select Destination --</option>
                {destinationOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel icon={HiOutlineCalendar} label="Duration" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1em_1em]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
              >
                <option value="">-- Select Duration --</option>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <FieldLabel icon={HiOutlineTag} label="Travel Theme" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                {THEMES.map((theme) => (
                  <label key={theme} className="flex items-center gap-3 text-xs font-bold text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={themes.includes(theme)}
                      onChange={() => toggleArrayItem(setThemes, themes, theme)}
                      className="accent-red-600 w-4 h-4 rounded border-gray-300"
                    />
                    <span className="group-hover:text-red-600 transition-colors">{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel icon={HiOutlineViewBoards} label="Classification" />
              <div className="flex flex-wrap gap-4 mt-2">
                {CLASSIFICATIONS.map((cls) => (
                  <label key={cls} className="flex items-center gap-3 text-xs font-bold text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={classification.includes(cls)}
                      onChange={() => toggleArrayItem(setClassification, classification, cls)}
                      className="accent-red-600 w-4 h-4 rounded border-gray-300"
                    />
                    <span className="group-hover:text-red-600 transition-colors">{cls}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel icon={HiOutlineEye} label="Visibility & Type" />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none"
                >
                  {VISIBILITY_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── SECTION 2: DESTINATION DETAILS ──────────────────────────────── */}
        <SectionCard icon={HiOutlineDocumentText} title="Destination Details">
          <textarea
            rows={4}
            placeholder="Introduce the beauty of this destination..."
            value={destinationDetail}
            onChange={(e) => setDestinationDetail(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none"
          />
        </SectionCard>

        {/* ── SECTION 3: MEDIA ─────────────────────────────────────────────── */}
        <SectionCard icon={HiOutlinePhotograph} title="Gallery & Media">
          <div className="flex flex-col gap-6">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-200 rounded-3xl bg-red-50/30 cursor-pointer hover:bg-red-50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <HiOutlinePlus className="text-3xl text-red-400 group-hover:scale-125 transition-transform" />
                <p className="text-sm font-bold text-red-600 mt-2">Upload Vibrant Images</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WebP (Max 10MB)</p>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleMediaUpload} />
            </label>

            {selectedMedia.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {selectedMedia.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-red-100">
                    <img src={src} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button
                      onClick={() => setSelectedMedia(selectedMedia.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── SECTION 4: DAY-WISE PLAN ─────────────────────────────────────── */}
        <SectionCard icon={HiOutlineMap} title="Day-wise Itinerary">
          <div className="space-y-6">
            {days.map((d) => (
              <div key={d.id} className="relative pl-8 border-l-2 border-red-100 py-2">
                <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-sm"></div>
                <div className="bg-white border border-red-50 rounded-2xl p-4 shadow-sm flex justify-between items-start">
                  <div>
                    <h4 className="text-red-600 font-black text-sm uppercase tracking-wider">Day {d.day}</h4>
                    <p className="text-gray-800 font-bold text-lg">{d.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{d.locationDetail}</p>
                  </div>
                  <button onClick={() => handleRemoveDay(d.id)} className="text-red-300 hover:text-red-600 transition-colors">
                    <HiOutlineBan className="text-xl" />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Day Title (e.g. Arrival & Sunset Beach)"
                  value={dayForm.title}
                  onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:border-red-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Day #"
                  value={dayForm.day}
                  onChange={(e) => setDayForm({ ...dayForm, day: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:border-red-500 outline-none"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Describe what happens on this day..."
                value={dayForm.locationDetail}
                onChange={(e) => setDayForm({ ...dayForm, locationDetail: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-red-500 outline-none resize-none mb-4"
              />
              <button
                onClick={handleAddDay}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                <HiOutlinePlus /> Add This Day to Plan
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── PRICING & POLICIES ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard icon={HiOutlineCurrencyRupee} title="Pricing">
            <label className="flex items-center gap-3 cursor-pointer mb-6 group">
              <input
                type="checkbox"
                checked={asBestQuote}
                onChange={(e) => setAsBestQuote(e.target.checked)}
                className="accent-red-600 w-5 h-5 rounded"
              />
              <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">As per best quote</span>
            </label>

            {!asBestQuote && (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Standard Price (₹)"
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Discounted Price (₹)"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none"
                />
              </div>
            )}
          </SectionCard>

          <SectionCard icon={HiOutlineOfficeBuilding} title="Hotel Details">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={asPerCategory}
                onChange={(e) => setAsPerCategory(e.target.checked)}
                className="accent-red-600 w-5 h-5 rounded"
              />
              <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">As per category selected</span>
            </label>
          </SectionCard>
        </div>

        {/* ── INCLUSIONS / EXCLUSIONS ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard icon={HiOutlineCheckCircle} title="Inclusions">
            <textarea
              rows={4}
              placeholder="e.g. Breakfast, Transfers, Sightseeing..."
              value={inclusions}
              onChange={(e) => setInclusions(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none resize-none"
            />
          </SectionCard>
          <SectionCard icon={HiOutlineBan} title="Exclusions">
            <textarea
              rows={4}
              placeholder="e.g. Personal tips, Extra meals, Flights..."
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none resize-none"
            />
          </SectionCard>
        </div>

        {/* ── POLICIES ───────────────────────────────────────────────────── */}
        <SectionCard icon={HiOutlineShieldCheck} title="Policies & Terms">
          <div className="space-y-6">
            <div>
              <FieldLabel icon={HiOutlineDocumentText} label="Terms & Conditions" />
              <textarea
                rows={3}
                placeholder="Auto-filled from settings"
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <FieldLabel icon={HiOutlineCreditCard} label="Payment Mode" />
              <textarea
                rows={3}
                placeholder="Payment details..."
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <FieldLabel icon={HiOutlineShieldCheck} label="Cancellation Policy" />
              <textarea
                rows={4}
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-red-500 outline-none"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── SUBMIT ──────────────────────────────────────────────────────── */}
        <div className="flex justify-center pb-20">
          <button
            onClick={handleSubmit}
            className="group relative inline-flex items-center justify-center px-12 py-4 font-black text-white transition-all duration-200 bg-red-600 rounded-full hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <HiOutlineCheckCircle className="text-2xl" /> Launch This Itinerary
            </span>
            <div className="absolute inset-0 w-0 h-full transition-all duration-300 ease-out bg-white/10 group-hover:w-full"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default AddItineraries;
