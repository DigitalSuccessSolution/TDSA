import React from "react";
import { Clock, CheckCircle } from "lucide-react";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 font-sans selection:bg-purple-500/30 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cancellation Policy
          </h1>
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
            <p className="leading-relaxed">
              This policy outlines the conditions under which you may cancel
              your course enrollment and request a refund.
            </p>
          </section>

          {/* 2. Window */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              2. Cancellation Window
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-purple-400 w-6 h-6" />
                  <h3 className="text-lg font-bold text-white">
                    Within 24 Hours
                  </h3>
                </div>
                <p>Full refund (Automatic). No questions asked.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-purple-400 w-6 h-6" />
                  <h3 className="text-lg font-bold text-white">Before Start</h3>
                </div>
                <p>
                  Full refund minus <strong>₹2,000</strong> admin fee if
                  cancelled before batch starts.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              No cancellations accepted after 7 days of batch commencement.
            </p>
          </section>

          {/* 3. Not Possible */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. When Cancellation is Not Possible
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>More than 7 days have passed since batch start.</li>
              <li>You have attended 3 or more live sessions.</li>
              <li>You have accessed more than 15% of the course content.</li>
              <li>You enrolled via a special scholarship or EMI scheme.</li>
            </ul>
          </section>

          {/* 4. Automatic */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Automatic Cancellation
            </h2>
            <p className="mb-2">
              We reserve the right to cancel your enrollment without refund if:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>You engage in fraudulent payment activity.</li>
              <li>You share your account credentials with others.</li>
              <li>You violate our Community Guidelines.</li>
            </ul>
          </section>

          {/* 5. Process */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. How to Request Cancellation
            </h2>
            <p className="leading-relaxed mb-4">
              Send an email to <strong>cancel@yourplatform.com</strong> with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>Full Name & Registered Email</li>
              <li>Course Name & Batch ID</li>
              <li>Reason for cancellation</li>
            </ul>
            <p className="mt-4 text-purple-400">
              We will respond within 48 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
