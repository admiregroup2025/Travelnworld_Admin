import React, { useState, useEffect } from 'react';
import { HiDocumentText, HiCreditCard, HiXCircle, HiSave, HiPencil } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const TermsManagement = () => {
  const [category, setCategory] = useState('Domestic');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [termsContent, setTermsContent] = useState('');

  const [allDestinations, setAllDestinations] = useState(() => {
    const saved = localStorage.getItem('destinations');
    return saved ? JSON.parse(saved) : [];
  });

  const destinations = {
    Domestic: allDestinations.filter(d => d.type === 'Domestic').map(d => d.name),
    International: allDestinations.filter(d => d.type === 'International').map(d => d.name)
  };

  const handleDestinationChange = (e) => {
    const dest = e.target.value;
    setSelectedDestination(dest);
    if (dest === 'Andaman') {
      setTermsContent(`All Indian nationals are required to carry a valid Government ID proof.
All foreign nationals are requested to carry their passports with them during the tours.
Any change in the itinerary is subject to the weather conditions, political manifestations and government restrictions. Company reserve the rights to rearrange the itinerary in such cases
Refund/alternate for any complementary activity is not applicable if activity gets cancelled.
In case a location is closed real-time due to weather conditions, political disturbances and government restrictions the operator will try to provide with a feasible alternative for the same. However, a refund may not be applicable
Sailing of Pvt. Cruise (Makruzz/Green Ocean/ Coastal Cruise) is subject to availability if not operated/available travellers will be booked through Govt. Ferry.`);
    } else {
      setTermsContent('');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Terms updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Destination Terms Management</h1>
            <p className="text-slate-500 mt-1">Select a destination to view, edit, and manage its associated terms.</p>
          </div>
          <ProfileButton />
        </header>

        {/* Selection Area */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4">Select Category</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value="Domestic"
                  checked={category === 'Domestic'}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSelectedDestination('');
                    setTermsContent('');
                  }}
                  className="w-5 h-5 text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-slate-600 font-medium group-hover:text-red-600 transition-colors">Domestic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value="International"
                  checked={category === 'International'}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSelectedDestination('');
                    setTermsContent('');
                  }}
                  className="w-5 h-5 text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-slate-600 font-medium group-hover:text-red-600 transition-colors">International</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Destination</label>
            <select
              value={selectedDestination}
              onChange={handleDestinationChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white"
            >
              <option value="">-- Select a Destination --</option>
              {destinations[category].map((dest) => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Terms Editor Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HiDocumentText className="text-slate-400 text-xl" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Associated Terms</h2>
            </div>
            {selectedDestination && (
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-sm ${
                  isEditing 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-slate-50 text-slate-400 hover:text-red-600'
                }`}
              >
                {isEditing ? <><HiSave /> Save</> : <><HiPencil /> Edit</>}
              </button>
            )}
          </div>
          
          <div className="p-8 flex-1 flex flex-col">
            {!selectedDestination ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-20">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <i className="fas fa-map-marker-alt text-2xl"></i>
                </div>
                <p className="font-medium">Please select a destination to manage its terms.</p>
              </div>
            ) : (
              <textarea
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter destination terms here..."
                className={`w-full flex-1 p-6 rounded-2xl border-2 transition-all outline-none resize-none leading-relaxed text-slate-700 font-medium ${
                  isEditing 
                  ? 'border-red-100 bg-white shadow-inner focus:border-red-300' 
                  : 'border-transparent bg-slate-50/30 cursor-not-allowed'
                }`}
              ></textarea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsManagement;
