import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/faculty/register`, formData);

      setMessage('Faculty registered successfully! Taking you to login...');

      setTimeout(() => {
        navigate('/faculty/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-800">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Faculty Registration</h2>
            <p className="text-zinc-400 text-sm">Create your account to get started</p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="p-4 rounded-2xl mb-6 text-sm text-center font-medium bg-green-900/20 text-green-400 border border-green-800">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl mb-6 text-sm text-center font-medium bg-red-900/20 text-red-400 border border-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                disabled={loading}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-4 rounded-xl transform transition duration-200 shadow-lg text-lg flex items-center justify-center gap-3
                ${loading
                  ? 'bg-cyan-800 text-cyan-300 cursor-not-allowed'
                  : 'bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-[1.02]'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-sm text-zinc-400">
            Already have an account?{' '}
            <a href="/faculty/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition">
              Sign in here
            </a>
          </p>

          {/* Footer */}
          <div className="text-center mt-10">
            <p className="text-xs text-zinc-600">© 2025 Your Institute • Faculty Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegister;