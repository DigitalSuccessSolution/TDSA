// components/Hero.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { FaChevronDown } from "react-icons/fa";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const split = new SplitText(textRef.current, {
      type: "chars,words,lines",
      linesClass: "split-line",
    });

    const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });

    // Animate text entry
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

    // Animate subtitle
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
    tl.fromTo(
      ".floating-element",
      { y: 0 },
      {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      },
      "-=0.5"
    );

    // Scroll indicator
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.3"
    );

    // Background animations
    gsap.to(".gradient-bg", {
      backgroundPosition: "200% 200%",
      duration: 20,
      repeat: -1,
      ease: "linear",
    });

    // Particle animation
    gsap.to(".particle", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      rotation: "random(-180, 180)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.1
    });

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


      <Navigation/>
      {/* Enhanced Animated Gradient Background */}
      <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a103d] to-[#0a0a0a] bg-[size:200%_200%]"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      {/* Floating AI/Data Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Binary Code Stream */}
        <div className="absolute top-1/4 left-10 floating-element text-green-400 opacity-40 font-mono text-sm">
          10101010
        </div>
        <div className="absolute top-3/4 right-20 floating-element text-blue-400 opacity-40 font-mono text-sm">
          11001100
        </div>
        
        {/* Mathematical Symbols */}
        <div className="absolute top-1/3 right-1/4 floating-element text-purple-400 opacity-50 text-xl">
          ∑
        </div>
        <div className="absolute bottom-1/3 left-1/4 floating-element text-cyan-400 opacity-50 text-xl">
          σ
        </div>
        
        {/* Neural Network Nodes */}
        <div className="absolute top-1/2 left-1/3 floating-element">
          <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-2/3 right-1/3 floating-element">
          <div className="w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Animated Particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      {/* Text Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1
          ref={textRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-white"
        >
          The Data Science Academy
        </h1>
        <p className="hero-subtext text-lg sm:text-xl md:text-2xl text-gray-200 opacity-0 translate-y-3 mb-8">
          Shaping the Future of AI & Data Science Education
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Learning
          </button>
          <button className="px-8 py-4 border-2 border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            View Courses
          </button>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0"
      >
        <span className="text-gray-300 text-sm mb-2 tracking-wider">EXPLORE MORE</span>
        <div className="relative">
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent mx-auto"></div>
          <FaChevronDown className="text-white animate-bounce absolute -bottom-2 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
    </section>
  );
};

export default Hero;