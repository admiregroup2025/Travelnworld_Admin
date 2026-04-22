import React, { useState } from 'react';
import { HiDocumentText, HiSave, HiPencil } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const PaymentTerms = () => {
  const [category, setCategory] = useState('Domestic');
  const [isEditing, setIsEditing] = useState(false);
  const [paymentContent, setPaymentContent] = useState({
    Domestic: `👉 Airfare/Train fare require 100% at the time of booking 👉 Minimum 40% advance payment require at the time of confirmation 👉 Rest 40% advance before 21days from journey date 👉 Remaining balance require 15days before of tour start(it's mandatory).`,
    International: `👉 Airfare/Train fare require 100% at the time of booking 👉 Minimum 40% advance payment require at the time of confirmation 👉 Rest 40% advance before 21days from journey date 👉 Remaining balance require 15days before of tour start(it's mandatory).`
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Payment terms updated successfully!');
  };

  const handleContentChange = (e) => {
    setPaymentContent(prev => ({
      ...prev,
      [category]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Mode</h1>
            <p className="text-slate-500 mt-1">Select a category to view, edit, and manage its associated Payment Mode.</p>
          </div>
          <ProfileButton />
        </header>

        {/* Selection Area */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-4">Select Category</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value="Domestic"
                checked={category === 'Domestic'}
                onChange={(e) => setCategory(e.target.value)}
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-5 h-5 text-red-600 focus:ring-red-500 border-slate-300"
              />
              <span className="text-slate-600 font-medium group-hover:text-red-600 transition-colors">International</span>
            </label>
          </div>
        </div>

        {/* Payment Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HiDocumentText className="text-slate-400 text-xl" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Associated Payment Mode</h2>
            </div>
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
          </div>
          
          <div className="p-8 flex-1 flex flex-col">
            <textarea
              value={paymentContent[category]}
              onChange={handleContentChange}
              disabled={!isEditing}
              placeholder="Enter payment mode details here..."
              className={`w-full flex-1 p-6 rounded-2xl border-2 transition-all outline-none resize-none leading-relaxed text-slate-700 font-medium ${
                isEditing 
                ? 'border-red-100 bg-white shadow-inner focus:border-red-300' 
                : 'border-transparent bg-slate-50/30 cursor-not-allowed'
              }`}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTerms;
