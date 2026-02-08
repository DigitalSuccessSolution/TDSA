import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaDownload, FaPlay, FaChevronDown, FaChevronUp, FaCheck,
  FaUsers, FaChartLine, FaGraduationCap, FaQuestionCircle, FaBuilding, FaRocket
} from 'react-icons/fa';
import Navigation from './Navigation';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const CourseDetails2 = () => {
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 30 });

  // Refs
  const countersRef = useRef([]);
  const syllabusRef = useRef(null);
  const statsRef = useRef(null);
  const mentorsRef = useRef(null);
  const faqRef = useRef(null);
  const partnersRef = useRef(null);
  const floatingBtnRef = useRef(null);

  // Course Data
  const courseData = {
    title: "AI & Machine Learning Mastery",
    description: "Master the fundamentals and advanced concepts of Artificial Intelligence and Machine Learning with our comprehensive program designed for 2025.",
    duration: "6 Months",
    level: "Intermediate to Advanced",
    price: "₹49,999",
    offerPrice: "₹29,999",
    mentors: [
      { name: "Dr. Sarah Johnson", role: "AI Research Lead @ Google", experience: "10+ years" },
      { name: "Michael Chen", role: "ML Engineer @ Meta", experience: "8+ years" },
      { name: "Priya Sharma", role: "Data Scientist @ Amazon", experience: "7+ years" }
    ],
    curriculum: [
      { title: "Introduction to AI & ML", duration: "2 weeks", topics: ["History and evolution of AI", "Types of Machine Learning", "Real-world applications", "AI ethics and responsible AI"] },
      { title: "Python for Data Science", duration: "3 weeks", topics: ["Python fundamentals", "NumPy and Pandas", "Data visualization", "Data preprocessing"] },
      { title: "Mathematics for ML", duration: "4 weeks", topics: ["Linear Algebra", "Calculus", "Probability", "Statistics"] },
      { title: "Supervised Learning", duration: "5 weeks", topics: ["Regression", "Decision Trees", "SVM", "Model evaluation"] },
      { title: "Deep Learning", duration: "6 weeks", topics: ["Neural Networks", "TensorFlow", "CNN", "RNN"] },
      { title: "Advanced Topics", duration: "4 weeks", topics: ["NLP", "Computer Vision", "RL", "Generative AI"] },
      { title: "Capstone Project", duration: "4 weeks", topics: ["Live industry project", "Deployment", "Presentation"] }
    ],
    stats: { placementRate: 94, averageSalary: 125000, studentCount: 2500, completionRate: 89 },
    faqs: [
      { q: "Is this course suitable for beginners?", a: "This course is designed for intermediate to advanced learners. Basic Python knowledge is required." },
      { q: "Will I get a certificate?", a: "Yes! Industry-recognized certificate from our institute." },
      { q: "Are there live sessions?", a: "Yes, weekly live sessions + monthly expert talks." },
      { q: "What if I miss a class?", a: "All sessions are recorded with lifetime access." },
      { q: "Do you provide placement?", a: "Yes! 94% placement rate with dedicated placement cell." },
      { q: "EMI available?", a: "Yes, 0% interest EMI starting ₹2,500/month." }
    ],
    hiringPartners: [
      { name: "Google", logo: "https://cdn.worldvectorlogo.com/logos/google-2015.svg" },
      { name: "Microsoft", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-6.svg" },
      { name: "Amazon", logo: "https://cdn.worldvectorlogo.com/logos/amazon-2.svg" },
      { name: "Meta", logo: "https://cdn.worldvectorlogo.com/logos/meta-1.svg" },
      { name: "Tesla", logo: "https://cdn.worldvectorlogo.com/logos/tesla-9.svg" },
      { name: "NVIDIA", logo: "https://cdn.worldvectorlogo.com/logos/nvidia-1.svg" },
      { name: "OpenAI", logo: "https://cdn.worldvectorlogo.com/logos/openai-2.svg" },
      { name: "Apple", logo: "https://cdn.worldvectorlogo.com/logos/apple-2.svg" },
      { name: "Netflix", logo: "https://cdn.worldvectorlogo.com/logos/netflix-4.svg" },
      { name: "IBM", logo: "https://cdn.worldvectorlogo.com/logos/ibm-2.svg" }
    ]
  };

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Number Counter Animation
  useEffect(() => {
    countersRef.current.forEach((el, i) => {
      if (!el) return;
      const target = Object.values(courseData.stats)[i];
      const isSalary = i === 1;
      gsap.fromTo(el, 
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          onUpdate: function() {
            if (isSalary) {
              el.innerHTML = "$" + Math.round(this.targets()[0].innerHTML).toLocaleString();
            } else {
              el.innerHTML = Math.round(this.targets()[0].innerHTML) + (i === 0 || i === 3 ? "%" : "+");
            }
          }
        }
      );
    });
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    // Syllabus
    gsap.fromTo(syllabusRef.current?.children, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
      scrollTrigger: { trigger: syllabusRef.current, start: 'top 80%' }
    });

    // Mentors
    gsap.fromTo(mentorsRef.current?.children, { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.2,
      scrollTrigger: { trigger: mentorsRef.current, start: 'top 80%' }
    });

    // FAQ
    gsap.fromTo(faqRef.current?.children, { x: -40, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.7, stagger: 0.1,
      scrollTrigger: { trigger: faqRef.current, start: 'top 80%' }
    });

    // Floating Button
    gsap.to(floatingBtnRef.current, {
      y: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  const toggleChapter = (i) => setActiveChapter(activeChapter === i ? null : i);
  const toggleFaq = (i) => setActiveFaq(activeFaq === i ? null : i);
  const handleEnroll = () => {
    window.open("https://rzp.io/l/ai-ml-mastery-2025", "_blank");
  };

  return (
    <>
      {/* Sticky Floating Enroll Button */}
      <button
        ref={floatingBtnRef}
        onClick={handleEnroll}
        className="fixed bottom-6 right-6 z-50 group bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-all duration-300 animate-bounce"
      >
        <FaRocket className="text-xl" />
        Enroll Now @ ₹29,999
      </button>

      <section className="min-h-screen relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-purple-500 rounded-full opacity-30 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + i % 3}s infinite ease-in-out ${i % 2 === 0 ? 'reverse' : ''}`
            }}
          />
        ))}

        <div className="absolute top-0 left-0 w-full z-20">
          <Navigation />
        </div>

        <div className="container mt-20 mx-auto px-6 relative z-10">

          {/* Hero */}
          <div className="max-w-5xl mx-auto text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              AI & ML <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Mastery</span> 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">{courseData.description}</p>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4">
                <span className="text-gray-300">Duration: </span>
                <span className="text-white font-bold">{courseData.duration}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4">
                <span className="text-gray-300">Level: </span>
                <span className="text-white font-bold">{courseData.level}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button onClick={handleEnroll} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 px-12 rounded-2xl text-xl hover:scale-105 transition-all shadow-2xl">
                Enroll Now @ ₹29,999 <s className="ml-2">₹49,999</s>
              </button>
              <button onClick={() => alert("Brochure Downloaded!")} className="border-2 border-white/30 text-white py-5 px-10 rounded-2xl hover:bg-white/10 transition-all">
                <FaDownload className="inline mr-2" /> Download Brochure
              </button>
            </div>

            <div className="mt-8 bg-red-600/20 border border-red-500/50 rounded-2xl p-6 inline-block">
              <p className="text-white text-lg">
                Offer Ends In: <span className="font-bold text-2xl">
                  {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                </span>
              </p>
            </div>
          </div>

          {/* Video + Syllabus */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {!isVideoPlaying ? (
                  <div onClick={() => setIsVideoPlaying(true)} className="relative h-96 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center cursor-pointer group">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-all">
                      <FaPlay className="text-white text-4xl ml-2" />
                    </div>
                    <div className="absolute bottom-6 left-6 text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-xl">
                      Watch Course Preview
                    </div>
                  </div>
                ) : (
                  <div className="h-96 bg-gray-900 flex items-center justify-center">
                    <p className="text-white text-3xl">Course Video Playing...</p>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <button onClick={handleEnroll} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-6 rounded-2xl text-xl hover:scale-105 transition-all shadow-2xl">
                  Secure Your Seat Now
                </button>
              </div>
            </div>

            {/* Syllabus */}
            <div ref={syllabusRef}>
              <h3 className="text-4xl font-bold text-white mb-8">Course Curriculum</h3>
              <div className="space-y-4">
                {courseData.curriculum.map((chapter, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-6 text-left text-white font-semibold hover:bg-white/5 transition-all"
                      onClick={() => toggleChapter(i)}
                    >
                      <div>
                        <span className="text-xl">{chapter.title}</span>
                        <span className="text-sm text-gray-400 ml-4">({chapter.duration})</span>
                      </div>
                      {activeChapter === i ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {activeChapter === i && (
                      <div className="px-6 pb-6">
                        <ul className="space-y-3">
                          {chapter.topics.map((t, ti) => (
                            <li key={ti} className="flex items-start text-gray-300">
                              <FaCheck className="mt-1 mr-3 text-purple-400 flex-shrink-0" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats with Counter */}
          <div ref={statsRef} className="max-w-6xl mx-auto mb-24">
            <h3 className="text-4xl font-bold text-white text-center mb-16">Why Students Love Us</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: FaUsers, label: "Placement Rate" },
                { icon: FaChartLine, label: "Avg Salary" },
                { icon: FaGraduationCap, label: "Students Trained" },
                { icon: FaCheck, label: "Completion Rate" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                  <stat.icon className="text-5xl text-purple-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2" ref={el => countersRef.current[i] = el}>0</div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rest of sections (Mentors, FAQ, Partners, Features) */}
          {/* (Same as before but cleaner) */}

          {/* Hiring Partners */}
          <div ref={partnersRef} className="max-w-7xl mx-auto mb-24 overflow-hidden">
            <h3 className="text-4xl font-bold text-white text-center mb-16">Trusted by Top Companies</h3>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
              <div className="flex animate-slide">
                {[...courseData.hiringPartners, ...courseData.hiringPartners].map((p, i) => (
                  <div key={i} className="flex-shrink-0 mx-12 group">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl p-6 flex items-center justify-center hover:scale-110 transition-all">
                      <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide { animation: slide 30s linear infinite; }
        .animate-slide:hover { animation-play-state: paused; }
      `}</style>
    </>
  );
};

export default CourseDetails2;