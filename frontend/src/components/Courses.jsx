import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, openCurriculum }) => {
  return (
    <div className="flex flex-col bg-[#111111] rounded-2xl p-4 sm:p-5 border border-white/5 hover:border-white/10 transition-all duration-300">
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md mb-6">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.subject}
            className="h-40 sm:h-48 w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-900 border border-white/5 rounded-xl">
            <span className="text-4xl font-bold text-zinc-800">
              {course.subject?.[0]}
            </span>
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-2 text-white text-[13px] font-medium">
          <span>{course.duration || "150 Hours"}</span>
          <span className="text-[10px] opacity-30">•</span>
          <span>{course.modules?.length || 0} Modules</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-yellow-400"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-zinc-300 text-[13px] font-medium">
            {course.averageRating || "4.8"}
          </span>
        </div>
      </div>

      {/* Course Title */}
      <h3 className="text-xl sm:text-[22px] font-semibold text-white mb-3 leading-tight px-1">
        {course.subject}
      </h3>

      {/* Description - 2 lines with ellipsis */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-6 px-1 line-clamp-2">
        {course.description}...
      </p>

      {/* Course Level as Tag */}
      <div className="flex flex-wrap gap-2 mb-8 px-1">
        <span className="px-3 py-1.5 bg-[#1a1a1a] border border-white/5 rounded-lg text-xs font-medium text-zinc-300">
          {course.level}
        </span>
      </div>

      {/* Enroll Now Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={() => openCurriculum(course.subject)}
          className="w-full py-3.5 rounded-xl border border-zinc-700 text-white font-semibold hover:bg-white hover:text-black hover:border-white transition-all duration-300"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const openCurriculum = (subject) => {
    const slug = subject.toLowerCase().replace(/\s+/g, "-");
    navigate(`/curriculum/${slug}`);
  };

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );

  if (!courses.length) return null;

  return (
    <section id="courses" className="py-20 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            OUR <span className="text-zinc-500">COURSES</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              openCurriculum={openCurriculum}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
