import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navigation ke liye
import { HashLink } from "react-router-hash-link";
import { AuthContext } from "../context/AuthContext"; // Auth Context import karein
import { User, LogOut, LogIn, X, Menu } from "lucide-react"; // Icons for better UI
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // User data aur logout function lein
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/#courses" }, // Assuming homepage sections
    { name: "About", href: "/#about" },
    { name: "Success Stories", href: "/#testimonials" },
    // { name: "Contact", href: "/#contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 50 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <nav className="relative z-50 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Clean White Version */}
            <Link to="/" className="flex items-center space-x-3 relative z-50">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/images/tdsalogo-wbg.png"
                  alt="The DataScience Academy Logo"
                  className="w-14 object-contain mt-0"
                />
              </div>
              <span className="text-white font-bold text-xl tracking-tight leading-tight">
                The DataScience
                <br /> <span className="text-gray-300">Academy</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <HashLink
                  smooth
                  key={item.name}
                  to={item.href}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#D22D1E] to-[#963AB0] transition-all duration-300 group-hover:w-full"></span>
                </HashLink>
              ))}
            </div>

            {/* CTA Buttons (Login / User Profile) */}
            <div className="hidden lg:flex items-center space-x-6">
              {user ? (
                // --- VIEW IF LOGGED IN ---
                <div className="flex items-center gap-4">
                  {/* User Name Display */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                    <User size={18} className="text-[#D22D1E]" />
                    <span className="text-white font-medium capitalize">
                      {user.name || "Student"}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                // --- VIEW IF NOT LOGGED IN ---
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                >
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] -z-10" />

              <div className="flex flex-col items-center space-y-8 w-full px-8">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    className="w-full text-center"
                  >
                    <HashLink
                      smooth
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-3xl font-semibold text-white/80 hover:text-white hover:scale-105 transition-all duration-300"
                    >
                      {item.name}
                    </HashLink>
                  </motion.div>
                ))}

                <motion.div
                  variants={itemVariants}
                  className="pt-8 w-full max-w-xs space-y-4"
                >
                  {user ? (
                    <>
                      <div className="flex items-center justify-center gap-3 text-white text-xl font-medium mb-4">
                        <User size={24} className="text-[#D22D1E]" />
                        Hello, {user.name}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-red-600 to-red-800 rounded-xl hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300"
                      >
                        <LogOut size={22} /> Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300"
                    >
                      <LogIn size={22} /> Login
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
