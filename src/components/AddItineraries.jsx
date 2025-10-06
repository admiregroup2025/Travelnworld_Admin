import React, { useState } from "react";
import ProfileButton from "./ProfileButton";

const AddItineraries = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [days, setDays] = useState([
    {
      dayTitle: "",
      dayDetails: "",
      dayActivities: "",
      dayMeals: "",
      dayStay: "",
    },
  ]);

  // Update day field
  const updateDay = (index, field, value) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      newDays[index] = { ...newDays[index], [field]: value };
      return newDays;
    });
  };

  // Add new day
  const addDay = () => {
    setDays((prevDays) => [
      ...prevDays,
      {
        dayTitle: "",
        dayDetails: "",
        dayActivities: "",
        dayMeals: "",
        dayStay: "",
      },
    ]);
  };

  // Remove day by index
  const removeDay = (index) => {
    setDays((prevDays) => prevDays.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itineraryData = {
      title,
      slug,
      days,
    };
    console.log("Submitting itinerary:", itineraryData);
    // You can replace this with your API call
  };

  return (
    <div className="relative min-h-screen bg-white px-4 py-6 sm:px-8 rounded-2xl max-w-7xl mx-auto">
      <div className="w-full relative">
        <header className="bg-white/90 backdrop-blur-[15px] p-4 sm:p-6 rounded-[20px] border border-blue-600/20 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative z-10">
          <div className="text-xl sm:text-2xl lg:text-[2rem] font-bold text-blue-600 flex items-center gap-3 sm:gap-4">
            <i className="fas fa-map-marked-alt text-lg sm:text-xl w-5 text-center"></i>{" "}
            <span>Itineraries</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <ProfileButton />
          </div>
        </header>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Title and Slug */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full max-w-md">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter itinerary title"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col w-full max-w-md">
            <label
              htmlFor="slug"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter slug"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Dynamic Days */}
        {days.map((day, idx) => (
          <fieldset
            key={idx}
            className="border border-gray-300 rounded-md p-4 space-y-4 relative"
          >
            <legend className="text-lg font-semibold">
              Day {idx + 1} Details
            </legend>

            {/* Remove button if more than 1 day */}
            {days.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
                aria-label={`Remove Day ${idx + 1}`}
              >
                &times;
              </button>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day Title
              </label>
              <input
                type="text"
                value={day.dayTitle}
                onChange={(e) => updateDay(idx, "dayTitle", e.target.value)}
                placeholder="Arrival and city tour"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details / Overview
              </label>
              <textarea
                rows={3}
                value={day.dayDetails}
                onChange={(e) => updateDay(idx, "dayDetails", e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activities (comma separated)
              </label>
              <input
                type="text"
                value={day.dayActivities}
                onChange={(e) =>
                  updateDay(idx, "dayActivities", e.target.value)
                }
                placeholder="Museum visit, boat ride"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meals Info
              </label>
              <input
                type="text"
                value={day.dayMeals}
                onChange={(e) => updateDay(idx, "dayMeals", e.target.value)}
                placeholder="Breakfast included"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stay (Hotel/Guest house)
              </label>
              <input
                type="text"
                value={day.dayStay}
                onChange={(e) => updateDay(idx, "dayStay", e.target.value)}
                placeholder="Hotel ABC"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </fieldset>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addDay}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Day
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
        >
          Save Itinerary
        </button>
      </form>
    </div>
  );
};

export default AddItineraries;
