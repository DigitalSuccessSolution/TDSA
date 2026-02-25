import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  KeyRound,
  Timer,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const FacultyForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = Email, 2 = OTP, 3 = New Password
  const [step, setStep] = useState(1);

  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/faculty/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success(data.message);
      setStep(2);
      setTimer(60); // Start 60s timer
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/faculty/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      toast.success("OTP Verified Successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/faculty/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      toast.success("Password Reset Successfully! Please Login.");
      navigate("/faculty/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-cyan-900/50">
      <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-950 to-cyan-950/10 opacity-90"></div>

      <div
        className="relative z-10 w-full max-w-sm overflow-hidden 
                       bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl 
                       shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in duration-700"
      >
        {/* Banner */}
        <div className="h-32 w-full relative">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/random/800x400/?technology,code')",
            }}
          >
            <div className="h-full w-full bg-linear-to-t from-zinc-900/90 to-transparent"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ShieldCheck className="w-12 h-12 text-white bg-cyan-600/50 backdrop-blur-sm p-2 rounded-full border border-cyan-400 shadow-xl" />
          </div>
        </div>

        <div className="p-8 md:p-10 pt-4">
          <div className="text-center mb-8 mt-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verification"}
              {step === 3 && "Reset Password"}
            </h2>
            <p className="text-zinc-500 mt-1 text-sm">
              {step === 1 && "Enter your faculty email to receive OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-zinc-500"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-lg bg-linear-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-xl flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Send OTP <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <KeyRound
                  className="absolute left-4 top-3.5 text-zinc-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  required
                  maxLength={4}
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm tracking-widest text-center text-xl font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
                />
              </div>

              <div className="text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
                <Timer size={16} />
                {timer > 0 ? (
                  <span>
                    Resend OTP in{" "}
                    <span className="text-cyan-400 font-bold">{timer}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-cyan-400 hover:text-white font-semibold transition underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-lg bg-linear-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-xl flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Verify & Proceed"
                )}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-zinc-500"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-zinc-500"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-lg bg-linear-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-xl flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-zinc-500 text-xs">
            Remember your password?{" "}
            <Link
              to="/faculty/login"
              className="text-cyan-400 hover:text-white font-semibold transition"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyForgotPassword;
