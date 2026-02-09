import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const from = location.state?.from?.pathname || '/my-courses';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            login(data.user, data.token);

            // Redirect user
            navigate(from, { replace: true });

        } catch (err) {
            const errorMessage = err.message.includes('Failed to fetch')
                ? 'Server connection error. Please check your network and try again.'
                : err.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. Main Background: Pure Black with subtle gradient
        <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-fuchsia-950/10 opacity-90"></div>

            {/* 2. Login Card Container */}
            <div className="relative z-10 w-full max-w-sm overflow-hidden 
                       bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl 
                       shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in duration-700">

                {/* === HEADER IMAGE / BANNER === */}
                <div className="h-32 w-full relative">
                    {/* Abstract Background Image */}
                    <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: "url('https://source.unsplash.com/random/800x400/?abstract,digital,network')" }}
                    >
                        {/* Gradient Overlay */}
                        <div className="h-full w-full bg-gradient-to-t from-zinc-900/90 to-transparent"></div>
                    </div>
                    {/* Icon Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <KeyRound className="w-12 h-12 text-white bg-fuchsia-600/50 backdrop-blur-sm p-2 rounded-full border border-fuchsia-400 shadow-xl" />
                    </div>
                </div>

                {/* === FORM SECTION === */}
                <div className="p-8 md:p-10 pt-4">

                    {/* Heading */}
                    <div className="text-center mb-8 mt-4">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Login</h2>
                        <p className="text-zinc-500 mt-1 text-sm">Enter credentials to continue learning</p>
                    </div>

                    {/* Error Message */}
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-400 p-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 transition-all duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex justify-center items-center gap-2 ${loading
                                ? 'bg-violet-900 text-violet-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/30'
                                }`}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Login Securely <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    {/* Registration Link */}
                    <p className="mt-6 text-center text-zinc-500 text-xs">
                        Don't have an account? <Link to="/register" className="text-fuchsia-400 hover:text-white font-semibold transition">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;