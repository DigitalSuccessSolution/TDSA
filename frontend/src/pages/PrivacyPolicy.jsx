import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 font-sans selection:bg-purple-500/30 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
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
                Welcome to our platform. We are committed to protecting your
                personal information and your right to privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our course-selling platform for
                Data Science, Machine Learning, AI Engineering, and other
                technical courses.
              </p>
              <p>
                By accessing or using our platform, you agree to the terms
                outlined in this Privacy Policy. If you do not agree with our
                practices, please do not use our services.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-6 leading-relaxed">
              <p>
                We collect information that you provide directly to us and
                information that is automatically collected when you use our
                platform.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  2.1 Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
                  <li>
                    <strong className="text-gray-200">Name:</strong> Your full
                    name for account registration and certificates
                  </li>
                  <li>
                    <strong className="text-gray-200">Email Address:</strong>{" "}
                    For communication, account verification, and course updates
                  </li>
                  <li>
                    <strong className="text-gray-200">Phone Number:</strong> For
                    account security and important notifications
                  </li>
                  <li>
                    <strong className="text-gray-200">
                      Profile Information:
                    </strong>{" "}
                    Educational background and professional experience
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  2.2 Learning Activity Data
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
                  <li>Course enrollment and completion status</li>
                  <li>Quiz attempts, scores, and assignment submissions</li>
                  <li>Video watch time and progress tracking</li>
                  <li>Attendance records for live sessions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-4 leading-relaxed text-gray-400">
              <p>
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To provide access to courses and track progress.</li>
                <li>
                  To send updates, announcements, and respond to inquiries.
                </li>
                <li>To maintain your account and verify identity.</li>
                <li>
                  To recommend relevant courses and customize your experience.
                </li>
                <li>To comply with legal obligations and enforce our terms.</li>
              </ul>
            </div>
          </section>

          {/* 4. Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Payment & Transaction Information
            </h2>
            <p className="leading-relaxed mb-4">
              When you make a purchase on our platform, we collect payment and
              transaction information to process your enrollment.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-200/80 text-sm">
              <strong>Note:</strong> We do NOT store your complete credit card
              numbers, CVV codes, or bank account passwords. All sensitive
              payment information is processed by our certified payment gateway
              providers.
            </div>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience on our platform. You can control and manage cookies
              through your browser settings.
            </p>
          </section>

          {/* 6. Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Data Storage and Security
            </h2>
            <p className="leading-relaxed">
              We take the security of your personal information seriously and
              implement industry-standard measures: SSL/TLS encryption, regular
              audits, access controls, and secure cloud storage. While no system
              is 100% secure, we continuously work to protect your data.
            </p>
          </section>

          {/* 7. Third-Party */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We work with trusted providers (e.g., payment gateways, analytics)
              who may access your data only to perform tasks on our behalf and
              are obligated to maintain confidentiality.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Your Rights
            </h2>
            <p className="leading-relaxed">
              You have the right to access, correct, delete, or export your
              data. You can withdraw consent or object to processing. Contact us
              to exercise these rights — we aim to respond within 30 days.
            </p>
          </section>

          {/* 9. Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Data Retention
            </h2>
            <p className="leading-relaxed">
              We retain your data only as long as necessary. Active account data
              is retained ongoing. Financial records are retained for 7 years as
              per legal requirements. Deleted account data is removed within 90
              days.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              Our platform is not intended for individuals under 16. We do not
              knowingly collect data from children. If discovered, we will
              delete it immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
