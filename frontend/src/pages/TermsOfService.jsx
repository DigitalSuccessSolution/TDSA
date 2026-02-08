import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 font-sans selection:bg-purple-500/30 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm font-mono">
            Last Updated: November 27, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                Welcome to <strong>Your Course Platform</strong> ("we," "our,"
                or "the Platform"). By accessing or using our website, mobile
                app, or services, you agree to be bound by these Terms of
                Service ("Terms").
              </p>
              <p>
                If you do not agree to these terms, please do not use our
                platform.
              </p>
            </div>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Eligibility
            </h2>
            <p className="leading-relaxed">
              You must be at least <strong>16 years old</strong> to use our
              platform. Users under 18 must have parental or legal guardian
              consent. By using the platform, you represent that you meet these
              requirements.
            </p>
          </section>

          {/* 3. Account */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Account Creation & Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>
                You must provide accurate and complete information during
                registration.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You are fully responsible for all activities that occur under
                your account.
              </li>
              <li>
                Only one account per person is allowed. Account sharing is
                strictly prohibited.
              </li>
            </ul>
          </section>

          {/* 4. Course Enrollment */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Course Enrollment
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>
                Enrollment grants you a limited, non-transferable license to
                access the course for personal use.
              </li>
              <li>
                Lifetime access is provided for purchased courses unless stated
                otherwise.
              </li>
              <li>
                You may not share, distribute, resell, or publicly display
                course content.
              </li>
            </ul>
          </section>

          {/* 5. Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Payments & Refunds
            </h2>
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-medium text-emerald-400 mb-2">
                Refund Policy Impact
              </h3>
              <ul className="list-disc list-inside space-y-1 text-emerald-200/80 text-sm">
                <li>
                  Full refund within 7 days if less than 10% content consumed.
                </li>
                <li>No refunds after 7 days.</li>
              </ul>
            </div>
            <p className="leading-relaxed">
              All payments are processed securely. We do not store your payment
              credentials.
            </p>
          </section>

          {/* 6. Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Acceptable Use Policy
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 leading-relaxed">
              <li>Copy, distribute, or modify course content.</li>
              <li>Use bots, scrapers, or automate access to the platform.</li>
              <li>Attempt to reverse engineer or extract source code.</li>
              <li>Harass, threaten, or abuse instructors or other students.</li>
              <li>Upload malicious code or spam.</li>
            </ul>
          </section>

          {/* 7. IP */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All course content, including videos, code, notes, projects, and
              quizzes, is owned by the Platform or its instructors and protected
              by copyright laws. Commercial use is strictly prohibited.
            </p>
          </section>

          {/* 8. Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Responsibilities
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Instructors
                </h3>
                <p>
                  Must provide accurate content, respond to queries, and update
                  materials as needed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Students
                </h3>
                <p>
                  Must complete courses with honesty, not cheat on assessments,
                  and respect community guidelines.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              The platform is provided "as is". We do not guarantee job
              placement or specific career outcomes. We shall not be liable for
              indirect, incidental, or consequential damages to the fullest
              extent permitted by law.
            </p>
          </section>

          {/* 10. Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Termination
            </h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account for
              violation of these Terms (e.g., piracy, sharing accounts). No
              refunds will be issued for terminated accounts due to violations.
            </p>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Governing Law
            </h2>
            <p className="leading-relaxed">
              These Terms shall be governed by the laws of India. Any disputes
              will be resolved in the courts of [Your City], India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
