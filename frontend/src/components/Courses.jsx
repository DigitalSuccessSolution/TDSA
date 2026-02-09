import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

gsap.registerPlugin(ScrollTrigger);

// Extracted CourseCard component for reuse
const CourseCard = ({ course, index, openCurriculum, className }) => (
  <div className={`flex-shrink-0 ${className}`}>
    <div className="group relative bg-linear-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-lg md:rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-500 mx-auto">
      <div className="relative h-52 w-full overflow-hidden bg-gray-800">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.subject}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-linear-to-br from-purple-600/20 to-blue-600/20">
            <span className="text-6xl font-bold text-gray-500">
              {course.subject[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"></div>
      </div>

      <div className="p-3 md:p-6 flex flex-col h-[15rem] md:h-[20rem]">
        <div className="flex justify-between items-center mb-5">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#D22D1E]/40 to-[#20469B]/40 border border-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{index + 1}</span>
          </div>
          <div
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${course.level === "Beginner"
                ? "bg-green-500/15 text-green-300 border-green-400/20"
                : course.level === "Intermediate"
                  ? "bg-yellow-500/15 text-yellow-300 border-yellow-400/20"
                  : "bg-purple-500/15 text-purple-300 border-purple-400/20"
              }`}
          >
            {course.level}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-white mb-0 md:mb-2">
          {course.subject}
        </h3>
        <p className="text-gray-300 text-xs md:text-sm mb-0 md:mb-5 flex-grow line-clamp-3">
          {course.description}
        </p>

        <div className="flex justify-between items-center py-2 border-b border-white/10 mb-0 md:mb-5">
          <span
            className="font-semibold text-transparent bg-clip-text text-lg"
            style={{
              background: "linear-gradient(90deg,#D22D1E,#963AB0,#20469B)",
              WebkitBackgroundClip: "text",
            }}
          >
            Duration
          </span>
          <span className="text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            {course.duration}
          </span>
        </div>

        <button
          onClick={() => openCurriculum(course.subject)}
          className="relative w-full py-3 rounded-xl text-white font-semibold overflow-hidden cursor-pointer"
          style={{
            background:
              "linear-gradient(90deg,rgba(210,45,30,0.8),rgba(150,58,176,0.8),rgba(32,70,155,0.8))",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
          <span className="relative">View Course Details</span>
        </button>
      </div>
    </div>
  </div>
);

const Courses = () => {
  const sectionRef = useRef(null);
  const horizontalRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || courses.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop Only Animation (Horizontal Scroll)
      mm.add("(min-width: 1024px)", () => {
        // Slight delay to ensure DOM is ready
        setTimeout(() => {
          if (!horizontalRef.current || !sectionRef.current) return;

          const totalWidth = horizontalRef.current.scrollWidth;
          const viewportWidth = window.innerWidth;
          const scrollDistance = totalWidth - viewportWidth + 100;

          gsap.to(horizontalRef.current, {
            x: () => -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }, 100);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [courses, loading]);

  const openCurriculum = (subject) => {
    const slug = subject.toLowerCase().replace(/\s+/g, "-");
    navigate(`/curriculum/${slug}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-4xl text-white">
        Loading...
      </div>
    );
  if (courses.length === 0)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400 text-2xl">
        No courses yet.
      </div>
    );

  return (
    <div className="relative w-full">
      <section
        id="courses"
        ref={sectionRef}
        className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#151316] to-[#1a181b] pt-0 md:pt-24"
      >
        {/* Background spheres */}
        <div className="absolute inset-0 overflow-hidden py-10">
          <div
            className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-xl"
            style={{
              background:
                "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
            }}
          ></div>
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-5 blur-2xl"
            style={{
              background:
                "linear-gradient(90deg,#20469B 37.08%,#D22D1E 62.26%,#963AB0 99.82%)",
            }}
          ></div>
        </div>

        <h2 className="absolute top-8 md:top-8 w-full text-center text-4xl md:text-7xl font-extrabold mb-8 text-white tracking-wide z-10">
          OUR{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              background:
                "linear-gradient(90deg,#D22D1E 37.08%,#963AB0 62.26%,#20469B 99.82%)",
              WebkitBackgroundClip: "text",
            }}
          >
            COURSES
          </span>
        </h2>

        {/* --- MOBILE/TABLET VIEW: CAROUSEL SLIDER --- */}
        <div className="block lg:hidden w-full px-4 pt-32 pb-20">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            showDots={true}
            arrows={false}
            renderDotsOutside={true}
            containerClass="pb-10" // Space for dots
            itemClass="px-2" // Spacing between items
          >
            {courses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
                openCurriculum={openCurriculum}
                className="w-full"
              />
            ))}
          </Carousel>
        </div>

        {/* --- DESKTOP VIEW: HORIZONTAL PINNED SCROLL --- */}
        <div className="hidden lg:flex h-full items-center lg:h-screen w-full">
          <div
            ref={horizontalRef}
            className="flex items-center justify-start space-x-5 px-8 w-full"
          >
            {courses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
                openCurriculum={openCurriculum}
                className="w-[28vw]"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
