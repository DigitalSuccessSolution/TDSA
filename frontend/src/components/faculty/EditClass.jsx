import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectName: '',
    classLink: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/myclasses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('facultyToken')}` }
        });
        const cls = res.data.find(c => c._id === id);
        if (cls) {
          setFormData({
            subjectName: cls.subjectName,
            classLink: cls.classLink,
            date: new Date(cls.date).toISOString().slice(0, 16)
          });
        }
        setLoading(false);
      } catch (err) {
        alert('Failed to load class');
        navigate('/faculty/dashboard');
      }
    };
    fetchClass();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date)
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/faculty/class/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('facultyToken')}` }
      });

      alert('Class updated successfully!');
      navigate('/faculty/dashboard');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-4xl font-bold text-cyan-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #D22D1E, transparent 70%)" }}></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #20469B, transparent 70%)" }}></div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-zinc-800">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-white mb-3">Edit Class</h1>
            <p className="text-zinc-400">Update your class details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Subject Name</label>
              <input
                type="text"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="e.g., Data Structures & Algorithms"
              />
            </div>

            {/* Class Link */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Class Link (Google Meet / Zoom)</label>
              <input
                type="url"
                value={formData.classLink}
                onChange={(e) => setFormData({ ...formData, classLink: e.target.value })}
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="https://meet.google.com/abc-def-ghi"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full relative py-5 bg-gradient-to-r from-[#D22D1E] via-[#963AB0] to-[#20469B] text-white font-bold text-lg rounded-xl overflow-hidden group shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span className="relative z-10">Update Class</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </form>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/faculty/dashboard')}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-xs text-zinc-600">
          © 2025 Your Institute • Faculty Portal
        </p>
      </div>
    </div>
  );
};

export default EditClass;