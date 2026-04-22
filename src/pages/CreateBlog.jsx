import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { HiPlus, HiPhotograph, HiUpload, HiArrowLeft } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const CreateBlog = () => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!title) return;
    alert("Blog post created successfully!");
    // Reset form
    setTitle('');
    setContent('');
    setCoverImage(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <HiPlus className="text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Create a New Blog Post</h1>
          </div>
          <ProfileButton />
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Blog Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Blog Details</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i className="fas fa-heading text-slate-400"></i>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i className="fas fa-eye text-slate-400"></i>
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-medium"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Cover Image</h2>
            </div>
            <div className="p-8">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center hover:border-blue-400 transition-all cursor-pointer bg-white group relative overflow-hidden"
              >
                {coverImage ? (
                  <div className="absolute inset-0 group-hover:opacity-40 transition-opacity">
                    <img src={URL.createObjectURL(coverImage)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <HiUpload className="text-slate-400 text-4xl group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                  <div>
                    <p className="text-slate-700 font-bold">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-xs mt-1">PNG, JPG, or GIF</p>
                  </div>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Blog Content</h2>
            </div>
            <div className="p-8">
              <div className="quill-wrapper">
                <ReactQuill
                  style={{ height: '300px' }}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                  className="bg-white rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
