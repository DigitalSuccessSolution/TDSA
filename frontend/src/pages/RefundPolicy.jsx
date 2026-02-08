import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 font-sans selection:bg-purple-500/30 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Refund & Return Policy
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            Job-Oriented Courses • Strict but Fair
          </p>
          <p className="text-gray-500 text-sm font-mono">
            Last Updated: November 27, 2025
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Overview
            </h2>
            <p className="leading-relaxed mb-4">
              We offer a <strong>100% Job-or-Refund Guarantee</strong> only for
              our premium Data Science, Machine Learning, and AI Engineer
              bootcamp-style courses.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-200/80">
              This is <strong>NOT</strong> a "money-back if you don't like it"
              policy. It is for serious students who complete the program but do
              not find relevant employment.
            </div>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              2. Eligibility Criteria (Mandatory)
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-4">
              {[
                "Minimum 85% Attendance in live sessions",
                "100% Quizzes Attempted",
                "3 Capstone Projects Completed & Approved",
                "Final Test Score ≥ 70%",
                "No Job in Relevant Field Within 6 Months of completion",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Non-Refundable */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              3. Non-Refundable Scenarios
            </h2>
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-8 space-y-4">
              {[
                "Less than 85% attendance",
                "Failing to complete quizzes or projects",
                "Not actively applying to jobs (min 50 applications)",
                "Found cheating or using unfair means",
                "Purchased via special discount or scholarship",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Process */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Refund Process
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300 leading-relaxed ml-2">
              <li>
                Wait exactly <strong>6 months</strong> after your course
                completion date.
              </li>
              <li>
                Email <strong>refund@yourplatform.com</strong> with your details
                and proof of job applications.
              </li>
              <li>Our team will verify your eligibility (7-10 days).</li>
              <li>
                If approved, the full refund is processed within{" "}
                <strong>15 business days</strong>.
              </li>
            </ol>
          </section>

          {/* 5. Documents */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Required Documents
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Proof of 50+ job applications.</li>
              <li>Updated Resume & LinkedIn profile.</li>
              <li>Course completion certificate.</li>
              <li>Declaration of no job offer.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
