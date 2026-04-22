import React, { useState } from "react";
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
// CONSTANTS — move to a separate constants.js file when wiring up to backend
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

// Default cancellation policy text — typically fetched from backend/settings
const DEFAULT_CANCELLATION_POLICY = `◆ Airfare/Train fare cancellation applied original booking refund policy
◆ Before 30 days of cancellation: 100% refund of total booking amount
◆ Between 15-30 days: 50% refund of total booking amount
◆ Between 7-15 days: 25% refund of total booking amount
◆ Less than 7 days: No refund`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER — reusable card component for each form section
// ─────────────────────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
    {title && (
      <>
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="text-gray-700 text-lg" />}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <hr className="border-gray-200 mb-5" />
      </>
    )}
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FIELD LABEL — reusable label with optional icon
// ─────────────────────────────────────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium mb-1.5">
    {Icon && <Icon className="text-base" />}
    <span>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const AddItineraries = ({ onSubmit }) => {
  // ── CORE DETAILS STATE ──────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [travelType, setTravelType] = useState("Domestic"); // "Domestic" | "International"
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [themes, setThemes] = useState([]); // array of selected theme strings
  const [classification, setClassification] = useState([]); // array of selected classification strings
  const [packageType, setPackageType] = useState("Flexible");
  const [visibility, setVisibility] = useState("Public");

  // ── DESTINATION DETAILS STATE ───────────────────────────────────────────
  const [destinationDetail, setDestinationDetail] = useState("");

  // ── MEDIA STATE ─────────────────────────────────────────────────────────
  // selectedMedia: array of image URLs / file objects (when backend is ready, use File objects)
  const [selectedMedia, setSelectedMedia] = useState([]);

  // ── DAY-WISE PLAN STATE ─────────────────────────────────────────────────
  // days: array of { id, title, day, locationDetail }
  const [days, setDays] = useState([]);
  const [dayForm, setDayForm] = useState({ title: "", day: 1, locationDetail: "" });

  // ── INCLUSIONS / EXCLUSIONS STATE ───────────────────────────────────────
  const [inclusions, setInclusions] = useState(""); // comma-separated string
  const [exclusions, setExclusions] = useState(""); // comma-separated string

  // ── HOTEL DETAILS STATE ─────────────────────────────────────────────────
  const [asPerCategory, setAsPerCategory] = useState(false);

  // ── PRICING STATE ───────────────────────────────────────────────────────
  const [asBestQuote, setAsBestQuote] = useState(false);
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");

  // ── TERMS / PAYMENT / CANCELLATION STATE ────────────────────────────────
  const [termsConditions, setTermsConditions] = useState(""); // auto-filled from backend
  const [paymentMode, setPaymentMode] = useState("");         // auto-filled from API
  const [cancellationPolicy, setCancellationPolicy] = useState(DEFAULT_CANCELLATION_POLICY);

  // ────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────────────────────────────────────────

  /** Toggle a checkbox value in an array-based state */
  const toggleArrayItem = (setter, arr, value) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  /** When travel type changes, reset destination */
  const handleTravelTypeChange = (type) => {
    setTravelType(type);
    setDestination("");
  };

  /** Add a new day entry to the day-wise plan */
  const handleAddDay = () => {
    if (!dayForm.title.trim()) return;
    setDays([
      ...days,
      { id: Date.now(), ...dayForm },
    ]);
    // Auto-increment day number for next entry
    setDayForm({ title: "", day: dayForm.day + 1, locationDetail: "" });
  };

  /** Remove a day from the list */
  const handleRemoveDay = (id) => setDays(days.filter((d) => d.id !== id));

  /** Handle media file selection — store as object URLs for preview */
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setSelectedMedia([...selectedMedia, ...previews]);
    // TODO: When wiring backend, upload files to S3/Cloudinary here
    // and store returned URLs instead of object URLs
  };

  /** ── FORM SUBMIT ──────────────────────────────────────────────────────
   * Aggregates all form state into one payload.
   * When backend is ready:
   *  - POST /api/itineraries  with this payload
   *  - Handle multipart/form-data for media files separately if needed
   */
  const handleSubmit = () => {
    const payload = {
      // Core Details
      title,
      travelType,
      destination,
      duration,
      themes,
      classification,
      packageType,
      visibility,

      // Destination Details
      destinationDetail,

      // Media — replace object URLs with actual upload IDs from backend
      mediaUrls: selectedMedia,

      // Day-wise Plan
      days: days.map(({ id, ...rest }) => rest), // strip local id

      // Inclusions & Exclusions — split comma-separated into arrays
      inclusions: inclusions.split(",").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusions.split(",").map((s) => s.trim()).filter(Boolean),

      // Hotel
      asPerCategory,

      // Pricing
      asBestQuote,
      standardPrice: asBestQuote ? null : Number(standardPrice),
      discountedPrice: asBestQuote ? null : Number(discountedPrice),

      // Policies
      termsConditions,
      paymentMode,
      cancellationPolicy,
    };

    console.log("Itinerary Payload →", payload);
    if (onSubmit) onSubmit(payload);
    // TODO: call your API here, e.g.:
    // await axios.post('/api/itineraries', payload);
  };

  // ────────────────────────────────────────────────────────────────────────
  // DERIVED VALUES
  // ────────────────────────────────────────────────────────────────────────
  const destinationOptions =
    travelType === "Domestic" ? DOMESTIC_DESTINATIONS : INTERNATIONAL_DESTINATIONS;

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Itinerary</h1>

      {/* ── SECTION 1: CORE DETAILS ─────────────────────────────────────── */}
      <SectionCard icon={HiOutlineViewBoards} title="Core Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <FieldLabel icon={HiOutlineViewBoards} label="Title" />
            <input
              type="text"
              placeholder="Enter Itinerary Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Travel Type */}
          <div>
            <FieldLabel icon={HiOutlineGlobe} label="Travel Type" />
            <div className="flex gap-6 mt-1">
              {["Domestic", "International"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name="travelType"
                    value={type}
                    checked={travelType === type}
                    onChange={() => handleTravelTypeChange(type)}
                    className="accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div>
            <FieldLabel icon={HiOutlineLocationMarker} label="Destination" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Destination --</option>
              {destinationOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <FieldLabel icon={HiOutlineCalendar} label="Duration" />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Duration --</option>
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Theme — full width */}
          <div className="md:col-span-2">
            <FieldLabel icon={HiOutlineTag} label="Theme" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 mt-1">
              {THEMES.map((theme) => (
                <label key={theme} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themes.includes(theme)}
                    onChange={() => toggleArrayItem(setThemes, themes, theme)}
                    className="accent-blue-600"
                  />
                  {theme}
                </label>
              ))}
            </div>
          </div>

          {/* Classification */}
          <div>
            <FieldLabel icon={HiOutlineViewBoards} label="Classification" />
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
              {CLASSIFICATIONS.map((cls) => (
                <label key={cls} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={classification.includes(cls)}
                    onChange={() => toggleArrayItem(setClassification, classification, cls)}
                    className="accent-blue-600"
                  />
                  {cls}
                </label>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <FieldLabel icon={HiOutlineViewBoards} label="Type" />
            <select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div>
            <FieldLabel icon={HiOutlineEye} label="Visibility" />
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {VISIBILITY_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── SECTION 2: DESTINATION DETAILS ──────────────────────────────── */}
      <SectionCard icon={HiOutlineDocumentText} title="Destination Details">
        <FieldLabel icon={HiOutlineOfficeBuilding} label="Destination Detail" />
        <textarea
          rows={5}
          placeholder="Write a short description about the destination..."
          value={destinationDetail}
          onChange={(e) => setDestinationDetail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </SectionCard>

      {/* ── SECTION 3: MEDIA ─────────────────────────────────────────────── */}
      <SectionCard icon={HiOutlinePhotograph} title="Media">
        {!destination ? (
          <p className="text-sm text-gray-400 italic">
            Please select a destination in Core Details section to show available images.
          </p>
        ) : (
          <div>
            {/* File upload input */}
            <label className="inline-flex items-center gap-2 cursor-pointer bg-blue-50 border border-blue-200 text-blue-600 text-sm px-4 py-2 rounded-lg hover:bg-blue-100 transition">
              <HiOutlinePlus />
              Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleMediaUpload}
                // TODO: Wire to backend upload endpoint on change
              />
            </label>

            {/* Image previews */}
            {selectedMedia.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedMedia.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setSelectedMedia(selectedMedia.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* ── SECTION 4: DAY-WISE PLAN ─────────────────────────────────────── */}
      <SectionCard icon={HiOutlineMap} title="Day-wise Plan">

        {/* Existing days list */}
        {days.length > 0 && (
          <div className="mb-5 space-y-3">
            {days.map((d) => (
              <div
                key={d.id}
                className="flex items-start justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-blue-700">Day {d.day} — {d.title}</p>
                  {d.locationDetail && (
                    <p className="text-gray-500 mt-0.5 text-xs">{d.locationDetail}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveDay(d.id)}
                  className="text-red-400 hover:text-red-600 text-lg ml-3"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Day entry form */}
        <div className="space-y-4">
          <div>
            <FieldLabel label="Title" />
            <input
              type="text"
              placeholder="Enter location name"
              value={dayForm.title}
              onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <FieldLabel label="Day" />
            <input
              type="number"
              min={1}
              value={dayForm.day}
              onChange={(e) => setDayForm({ ...dayForm, day: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <FieldLabel label="Location Detail" />
            <textarea
              rows={3}
              placeholder="Enter location details"
              value={dayForm.locationDetail}
              onChange={(e) => setDayForm({ ...dayForm, locationDetail: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
          </div>

          {/* Add Day button — right aligned like in screenshot */}
          <div className="flex justify-end">
            <button
              onClick={handleAddDay}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Add Day
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── SECTION 5: INCLUSIONS ────────────────────────────────────────── */}
      <SectionCard icon={HiOutlineCheckCircle} title="Inclusions">
        <FieldLabel icon={HiOutlineCheckCircle} label="Inclusions (comma separated)" />
        <textarea
          rows={4}
          placeholder="Hotel stay, Meals, Airport transfer"
          value={inclusions}
          onChange={(e) => setInclusions(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </SectionCard>

      {/* ── SECTION 6: EXCLUSIONS ────────────────────────────────────────── */}
      <SectionCard icon={HiOutlineBan} title="Exclusions">
        <FieldLabel icon={HiOutlineBan} label="Exclusions (comma separated)" />
        <textarea
          rows={4}
          placeholder="Personal expenses, Travel insurance"
          value={exclusions}
          onChange={(e) => setExclusions(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </SectionCard>

      {/* ── SECTION 7: HOTEL DETAILS ─────────────────────────────────────── */}
      <SectionCard icon={HiOutlineOfficeBuilding} title="Hotel Details">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={asPerCategory}
            onChange={(e) => setAsPerCategory(e.target.checked)}
            className="accent-blue-600"
          />
          As per category
        </label>
        {/* TODO: If asPerCategory is false, show hotel name / star rating fields */}
      </SectionCard>

      {/* ── SECTION 8: PRICING ───────────────────────────────────────────── */}
      <SectionCard icon={HiOutlineCurrencyRupee} title="Pricing">
        {/* As per best quote toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={asBestQuote}
            onChange={(e) => setAsBestQuote(e.target.checked)}
            className="accent-blue-600"
          />
          <HiOutlineCurrencyRupee className="text-base" />
          As per best quote
        </label>

        {/* Price fields — hidden when asBestQuote is true */}
        {!asBestQuote && (
          <div className="space-y-4">
            <div>
              <FieldLabel icon={HiOutlineCurrencyRupee} label="Standard Price" />
              <input
                type="number"
                placeholder="Enter standard price"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              {/* Discounted Price label matches the % icon in screenshot */}
              <FieldLabel label="Discounted Price" />
              <input
                type="number"
                placeholder="Enter discount if any"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── SECTION 9: TERMS & CONDITIONS ────────────────────────────────── */}
      <SectionCard icon={HiOutlineDocumentText} title="Terms & Conditions">
        <FieldLabel icon={HiOutlineDocumentText} label="Terms & Conditions" />
        <textarea
          rows={5}
          placeholder="Auto-filled"
          value={termsConditions}
          onChange={(e) => setTermsConditions(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          // TODO: Pre-fill from GET /api/settings/terms when component mounts
        />
      </SectionCard>

      {/* ── SECTION 10: PAYMENT MODE ─────────────────────────────────────── */}
      <SectionCard icon={HiOutlineCreditCard} title="Payment Mode">
        <FieldLabel icon={HiOutlineCreditCard} label="Payment Mode" />
        <textarea
          rows={4}
          placeholder="Auto-filled from API, you can edit..."
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          // TODO: Pre-fill from GET /api/settings/payment-modes when component mounts
        />
      </SectionCard>

      {/* ── SECTION 11: CANCELLATION POLICY ─────────────────────────────── */}
      <SectionCard icon={HiOutlineShieldCheck} title="Cancellation Policy">
        <FieldLabel icon={HiOutlineShieldCheck} label="Cancellation Policy" />
        <textarea
          rows={6}
          value={cancellationPolicy}
          onChange={(e) => setCancellationPolicy(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          // TODO: Pre-fill from GET /api/settings/cancellation-policy when component mounts
        />
      </SectionCard>

      {/* ── SUBMIT BUTTON ─────────────────────────────────────────────────── */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition text-sm"
        >
          Submit Itinerary
        </button>
      </div>
    </div>
  );
};

export default AddItineraries;
