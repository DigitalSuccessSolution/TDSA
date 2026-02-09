import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/faculty/login`, formData);
      localStorage.setItem('facultyToken', res.data.token);
      navigate('/faculty/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-800">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-3">Faculty Login</h2>
            <p className="text-zinc-400 text-sm">Welcome back! Please login to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl mb-6 text-sm text-center font-medium bg-red-900/20 text-red-400 border border-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transform hover:scale-[1.02] transition duration-200 shadow-lg text-lg"
            >
              Login as Faculty
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              New faculty member?{' '}
              <a href="/faculty/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition">
                Register here
              </a>
            </p>
          </div>

          {/* Optional Footer */}
          <div className="mt-10 text-center">
            <p className="text-xs text-zinc-600">© 2025 Your Institute • Faculty Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;