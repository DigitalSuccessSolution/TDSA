import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Do I need prior coding experience?",
      answer:
        "No! This course is designed for absolute beginners. We start from the very basics of programming and gradually move to advanced concepts.",
    },
    {
      question: "What if I miss a live class?",
      answer:
        "Don't worry. All live sessions are recorded and uploaded to your dashboard within 24 hours. You can watch them anytime, anywhere.",
    },
    {
      question: "Is the certificate valid in the industry?",
      answer:
        "Yes, our certificate is ISO certified and recognized by top tech companies. You can add it to your LinkedIn profile and resume.",
    },
    {
      question: "How does the placement assistance work?",
      answer:
        "Once you complete 70% of the course, our placement team starts working with you on your resume, mock interviews, and scheduling interviews with our hiring partners.",
    },
    {
      question: "Can I access the course on mobile?",
      answer:
        "Yes, our platform is fully mobile-responsive. You can watch lectures and access notes on any device (Android/iOS).",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-10 md:mt-32 mb-20 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-4">
          <HelpCircle size={14} /> Common Queries
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`group rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isOpen
                  ? "bg-zinc-900/80 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]"
                  : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 hover:border-white/10"
              }`}
            >
              {/* Question Header */}
              <div className="p-4 md:p-6 flex justify-between items-center gap-4">
                <h3
                  className={`text-base md:text-lg font-semibold transition-colors ${
                    isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"
                  }`}
                >
                  {faq.question}
                </h3>
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isOpen
                      ? "bg-pink-500 text-white border-pink-500 rotate-180"
                      : "bg-white/5 text-zinc-500 border-white/10 group-hover:border-white/30 group-hover:text-zinc-300"
                  }`}
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </div>

              {/* Answer Content (Smooth Collapse) */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-6 pb-4 md:pb-6 pr-4 md:pr-12 text-zinc-400 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;