import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
const Courses = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 400;
    const scrollAmount = cardWidth + 32; // 32 = gap between cards
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const courses = [
    {
      id: 1,
      title: "Machine Learning Mastery",
      duration: "6 Months",
      level: "Advanced",
      description:
        "Deep dive into ML algorithms, neural networks, and real-world applications.",
      img: "./images/ML.png",
    },
    {
      id: 2,
      title: "Data Engineering",
      duration: "4 Months",
      level: "Intermediate",
      description:
        "Build scalable data pipelines and master big data technologies.",
      img: "./images/dataengineering.png",
    },
    {
      id: 3,
      title: "AI & Deep Learning",
      duration: "8 Months",
      level: "Expert",
      description:
        "Advanced neural networks, transformers, and cutting-edge AI research.",
      img: "./images/Ai.png",
    },
    {
      id: 4,
      title: "Data Visualization",
      duration: "3 Months",
      level: "Beginner",
      description:
        "Create stunning visualizations and interactive dashboards.",
      img: "./images/datavisulation.png",
    },
    {
      id: 5,
      title: "Business Analytics",
      duration: "4 Months",
      level: "Intermediate",
      description:
        "Data-driven decision making and business intelligence strategies.",
      img: "./images/business.jpeg",
    },
    {
      id: 6,
      title: "MLOps & Deployment",
      duration: "5 Months",
      level: "Advanced",
      description:
        "Model deployment, monitoring, and machine learning operations.",
      img: "./images/Ai.png",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#151316] to-[#1a181b] flex flex-col justify-center items-center py-20">
      {/* Background gradients */}
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

      {/* Heading */}
      <h2 className="text-center text-5xl md:text-7xl font-extrabold text-white tracking-wide mb-16 relative z-10">
        OUR{" "}
        <span
          className="text-transparent bg-clip-text"
          style={{
            background:
              "linear-gradient(90deg,#D22D1E,#963AB0,#20469B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          COURSES
        </span>
      </h2>

      {/* Slider container */}
      <div className="relative w-full flex justify-center items-center overflow-hidden">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-xl rounded-full hover:bg-black/70 transition"
        >
          <ChevronLeft size={28} className="text-white" />
        </button>

        {/* Cards Row */}
      <div
      ref={scrollRef}
      className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar px-[5vw] items-center"
    >
      {courses.map((course, index) => (
        <div
          key={course.id}
          className="flex-shrink-0 w-[80vw] md:w-[45vw] lg:w-[30vw] snap-center"
        >
          <div className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-black/20 hover:scale-[1.02] transition-all duration-500">
            
            {/* Course Image */}
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={course.img}
                alt={course.title}
                className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            </div>

            {/* Card Body */}
            <div className="relative z-10 p-6 flex flex-col h-[22rem]">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D22D1E]/40 to-[#20469B]/40 border border-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                    course.level === "Beginner"
                      ? "bg-green-500/15 text-green-300 border-green-400/20"
                      : course.level === "Intermediate"
                      ? "bg-yellow-500/15 text-yellow-300 border-yellow-400/20"
                      : "bg-purple-500/15 text-purple-300 border-purple-400/20"
                  }`}
                >
                  {course.level}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                {course.title}
              </h3>

              <p className="text-gray-300 text-sm mb-5 flex-grow">
                {course.description}
              </p>

              <div className="flex justify-between items-center py-2 border-b border-white/10 mb-5">
                <span
                  className="font-semibold text-transparent bg-clip-text text-lg"
                  style={{
                    background:
                      "linear-gradient(90deg,#D22D1E,#963AB0,#20469B)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Duration
                </span>
                <span className="text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  {course.duration}
                </span>
              </div>

              {/* Enroll Now Button with Link */}
              <Link to={`/course/${course.id}`}>
                <button
                  className="
                    relative w-full py-3 rounded-xl text-white font-medium text-base
                    border border-white/20 bg-[#1a181b]
                    transition-all duration-500 overflow-hidden
                    group-hover:bg-[linear-gradient(90deg,#D22D1E,#963AB0,#20469B)]
                    hover:-translate-y-1
                  "
                >
                  <div
                    className="
                      absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                      transform -skew-x-12 translate-x-[-100%]
                      group-hover:translate-x-[100%]
                      transition-all duration-700
                    "
                  ></div>
                  <span className="relative z-10">Enroll Now</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-xl rounded-full hover:bg-black/70 transition"
        >
          <ChevronRight size={28} className="text-white" />
        </button>
      </div>
    </section>
  );
};

export default Courses;
