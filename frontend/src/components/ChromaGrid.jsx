import React from "react";
import { Star, Quote } from "lucide-react";

// Student Placement Data
const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Placed at Google",
    location: "24 LPA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-4QfGDLMP-RHb1h_nmVpbw0VoLOwEM8mzqQ&s",
    review:
      "The curriculum was incredibly up-to-date. Landing a role at Google was my dream, and the placement support here made it possible.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Placed at Microsoft",
    location: "22 LPA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WrTGk28J_Wwni_eMyguCrHJdQUaN1sosoA&s",
    review:
      "From mock interviews to resume building, the guidance was exceptional. I secured a 22 LPA package thanks to the dedicated mentors.",
    rating: 5,
  },
  {
    id: 3,
    name: "Rohan Gupta",
    role: "Placed at TCS",
    location: "8 LPA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQXbnhbt9SO8kdXt-P4nEdsxQnBdCJy7YaQ&s",
    review:
      "The hands-on projects gave me the confidence to crack the technical rounds. A truly life-changing experience.",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Placed at Capegemini",
    location: "12 LPA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCdMxxD6EaK1VMaAkSXv26xma3uaK7DjoTXA7doZhNA&s",
    review:
      "I transitioned from a non-tech background to a Data Scientist role. The structured learning path was the key to my success.",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Placed at Deloitte",
    location: "12 LPA",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=300&auto=format&fit=crop",
    review:
      "The placement team fought for every opportunity. I'm grateful for their relentless support and guidance.",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Ananya Iyer",
    role: "Placed at Flipkart",
    location: "15 LPA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvnX7Nf88oDyOyH3B8JWfojY1ZC-eQr1SuDw&s",
    review:
      "Professional mentors and a strong alumni network helped me navigate the industry. Highly recommended for aspirants.",
    rating: 5,
  },
];

const TestimonialCard = ({ t }) => (
  <div className="flex-shrink-0 w-[300px] md:w-[350px] bg-zinc-900/80 border border-white/10 rounded-2xl p-4 md:p-6 mx-3 hover:bg-zinc-800 transition-all duration-300 backdrop-blur-sm group hover:border-blue-500/40 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-0 md:mb-4">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(t.rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-zinc-700"
            }`}
          />
        ))}
      </div>
      <Quote className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors" />
    </div>

    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-1 md:mb-6 line-clamp-3 italic">
      "{t.review}"
    </p>

    <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
      <img
        src={t.image}
        alt={t.name}
        className="w-10 h-10 rounded-full object-cover bg-gray-800 border border-white/10 group-hover:border-blue-500/50 transition-colors"
      />
      <div className="overflow-hidden">
        <h4 className="font-bold text-white text-sm truncate">{t.name}</h4>
        <p className="text-[10px] md:text-xs text-gray-400 group-hover:text-blue-400 transition-colors font-medium truncate">
          {t.role} <span className="text-zinc-600">•</span>{" "}
          <span className="text-emerald-400">{t.location}</span>
        </p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  // Split data into two rows
  const firstRow = [...testimonials.slice(0, 3)];
  const secondRow = [...testimonials.slice(3, 6)];

  return (
    <div className="min-h-screen bg-black">
      {/* Custom styles for the marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: fit-content;
          animation: marquee-reverse 30s linear infinite;
        }
        .pause-on-hover:hover .animate-marquee,
        .pause-on-hover:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}</style>

      <section
        id="testimonials"
        className="text-white py-16 md:py-24 overflow-hidden border-b border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-20 text-center">
          <span className="text-blue-500 font-semibold tracking-widest uppercase text-[10px] md:text-xs mb-3 block">
            Placement Success Stories
          </span>
          <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight">
            Our Students in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              Top Companies
            </span>
          </h2>
        </div>

        {/* Marquee Container with Mask Gradient */}
        <div
          className="relative flex flex-col gap-6 md:gap-10 pause-on-hover"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          {/* Row 1: Leftward Movement */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee">
              {/* Duplicate the items to create a seamless loop */}
              {[...firstRow, ...firstRow, ...firstRow, ...firstRow].map(
                (t, i) => (
                  <TestimonialCard key={`row1-${i}`} t={t} />
                ),
              )}
            </div>
          </div>

          {/* Row 2: Rightward Movement */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-reverse">
              {[...secondRow, ...secondRow, ...secondRow, ...secondRow].map(
                (t, i) => (
                  <TestimonialCard key={`row2-${i}`} t={t} />
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
