import React, { useState } from 'react';
import { HiVideoCamera, HiUpload, HiTrash, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const HeroVideoManagement = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [visibility, setVisibility] = useState('Public');
  const [activeFilter, setActiveFilter] = useState('Home');
  
  const [uploadedVideos, setUploadedVideos] = useState([
    { id: '688867968b3fadc683149130', page: 'Home', visibility: 'Private', url: '#' },
    { id: '6891b4e8ebd1f5e628bff484', page: 'Home', visibility: 'Public', url: '#' },
  ]);

  const pages = ['home', 'about', 'domestic', 'international', 'contact', 'blog'];
  const filters = ['Home', 'About', 'Domestic', 'International', 'Contact', 'Blog'];

  const handleUpload = (e) => {
    e.preventDefault();
    const newVideo = {
      id: Math.random().toString(16).slice(2, 26),
      page: selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1),
      visibility: visibility,
      url: '#',
    };
    setUploadedVideos([newVideo, ...uploadedVideos]);
    alert("Video uploaded and set as Hero Video!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      setUploadedVideos(uploadedVideos.filter(v => v.id !== id));
    }
  };

  const toggleVisibility = (id) => {
    setUploadedVideos(uploadedVideos.map(v => 
      v.id === id ? { ...v, visibility: v.visibility === 'Public' ? 'Private' : 'Public' } : v
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Manage All Page Hero Videos</h1>
          <ProfileButton />
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Select Page */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i className="fas fa-th-large text-slate-400"></i>
                  Select Page
                </label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  {pages.map(page => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i className="fas fa-eye text-slate-400"></i>
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            {/* Video Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Hero Section Video</label>
              <div className="border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center hover:border-blue-400 transition-all cursor-pointer bg-blue-50/30 group">
                <div className="flex flex-col items-center gap-3">
                  <HiVideoCamera className="text-blue-500 text-4xl group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-slate-700 font-bold">Click to upload or drag & drop a video</p>
                    <p className="text-slate-400 text-sm mt-1">MP4, WebM, or Ogg formats recommended</p>
                  </div>
                </div>
                <input type="file" className="hidden" accept="video/*" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#94a3b8] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-slate-200 active:transform active:scale-[0.99]"
            >
              Upload and Set as Hero Video
            </button>
          </form>
        </div>

        {/* Uploaded Videos List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 className="text-2xl font-bold text-slate-900">Uploaded Videos</h2>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    activeFilter === filter 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 space-y-6">
            {uploadedVideos.filter(v => activeFilter === 'All' || v.page === activeFilter).map((video) => (
              <div key={video.id} className="group border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all bg-white flex flex-col md:flex-row gap-6 items-center">
                {/* Video Preview Placeholder */}
                <div className="w-full md:w-64 aspect-video bg-slate-900 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
                  <video className="w-full h-full object-cover opacity-50" poster="" src={video.url}></video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <i className="fas fa-play text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 px-2 py-1 rounded">0:00</div>
                </div>

                <div className="flex-1 space-y-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-900">{video.page}</h3>
                  <p className="text-slate-400 font-mono text-sm">ID: {video.id}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleVisibility(video.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${video.visibility === 'Public' ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${video.visibility === 'Public' ? 'translate-x-6' : ''}`}></div>
                    </button>
                    <span className={`text-sm font-bold ${video.visibility === 'Public' ? 'text-green-600' : 'text-slate-400'}`}>
                      {video.visibility}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                  >
                    <HiTrash className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoManagement;
