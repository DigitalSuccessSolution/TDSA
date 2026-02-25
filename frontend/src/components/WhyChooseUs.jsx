import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Rocket,
  Users,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reasons = [
  {
    icon: UserCheck,
    title: "Personalized Learning Experience",
    desc: "Your journey is unique — and so is our approach. With regular doubt-clearing sessions and programs tailored to your pace, goals, and career aspirations, we ensure you receive the guidance and mentorship needed to thrive.",
  },
  {
    icon: Briefcase,
    title: "Hands-On, Real-World Projects",
    desc: "Move beyond theory by working on live projects that mirror industry challenges. Build a portfolio that showcases your skills, demonstrates your problem-solving ability, and makes you stand out to top employers.",
  },
  {
    icon: TrendingUp,
    title: "Placement Support & Career Growth",
    desc: "Gain access to paid internship opportunities with stipends of up to ₹25,000. Our dedicated placement team works with you to secure high-impact roles in leading organizations, setting you on a path to long-term success.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Outcomes",
    desc: "We stand by our promise: if you complete a course and are not offered a placement or internship opportunity, you are eligible for a full fee refund. Your career growth is our commitment.",
  },
  {
    icon: Rocket,
    title: "Future-Ready Skills",
    desc: "Stay ahead of the curve with a curriculum designed to evolve alongside emerging technologies and industry trends. From AI to advanced analytics, we prepare you for the challenges and opportunities of the future.",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    desc: "Learn directly from seasoned professionals and industry leaders who bring real-world expertise into the classroom. Gain insider knowledge, practical tips, and career guidance that textbooks can’t provide.",
  },
  {
    icon: Globe,
    title: "Community & Networking",
    desc: "Become part of a vibrant community of learners, alumni, and industry experts. Build connections, collaborate on projects, and open doors to opportunities through a strong professional network.",
  },
];

const WhyChooseUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsToShow = isMobile ? 1 : 2;
  const maxIndex = reasons.length - cardsToShow;

  const gradients = ["bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]"];

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        next();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, maxIndex, isMobile]);

  return (
    <section className="relative py-24 bg-[#151316] overflow-hidden">
      {/* Background Glow - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block absolute top-20 -left-20 w-[600px] h-[600px] bg-[#963AB0]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side Content */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Why <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D22D1E] via-[#963AB0] to-[#20469B]">
                Choose Us
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              The Data Science Academy is more than just an educational
              institution — it's your launchpad for a future-proof career.
            </p>

            {/* Slider Controls */}
            <div className="flex space-x-4 pt-8">
              <button
                onClick={prev}
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-[#D22D1E] hover:to-[#963AB0] transition-all duration-300 border border-white/10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-[#963AB0] hover:to-[#20469B] transition-all duration-300 border border-white/10"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Right Side Cards Slider */}
          <div
            className="lg:col-span-8 overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {reasons.map((step, idx) => (
                <div key={idx} className="min-w-full md:min-w-[50%] px-4">
                  <div className="relative pt-10 group">
                    {/* Floating Circle Cutout Area - Top Right */}
                    <div className="absolute top-3 right-0 z-20">
                      <div className="bg-[#151316] p-4 rounded-bl-[4rem] -mr-px -mt-px group-hover:p-3 transition-all duration-300">
                        <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative z-30 border border-white/20">
                          {/* Icon Container - Now Transparent */}
                          <div
                            className={`w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                          >
                            <step.icon className="w-8 h-8 text-[#963AB0]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Card Body */}
                    <div
                      className={`rounded-[2.5rem] p-8 pt-12 min-h-[420px] flex flex-col justify-between relative z-10 transition-all duration-500 border border-white/10 group-hover:border-white/20 group-hover:-translate-y-2 ${
                        gradients[idx % gradients.length]
                      }`}
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase mb-2">
                            Feature {String(idx + 1).padStart(2, "0")}
                          </p>
                          <h4 className="text-3xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-white transition-all">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                          {step.desc}
                        </p>
                      </div>

                      <div className="pt-6 mt-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-px bg-white/40" />
                          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">
                            The Data Science Academy
                          </span>
                        </div>
                      </div>

                      {/* Subtle Overlay on hover */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
