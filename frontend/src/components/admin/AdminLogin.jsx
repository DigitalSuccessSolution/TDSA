import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for a smoother feel
    setTimeout(() => {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("adminAuthenticated", "true");
        toast.success("Welcome back, Admin!");
        navigate("/admin");
      } else {
        toast.error("Invalid Credentials. Access Denied.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Admin Portal
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Secure access required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder-gray-600 font-medium"
                  placeholder="admin@academy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  type="password"
                  required
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all placeholder-gray-600 font-medium"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          Protected by heavy encryption. <br /> Unauthorized access is
          prohibited.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
