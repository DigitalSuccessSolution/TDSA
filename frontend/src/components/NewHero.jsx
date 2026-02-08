import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import LightRays from "./LightRays";
import Navigation from "./Navigation";

const NewHero = () => {
  const containerRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } }); // Aapka wala ease

      // 1. 🧠 Exact Re-creation of your requested animation
      tl.fromTo(
        ".char",
        {
          opacity: 0,
          y: 80, // Niche se aayega
          rotateX: 90, // Rotate hoke seedha hoga
          scale: 0.8, // Thoda chota start hoga
          transformOrigin: "50% 50% -50px", // 3D pivot point
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.025, // Aapka fast stagger
          duration: 0.8, // Aapka duration
          force3D: true, // Text crisp rakhne ke liye
        },
      );

      // 2. Subtext appear faster (Same as your code)
      tl.fromTo(
        ".hero-subtext",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.3", // appear sooner
      );

      // 3. Scroll indicator faster too
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ✅ Helper to split text manually (Replaces Paid Plugin)
  const splitText = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="char inline-block"
        style={{
          minWidth: char === " " ? "0.3em" : "auto",
          backfaceVisibility: "hidden", // Text gayab hone se rokta hai
          willChange: "transform, opacity",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#151316]"
    >
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navigation />
      </div>

      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#151316] to-[#1a181b] z-0" />
      <div className="absolute inset-0 scale-125 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#a9b2ff"
          raysSpeed={1.2}
          lightSpread={1.2}
          rayLength={2.0}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.05}
          distortion={0.03}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-screen px-6 pt-24">
        {/* ✅ H1 with Manual Split & 3D Perspective */}
        <h1
          style={{ perspective: "1000px" }} // Important for rotationX effect
          className="text-2xl sm:text-6xl md:text-7xl font-bold mb-2 md:mb-6 text-white leading-tight"
        >
          {/* Line 1 */}
          <div className="block">
            {splitText("May these lights guide you,")}
          </div>

          {/* Line 2 */}
          <div className="block mt-2">{splitText("on your path")}</div>
        </h1>

        <p className="hero-subtext opacity-0 text-lg sm:text-xl md:text-2xl text-white font-light translate-y-3">
          Shaping the{" "}
          <span
            className="font-bold inline-block"
            style={{
              background:
                "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(210,45,30,0.7))",
            }}
          >
            Future
          </span>{" "}
          of Data Science Education
        </p>

        <div className="hero-subtext opacity-0  mt-10 flex  sm:flex-row gap-4 justify-center items-center translate-y-3">
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-4 md:px-8 py-3 md:py-4 rounded-md   md:rounded-xl font-semibold md:font-bold text-md md:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(150,58,176,0.8)]"
            style={{
              background:
                "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              color: "white",
            }}
          >
            Start Learning 
          </button>
          <a
            href="#courses"
            className="px-4 md:px-8 py-3 md:py-4 rounded-md   md:rounded-xl font-semibold md:font-bold text-md md:text-lg border-2 border-white text-white hover:bg-white hover:text-[#151316] transition-all duration-300 transform hover:-translate-y-1 block md:inline-block text-center"
          >
            View Courses
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 z-20"
      >
        <span className="text-white text-sm mb-2">Scroll to Explore</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div
            className="w-1 h-3 rounded-full animate-bounce mt-1"
            style={{
              background:
                "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
