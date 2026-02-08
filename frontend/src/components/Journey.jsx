import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timelineData = {
  "2020 - 2021": [
    {
      year: 2020,
      image: "/images/datavisulation.png",
      text: "Data Science Academy was founded with a vision to democratize data education and bridge the industry skill gap.",
    },
  ],
  "2021 - 2022": [
    {
      year: 2021,
      image: "/images/ML.png",
      text: "Expanded our curriculum to include comprehensive Machine Learning modules, helping students master predictive modeling.",
    },
  ],
  "2022 - 2023": [
    {
      year: 2022,
      image: "/images/Ai.png",
      text: "Launched advanced Artificial Intelligence and Deep Learning specializations, incorporating cutting-edge Generative AI topics.",
    },
  ],
  "2023 - 2024": [
    {
      year: 2023,
      image: "/images/innovation-lab.jpeg",
      text: "Inaugurated our dedicated Innovation Lab to foster research and practical application of data science in real-world scenarios.",
    },
  ],
  "2024 - 2025": [
    {
      year: 2024,
      image: "/images/business.jpeg",
      text: "Forged strategic partnerships with leading tech, finance, and consulting firms to enhance placement opportunities for our graduates.",
    },
  ],
  "2025 - Present": [
    {
      year: 2025,
      image: "/images/dataengineering.png",
      text: "Embarking on a new era of global expansion and introducing comprehensive Data Engineering tracks to shape the future of big data.",
    },
  ],
};

export default function Journey() {
  const [activeRange, setActiveRange] = useState("2020 - 2021");
  const [activeIndex, setActiveIndex] = useState(0);

  const data = timelineData[activeRange] || [];
  const activeItem = data[activeIndex] || data[0];

  const handlePrev = () => {
    if (!data.length) return;
    setActiveIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!data.length) return;
    setActiveIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#151316] py-20 px-4 md:px-10">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#151316] via-[#1a181b] to-[#151316]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-12 tracking-wide">
          Our{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              background:
                "linear-gradient(90deg, #D22D1E 30%, #963AB0 60%, #20469B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Journey
          </span>
        </h2>

        {/* Top Range Selector */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 text-gray-300 text-sm md:text-base font-medium border-b border-white/10 pb-4">
          {Object.keys(timelineData).map((range) => (
            <button
              key={range}
              onClick={() => {
                setActiveRange(range);
                setActiveIndex(0);
              }}
              className={`pb-1 px-3 rounded-md transition-all ${
                activeRange === range
                  ? "text-transparent bg-clip-text border-b-2 border-[#963AB0] font-semibold"
                  : "hover:text-[#963AB0]"
              }`}
              style={
                activeRange === range
                  ? {
                      background:
                        "linear-gradient(90deg,#D22D1E 30%,#963AB0 60%,#20469B 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : {}
              }
            >
              {range}
            </button>
          ))}
        </div>

        {/* Year Tabs */}
        <div className="flex items-center justify-between mt-6 text-white">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide px-4">
            {data.map((item, index) => (
              <button
                key={item.year}
                onClick={() => setActiveIndex(index)}
                className={`text-sm md:text-base font-medium transition-all ${
                  index === activeIndex
                    ? "text-transparent bg-clip-text font-semibold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                style={
                  index === activeIndex
                    ? {
                        background:
                          "linear-gradient(90deg,#D22D1E 30%,#963AB0 60%,#20469B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}
                }
              >
                {item.year}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Year Content */}
        {activeItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl"
            >
              <img
                src={activeItem.image}
                alt={activeItem.text}
                className="w-full md:w-1/3 rounded-2xl shadow-lg border border-white/10"
              />
              <p className="text-gray-300 text-center md:text-left text-base md:text-lg leading-relaxed">
                {activeItem.text}
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
