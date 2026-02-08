import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaPaperPlane, FaCheck } from "react-icons/fa";

const CTA = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // ✅ added phone field
    interest: "",
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Floating particles animation
    const particles = document.querySelectorAll(".particle");
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: -15,
        x: Math.sin(index) * 10,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Form reveal animation
    gsap.fromTo(
      formRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen relative flex items-center pb-15 pt-15 justify-center overflow-hidden bg-[#151316]"
      data-scroll-section
    >
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#151316] via-[#1a181b] to-[#151316]"></div>

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full blur-sm opacity-20"
          style={{
            background:
              "linear-gradient(90deg,#D22D1E 0%,#963AB0 50%,#20469B 100%)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        ></div>
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center mb-16 tracking-wide">
            Join Us{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                background:
                  "linear-gradient(90deg, #D22D1E 30%, #963AB0 60%, #20469B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Today
            </span>
          </h3>

          <p className="text-lg md:text-2xl text-gray-300 mb-12">
            Start your Data Science journey and transform your career in 2025
          </p>

          {/* Contact Form */}
          <div
            ref={formRef}
            className="bg-[#1a181b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/40"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2 text-left">
                  <label className="text-gray-300 text-sm font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#963AB0]/50 focus:shadow-[0_0_10px_#963AB0] transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2 text-left">
                  <label className="text-gray-300 text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#20469B]/50 focus:shadow-[0_0_10px_#20469B] transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* ✅ Phone Number Field */}
              <div className="space-y-2 text-left">
                <label className="text-gray-300 text-sm font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D22D1E]/50 focus:shadow-[0_0_10px_#D22D1E] transition-all duration-300"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Area of Interest */}
              <div className="space-y-2 text-left">
                <label className="text-gray-300 text-sm font-semibold">
                  Area of Interest
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D22D1E]/50 focus:shadow-[0_0_10px_#D22D1E] transition-all duration-300"
                  required
                >
                  <option value="">Select your interest</option>
                  <option value="ml">Machine Learning</option>
                  <option value="de">Data Engineering</option>
                  <option value="ai">Artificial Intelligence</option>
                  <option value="viz">Data Visualization</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="relative w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg group overflow-hidden border border-white/15"
                style={{
                  background:
                    "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Apply Now</span>
                  <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </form>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              {[
                "No upfront cost",
                "Flexible schedule",
                "1:1 Mentor Support",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-3 text-gray-300"
                >
                  <FaCheck
                    className="text-transparent bg-clip-text"
                    style={{
                      background:
                        "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
