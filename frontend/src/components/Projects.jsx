// components/Projects.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaChartLine, FaUsers, FaRocket, FaAward } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      title: "Predictive Analytics Platform",
      description: "Built a real-time prediction system for e-commerce",
      tech: ["Python", "TensorFlow", "React", "AWS"],
      metrics: "98% accuracy",
    },
    {
      title: "Computer Vision for Healthcare",
      description: "Medical image analysis for early disease detection",
      tech: ["PyTorch", "OpenCV", "FastAPI", "Docker"],
      metrics: "95% detection rate",
    },
    {
      title: "Natural Language Chatbot",
      description: "AI-powered customer service automation",
      tech: ["Transformers", "Node.js", "MongoDB", "Redis"],
      metrics: "40% cost reduction",
    },
  ];

  const stats = [
    { icon: FaChartLine, value: "80%", label: "Scholarships Awarded" },
    { icon: FaUsers, value: "100%", label: "Placement Assistance" },
    { icon: FaRocket, value: "500+", label: "Projects Completed" },
    { icon: FaAward, value: "94%", label: "Success Rate" },
  ];

  useEffect(() => {
    // Left Side Animation
    gsap.fromTo(
      leftRef.current,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Right Side Animation
    gsap.fromTo(
      rightRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Auto Rotate Projects
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [projects.length]);

  useEffect(() => {
    // Animate Progress Bars
    stats.forEach((_, index) => {
      gsap.to(`.progress-bar-${index}`, {
        width: '100%',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.progress-bar-${index}`,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-20 bg-gradient-to-br from-[#151316] to-[#1a181b]"
      data-scroll-section
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Projects Carousel */}
          <div ref={leftRef} className="space-y-8">
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-pulse">
              Hands-on Projects
            </h2>

            <div className="relative h-80">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentProject ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 h-full hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-1000 rounded-3xl"></div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-6 flex-grow">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-white/10 text-gray-200 rounded-full text-sm border border-white/15"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="text-white font-bold text-lg bg-white/10 px-4 py-2 rounded-xl border border-white/15 inline-block self-start">
                        {project.metrics}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProject ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Career Stats */}
          <div ref={rightRef} className="space-y-8">
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-pulse">
              Career Success
            </h2>

            <div className="space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="group space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 group-hover:bg-white/15 transition-all duration-300">
                        <stat.icon className="text-white text-lg" />
                      </div>
                      <span className="text-white font-semibold text-lg">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-white font-bold text-2xl">
                      {stat.value}
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`progress-bar-${index} h-2 rounded-full bg-gradient-to-r from-[#0a1569] to-[#1e40af] transition-all duration-1000`}
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="relative w-full py-4 bg-gradient-to-r from-[#0a1569] to-[#1e40af] rounded-xl text-white font-bold text-lg hover:from-[#1e40af] hover:to-[#0a1569] transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 group/btn overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-all duration-700"></div>
              <span className="relative">Start Your Journey Today</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;