import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // 👈 useLocation add kiya

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context & Utils
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Components
import NewHero from "./components/NewHero";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ChromaGrid from "./components/ChromaGrid";
import Courses from "./components/Courses";

// Course Components
import CourseCurriculum from "./components/CourseDetails";
import CourseDetails2 from "./components/CourseDetails2";

// Student Components
import StudentLogin from "./pages/Login";
import StudentRegister from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import QuizPlayer from "./pages/QuizPlayer";

// Admin & Faculty Components
import AdminDashboard from "./components/admin/Dashbaord";
import AdminLogin from "./components/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import FacultyLogin from "./components/faculty/FacultyLogin";
import FacultyRegister from "./components/faculty/FacultyRegister";
import FacultyDashboard from "./components/faculty/FacultyDashboard";
import AddClass from "./components/faculty/AddClass";
import EditClass from "./components/faculty/EditClass";

// Policies
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import Navbar from "./components/Navigation";
import ScrollToTop from "./pages/ScrollToTop";
import FAQSection from "./components/Faq";

function App() {
  // Override global alert → Convert to toast
  window.alert = function (msg) {
    toast(msg);
  };

  //  LOCATION CHECK START
  const location = useLocation();

  // Check karein ki kya user Home Page ('/') par hai jahan NewHero hai?
  const isLandingPage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isFacultyPage = location.pathname === "/faculty/dashboard";
  //  LOCATION CHECK END

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-zinc-800 !text-white !font-sans !rounded-xl !shadow-2xl !border !border-white/5"
        progressClassName="!bg-gradient-to-r !from-pink-500 !via-red-500 !to-purple-600 !h-1.5"
        bodyClassName="!text-sm !font-medium"
      />

      <div className="app bg-navy-900 text-white min-h-screen overflow-x-hidden flex flex-col">
        {/* 👇 GLOBAL Navigation: Sirf tab dikhega jab hum Landing Page par NAHI hain */}
        {!isLandingPage && !isAdminPage && !isFacultyPage && <Navbar />}
        <ScrollToTop />
        {/* Content Area - Flex grow ensures footer sticks to bottom if content is short */}
        <div className="flex-grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/"
              element={
                <>
                  {/* Landing page has its own layout */}
                  <NewHero />
                  <About />
                  <Courses />
                  <ChromaGrid />
                  {/* <CTA /> */}
                  <Footer />
                </>
              }
            />

            <Route path="/curriculum/:subject" element={<CourseCurriculum />} />
            <Route path="/course/:id" element={<CourseDetails2 />} />

            {/* STUDENT AUTH */}
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizPlayer />
                </ProtectedRoute>
              }
            />
            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
            {/* FACULTY */}
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route path="/faculty/register" element={<FacultyRegister />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/add-class" element={<AddClass />} />
            <Route path="/faculty/edit-class/:id" element={<EditClass />} />

            {/* POLICIES */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cancellation" element={<CancellationPolicy />} />

            {/* 404 PAGE */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-black text-white">
                  <div className="text-center">
                    <h1 className="text-9xl font-black bg-gradient-to-r from-red-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                      404
                    </h1>
                    <p className="text-3xl mt-8">Page Not Found</p>
                    <a
                      href="/"
                      className="mt-8 inline-block px-10 py-5 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl text-xl font-bold"
                    >
                      Back Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>

        {/* 👇 GLOBAL FOOTER: Ye bhi tabhi dikhega jab hum Landing Page par NAHI hain */}
        {/* Note: Landing Page ka footer upar <Route path="/"> ke andar already included hai */}
        {!isLandingPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
