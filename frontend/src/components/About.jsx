import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollVelocity from "./ScrollVelocity";
import Journey from "./Journey";
gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const valuesRef = useRef(null);
  const innovationRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.fromTo(
        ".hero-char",
        {
          opacity: 0,
          y: 100,
          rotationX: 90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Timeline animation
      gsap.fromTo(
        ".timeline-item",
        {
          opacity: 0,
          x: -100,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
      // Timeline animation - Scroll based progressive reveal
      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 100,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%", // starts when item enters viewport
              end: "top 40%", // ends at mid viewport
              scrub: 1.2, // scrub creates smooth scroll-based animation
            },
          },
        );
      });

      // Timeline line fill animation (scroll-based)
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        },
      );

      // Innovation sphere animation
      gsap.fromTo(
        ".innovation-sphere",
        {
          scale: 0,
          rotation: -180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: innovationRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Floating particles animation
      gsap.to(".floating-particle", {
        y: -30,
        rotation: 360,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

      // Continuous rotation for spheres
      gsap.to(".rotating-sphere", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Innovation image scroll animation
      // const innovationImage = innovationRef.current?.querySelector('.innovation-image-wrapper');

      // if (innovationImage) {
      //   gsap.fromTo(
      //     innovationImage,
      //     {
      //       width: '90%',
      //       y: 100,
      //       opacity: 0,
      //     },
      //     {
      //       width: '100%',
      //       y: 0,
      //       opacity: 1,
      //       duration: 1.8,
      //       ease: "power3.out",
      //       scrollTrigger: {
      //         trigger: innovationRef.current,
      //         start: "top 60%",        // 60% se start
      //         end: "top 30%",          // end when top of section hits 30% of viewport
      //         scrub: 1.5,              // smooth scrubbing
      //         // toggleActions: "play reverse play reverse", // optional
      //       },
      //     }
      //   );
      // }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  // Innovation image scroll animation
  // const innovationImage = innovationRef.current?.querySelector('.innovation-image-wrapper');
  // if (innovationImage) {
  //  gsap.fromTo(
  //   innovationImage,
  //   { width: '50%', y: 80, opacity: 1 },
  //   {
  //     width: '90%',
  //     y: 0,
  //     opacity: 1,
  //     ease: 'none', // scrub ke sath best combination for pure scroll-based motion
  //     scrollTrigger: {
  //       trigger: innovationRef.current,
  //       start: 'top 80%',
  //       end: 'top 20%',
  //       scrub: 1.2, // 1.2 = thoda lag smoothness add karta hai
  //       markers: true, // debug ke liye rakh sakta hai
  //     },
  //   }
  // );

  // }
  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="hero-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#151316] to-[#1a181b] relative overflow-hidden pb-40"
      data-scroll-section
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large rotating spheres */}
        <div
          className="rotating-sphere absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-xl"
          style={{
            background:
              "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
          }}
        ></div>
        <div
          className="rotating-sphere absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-5 blur-2xl"
          style={{
            background:
              "linear-gradient(90deg,#20469B 37.08%,#D22D1E 62.26%,#963AB0 99.82%)",
          }}
        ></div>

        {/* Floating particles */}
        <div
          className="floating-particle absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-60"
          style={{ background: "#D22D1E" }}
        ></div>
        <div
          className="floating-particle absolute top-1/3 right-1/3 w-3 h-3 rounded-full opacity-40"
          style={{ background: "#963AB0" }}
        ></div>
        <div
          className="floating-particle absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full opacity-50"
          style={{ background: "#20469B" }}
        ></div>
        <div
          className="floating-particle absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full opacity-70"
          style={{ background: "#D22D1E" }}
        ></div>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative z-10 pt-20 md:pt-32 pb-10 md:pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-9xl font-black mb-8 text-white leading-none">
            {splitText("REDEFINING")}
          </h1>
          <h2 className="text-6xl md:text-8xl font-black mb-12">
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #D22D1E 37.08%, #963AB0 62.26%, #20469B 99.82%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              EDUCATION
            </span>
          </h2>

          <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Where artificial intelligence meets human potential. We're building
            the future of data science education, one innovator at a time.
          </p>
        </div>
      </div>

      {/* Innovation Sphere */}
      {/* Innovation Image Section */}
      {/* Innovation Image Section with Scroll Animation */}
      {/* <div ref={innovationRef} className="relative z-10 py-20 pt-0">
  <div className="container mx-auto px-6 flex justify-center">
    <div 
      className="innovation-image-wrapper w-[90%] sm:w-[90%] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
      style={{ transform: 'translateY(100px)', opacity: 0 }} // initial state
    >
      <img
        src="/images/innovation-lab.jpeg"
        alt="Innovation at The Data Science Academy"
        className="w-full h-auto object-cover block"
        style={{ borderRadius: "1.5rem" }}
      />
    </div>
  </div>
</div> */}

      {/* Innovation Image Section - Static (No Animation) */}
      <div ref={innovationRef} className="relative z-10 py-10 md:py-20 pt-0">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="innovation-image-wrapper w-[90%] sm:w-[90%] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img
              src="/images/innovation-lab.jpeg"
              alt="Innovation at The Data Science Academy"
              className="w-full h-auto object-cover block"
              style={{ borderRadius: "1.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {/* Timeline Section - Premium Version */}
      {/* <div ref={timelineRef} className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center mb-24 tracking-wide">
            OUR{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                background: "linear-gradient(90deg, #D22D1E 30%, #963AB0 60%, #20469B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JOURNEY
            </span>
          </h3> */}

      {/* Vertical Timeline with Connecting Line */}
      {/* <div className="max-w-5xl mx-auto relative"> */}
      {/* Animated vertical line */}
      {/* <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D22D1E] via-[#963AB0] to-[#20469B] opacity-30 transform md:-translate-x-1/2"></div> */}

      {/* {[
              { 
                year: "2020", 
                title: "Foundation", 
                desc: "Started with a vision to transform data science education",
                gradient: "from-[#D22D1E]/20 to-[#D22D1E]/5"
              },
              { 
                year: "2021", 
                title: "Growth", 
                desc: "Expanded to 10,000+ students across 50+ countries",
                gradient: "from-[#963AB0]/20 to-[#963AB0]/5"
              },
              { 
                year: "2022", 
                title: "Innovation", 
                desc: "Launched AI-powered learning platform",
                gradient: "from-[#20469B]/20 to-[#20469B]/5"
              },
              { 
                year: "2023", 
                title: "Excellence", 
                desc: "Achieved 95% career success rate",
                gradient: "from-[#D22D1E]/20 to-[#963AB0]/5"
              },
              { 
                year: "2024", 
                title: "Future", 
                desc: "Pioneering next-gen AI curriculum",
                gradient: "from-[#963AB0]/20 to-[#20469B]/5"
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`timeline-item relative mb-24 last:mb-0 ${
                  index % 2 === 0 ? 'md:pr-[50%] md:pl-0' : 'md:pl-[50%] md:pr-0'
                }`}
              > */}
      {/* Timeline dot */}
      {/* <div className={`timeline-dot absolute left-8 md:left-1/2 top-8 w-6 h-6 rounded-full transform md:-translate-x-1/2 z-10 border-4 border-[#151316] ${
                  index === 0 ? 'bg-[#D22D1E]' :
                  index === 1 ? 'bg-[#963AB0]' :
                  index === 2 ? 'bg-[#20469B]' :
                  index === 3 ? 'bg-[#D22D1E]' : 'bg-[#963AB0]'
                } shadow-lg shadow-white/20`}></div> */}

      {/* Content card */}
      {/* <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                  <div className={`group relative p-8 rounded-3xl bg-gradient-to-br ${item.gradient} backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden`}> */}
      {/* Animated gradient overlay on hover */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div> */}

      {/* <div className="relative z-10"> */}
      {/* Year badge */}
      {/* <div className="inline-block mb-4 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-3xl font-black bg-clip-text text-transparent" style={{
                          backgroundImage: "linear-gradient(90deg, #D22D1E 37.08%, #963AB0 62.26%, #20469B 99.82%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {item.year}
                        </span>
                      </div> */}

      {/* <h4
  className="text-4xl font-black text-white mb-4 transition-all duration-300 
             group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r 
             group-hover:from-[#D22D1E] group-hover:via-[#963AB0] group-hover:to-[#20469B]"
>
  {item.title} */}
      {/* </h4>

                      <p className="text-lg text-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div> */}

      {/* Decorative corner elements */}
      {/* <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-3xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <Journey />

      {/* Values Section */}
      <div ref={valuesRef} className="relative z-10 py-20">
        <div className="container mx-auto px-3 md:px-6">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center mb-16 tracking-wide">
            OUR{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                background:
                  "linear-gradient(90deg, #D22D1E 30%, #963AB0 60%, #20469B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              VALUES
            </span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🚀",
                title: "Innovation",
                desc: "Pushing boundaries in education technology",
              },
              {
                icon: "🌟",
                title: "Excellence",
                desc: "Setting new standards in learning outcomes",
              },
              {
                icon: "🤝",
                title: "Community",
                desc: "Building global networks of innovators",
              },
              {
                icon: "💡",
                title: "Creativity",
                desc: "Fostering original thinking and solutions",
              },
              {
                icon: "🌍",
                title: "Impact",
                desc: "Creating real-world change through education",
              },
              {
                icon: "⚡",
                title: "Agility",
                desc: "Adapting to the rapidly evolving tech landscape",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="value-card group p-5 md:p-8 rounded-2xl  md:rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-2xl md:text-4xl mb-1 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-4">
                  {value.title}
                </h4>
                <p className="text-xs md:text-sm md:text-gray-300 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-10 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-white text-center mb-2 md:mb-10 tracking-wide leading-tight">
              READY TO{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  background:
                    "linear-gradient(90deg, #D22D1E 30%, #963AB0 60%, #20469B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SHAPE
              </span>{" "}
              THE FUTURE?
            </h3>

            <p className="text-base md:text-xl  text-gray-300 mb-12 leading-relaxed">
              Join thousands of innovators who are already transforming their
              careers with cutting-edge data science education.
            </p>
            <button
              onClick={() => (window.location.href = "#courses")}
              className="px-8 md:px-16 py-3 md:py-5 rounded-md md:rounded-2xl font-semibold md:font-bold text-xl md:text-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
                color: "white",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
              <span className="relative flex items-center space-x-4">
                <span>START YOUR JOURNEY</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  ⟶
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-[300px] flex items-center justify-center">
        <ScrollVelocity
          texts={["The Data Science Academy", "Academy of the Future"]}
          // velocity={velocity}
          className="custom-scroll-text] pt-10"
        />
      </div>
    </section>
  );
};

export default AboutUs;
