// components/Hero.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { FaChevronDown } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const split = new SplitText(textRef.current, {
      type: "chars,words,lines",
      linesClass: "split-line",
    });

    const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });

    // Animate text entry and keep it visible
    tl.fromTo(
      split.chars,
      { opacity: 0, y: 80, rotationX: 90, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        stagger: 0.04,
        duration: 1.2,
      }
    );

    // Animate subtitle fade-in
    tl.to(
      ".hero-subtext",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Animate floating elements
    gsap.to(".floating-element", {
      y: -20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    // Scroll indicator fade-in
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.3"
    );

    return () => {
      split.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      data-scroll-section
    >
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#151316] to-[#1a181b]">
        {/* Subtle brand gradient overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)"
          }}
        ></div>
      </div>

      {/* Floating Data Science Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural Network Nodes */}
        <div className="floating-element absolute top-20 left-10 w-3 h-3 bg-white rounded-full opacity-20"></div>
        <div className="floating-element absolute top-40 right-20 w-2 h-2 bg-white rounded-full opacity-15"></div>
        <div className="floating-element absolute bottom-40 left-20 w-4 h-4 bg-white rounded-full opacity-25"></div>
        <div className="floating-element absolute bottom-20 right-10 w-3 h-3 bg-white rounded-full opacity-20"></div>
        
        {/* Tiny gradient dots */}
        <div className="floating-element absolute top-32 left-1/3 w-1 h-1 rounded-full opacity-40" style={{background: "#D22D1E"}}></div>
        <div className="floating-element absolute bottom-32 right-1/3 w-1 h-1 rounded-full opacity-40" style={{background: "#963AB0"}}></div>
        <div className="floating-element absolute top-48 right-48 w-1 h-1 rounded-full opacity-40" style={{background: "#20469B"}}></div>
      </div>

      {/* Text Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1
          ref={textRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-white"
        >
          The{" "}
          <span 
            className="inline-block"
            style={{
              background: "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              // WebkitBackgroundClip: "text",
              // WebkitTextFillColor: "transparent",
              // backgroundClip: "text"
            }}
          >
            Data Science
          </span>{" "}
          Academy
        </h1>
        <p className="hero-subtext text-lg sm:text-xl md:text-2xl text-white opacity-0 translate-y-3 font-light">
          Shaping the{" "}
          <span 
            className="font-bold inline-block"
            style={{
              background: "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Future
          </span>{" "}
          of Data Science Education
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center hero-subtext opacity-0 translate-y-3">
          <button 
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              color: "white"
            }}
          >
            Start Learning Today
          </button>
          <HashLink smooth to="#courses"  className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-[#151316] transition-all duration-300 transform hover:-translate-y-1">
            View Courses
          </HashLink>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0"
      >
        <span className="text-white text-sm mb-2">Scroll to Explore</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div 
            className="w-1 h-3 rounded-full animate-bounce mt-1"
            style={{
              background: "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)"
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;