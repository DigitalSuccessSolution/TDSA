import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddClass = () => {
  const [formData, setFormData] = useState({
    subjectName: '',
    classLink: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subjectName || !formData.classLink || !formData.date) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date)
      };

      await axios.post('http://localhost:5000/api/faculty/class', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('facultyToken')}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Class added successfully!');
      navigate('/faculty/dashboard');
    } catch (err) {
      console.error('Add Class Error:', err.response || err);
      alert(err.response?.data?.message || 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #D22D1E, transparent 70%)" }}></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #20469B, transparent 70%)" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #963AB0, transparent 70%)" }}></div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-zinc-800 ">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-3">Add New Class</h1>
            <p className="text-zinc-400 text-lg">Create a new live session for your students</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Subject Name</label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="e.g., Advanced React & Node.js"
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Class Link */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Class Link (Zoom / Google Meet)</label>
              <input
                type="url"
                name="classLink"
                value={formData.classLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/abc-xyz-123"
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Schedule Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 relative py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${
                  loading 
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#D22D1E] via-[#963AB0] to-[#20469B] text-white shadow-xl hover:shadow-cyan-500/30'
                } group`}
              >
                <span className="relative z-10">
                  {loading ? 'Adding Class...' : 'Add Class'}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/faculty/dashboard')}
                className="flex-1 py-5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-bold hover:bg-zinc-700 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/faculty/dashboard')}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition flex items-center mx-auto gap-2"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-xs text-zinc-600">
          © 2025 Your Institute • Faculty Portal
        </p>
      </div>
    </div>
  );
};

export default AddClass;