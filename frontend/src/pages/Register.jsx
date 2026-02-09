import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Check redirects
  const from = location.state?.from?.pathname || '/my-courses';
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      // Auto Login after Register
      login(data.user, data.token);

      // Agar kisi specific URL par bhejna hai (jaise enroll karte waqt)
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(from, { replace: true });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Create Account</h2>
        <p className="text-zinc-400 text-center mb-8">Join us and start learning</p>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-zinc-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-zinc-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl text-white font-bold hover:scale-105 transition flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-white font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;