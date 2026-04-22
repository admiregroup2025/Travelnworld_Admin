import React, { useState } from 'react';
import { HiDocumentText, HiSave, HiPencil } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const CancellationPolicy = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [policyContent, setPolicyContent] = useState(
    `Airfare/Train fare cancellation applied original booking refund policy Before 30days of cancellation 100% refund of total booking amount Before 15days of cancellation 25% cancellation amount require of total booking cost Before 7days of cancellation 50% cancellation amount require of total booking cost Before 3days of cancellation no refund allowed of total advance amount. N.B.-Any types of cancellation/Refund amount will be made 30working days from date of cancellation. N.B-Refund amount pay through Cheque mode Only.`
  );

  const handleSave = () => {
    setIsEditing(false);
    alert('Cancellation policy updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cancellation Policy Management</h1>
            <p className="text-slate-500 mt-1">View, edit, and manage the general cancellation policy.</p>
          </div>
          <ProfileButton />
        </header>

        {/* Policy Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HiDocumentText className="text-slate-400 text-xl" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Cancellation Policy Content</h2>
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
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter cancellation policy details here..."
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

export default CancellationPolicy;
