import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Users,
  BookOpen,
  Calendar,
  Briefcase,
  Loader2,
  LogOut,
  LayoutGrid,
  CloudUpload,
  Trophy,
  FileText,
  ExternalLink,
  Award,
  ChevronRight,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");

  // --- DATA STATES ---
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  // --- RESULTS TAB STATES ---
  const [resultSelectedCourse, setResultSelectedCourse] = useState("");
  const [resultQuizzes, setResultQuizzes] = useState([]);
  const [resultSelectedQuiz, setResultSelectedQuiz] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [sendingCert, setSendingCert] = useState(null); // Track specific loading button

  // --- UI STATES ---
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // --- FORM STATES ---
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [demoVideo, setDemoVideo] = useState("");
  const [modules, setModules] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [brochure, setBrochure] = useState(null);
  const [brochureName, setBrochureName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [mentors, setMentors] = useState([]);

  // NEW STATES
  const [roadmapImage, setRoadmapImage] = useState(null);
  const [roadmapImagePreview, setRoadmapImagePreview] = useState("");
  const [skillsImages, setSkillsImages] = useState([]); // New files
  const [skillsImagesPreviews, setSkillsImagesPreviews] = useState([]); // New file previews
  const [existingSkillsImages, setExistingSkillsImages] = useState([]); // Database URLs

  useEffect(() => {
    fetchCourses();
    if (activeTab === "courses") fetchAllFaculty();
    if (activeTab === "enrollments") fetchEnrollments();
    if (activeTab === "faculty") fetchFacultyAssignmentsData();
  }, [activeTab]);

  // ==============================
  // 1. API FETCH FUNCTIONS
  // ==============================
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments/all`);
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFaculty = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty`);
      if (res.ok) setAllFaculty(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFacultyAssignmentsData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/assignments`);
      if (res.ok) setFacultyAssignments(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // 2. DELETE FUNCTIONS
  // ==============================
  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchEnrollments();
      else alert("Failed to delete");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAllEnrollments = async () => {
    if (
      !window.confirm("⚠️ WARNING: This will delete ALL student enrollments.")
    )
      return;
    if (!window.confirm("Double Check: Are you absolutely sure?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments/all`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("All enrollments deleted.");
        fetchEnrollments();
      } else alert("Failed to delete all data");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to remove this faculty member?"))
      return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchFacultyAssignmentsData();
      else {
        const data = await res.json();
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // 3. RESULT & CERTIFICATE LOGIC
  // ==============================
  const handleCourseSelectForResults = async (courseId) => {
    setResultSelectedCourse(courseId);
    setResultSelectedQuiz("");
    setStudentResults([]);
    setResultQuizzes([]);
    if (!courseId) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/quizzes`
      );
      if (res.ok) setResultQuizzes(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizSelectForResults = async (quizId) => {
    setResultSelectedQuiz(quizId);
    if (!quizId) {
      setStudentResults([]);
      return;
    }

    setResultsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/results/${quizId}`
      );
      if (res.ok) setStudentResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleDownloadFile = async (url, studentName) => {
    try {
      document.body.style.cursor = "wait";
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${studentName.replace(/\s+/g, "_")}_AnswerSheet.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Download failed. Opening in new tab.");
      window.open(url, "_blank");
    } finally {
      document.body.style.cursor = "default";
    }
  };

  const handleSendCertificate = async (resultId) => {
    if (!window.confirm("Generate and email certificate?")) return;
    setSendingCert(resultId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId }),
      });
      const data = await res.json();
      if (res.ok) alert("✅ " + data.message);
      else alert("❌ Error: " + data.message);
    } catch (err) {
      alert("Network Error");
    } finally {
      setSendingCert(null);
    }
  };

  // ==============================
  // 4. COURSE FORM LOGIC
  // ==============================
  const saveCourse = async () => {
    if (!subject.trim() || !description.trim() || !duration.trim()) {
      alert("Please fill required fields");
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("description", description.trim());
    formData.append("duration", duration.trim());
    formData.append("level", level);

    let videoUrl = demoVideo?.trim() || "";
    if (videoUrl.includes("watch?v="))
      videoUrl = videoUrl.replace("watch?v=", "embed/");
    formData.append("demoVideo", videoUrl);

    const cleanModules = modules
      .map((m) => ({
        title: m.title.trim() || "Untitled Module",
        lectures: m.lectures
          .map((l) => ({
            title: l.title.trim() || "Untitled Lecture",
            content: l.content
              .filter(
                (c) =>
                  (typeof c === "string" ? c.trim() : c?.text?.trim()) !== ""
              )
              .map((c) => (typeof c === "string" ? { text: c.trim() } : c)),
          }))
          .filter((l) => l.content.length > 0),
      }))
      .filter((m) => m.lectures.length > 0);
    formData.append("modules", JSON.stringify(cleanModules));

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (brochure) formData.append("brochure", brochure);
    if (reviews.length > 0) formData.append("reviews", JSON.stringify(reviews));

    const validMentors = mentors.filter((m) => m.facultyId);
    validMentors.forEach((mentor, idx) => {
      const selectedFaculty = allFaculty.find(
        (f) => f._id === mentor.facultyId
      );
      if (selectedFaculty) {
        formData.append(`mentorName_${idx}`, selectedFaculty.name);
        formData.append(
          `mentorDesignation_${idx}`,
          mentor.designation || selectedFaculty.designation || "Mentor"
        );
        formData.append(`mentorFacultyId_${idx}`, mentor.facultyId);
        if (mentor.photoFile)
          formData.append(`mentorPhoto_${idx}`, mentor.photoFile);
        else if (mentor.photo)
          formData.append(`mentorPhotoUrl_${idx}`, mentor.photo);
      }
    });
    formData.append("mentorsCount", validMentors.length);

    // NEW: Appending Roadmap & Skills
    if (roadmapImage) formData.append("roadmapImage", roadmapImage);

    // Skills: Send existing URLs as JSON, new files as files
    formData.append("skillsImages", JSON.stringify(existingSkillsImages));
    skillsImages.forEach((file) => formData.append("skillsImages", file));

    try {
      const url = editingCourse
        ? `${import.meta.env.VITE_API_URL}/api/courses/${editingCourse._id}`
        : `${import.meta.env.VITE_API_URL}/api/courses`;
      const res = await fetch(url, {
        method: editingCourse ? "PUT" : "POST",
        body: formData,
      });
      if (res.ok) {
        closeForm();
        fetchCourses();
      } else {
        alert("Error: " + (await res.text()));
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };
  const resetForm = () => {
    setSubject("");
    setDescription("");
    setDuration("");
    setLevel("Beginner");
    setDemoVideo("");
    setModules([]);
    setThumbnail(null);
    setThumbnailPreview("");
    setBrochure(null);
    setBrochureName("");
    setReviews([]);
    setMentors([]);
    setEditingCourse(null);
    setRoadmapImage(null);
    setRoadmapImagePreview("");
    setSkillsImages([]);
    setSkillsImagesPreviews([]);
    setExistingSkillsImages([]);
  };

  // Module & Mentor Helpers
  const addModule = () => setModules([...modules, { title: "", lectures: [] }]);
  const removeModule = (i) => setModules(modules.filter((_, idx) => idx !== i));
  const addLecture = (mi) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? { ...m, lectures: [...m.lectures, { title: "", content: [""] }] }
          : m
      )
    );
  const removeLecture = (mi, li) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? { ...m, lectures: m.lectures.filter((_, idx) => idx !== li) }
          : m
      )
    );
  const addContent = (mi, li) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? {
            ...m,
            lectures: m.lectures.map((l, idx) =>
              idx === li ? { ...l, content: [...l.content, ""] } : l
            ),
          }
          : m
      )
    );
  const removeContent = (mi, li, ci) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? {
            ...m,
            lectures: m.lectures.map((l, idx) =>
              idx === li
                ? {
                  ...l,
                  content: l.content.filter((_, cidx) => cidx !== ci),
                }
                : l
            ),
          }
          : m
      )
    );
  const updateModuleTitle = (i, v) =>
    setModules(modules.map((m, idx) => (idx === i ? { ...m, title: v } : m)));
  const updateLectureTitle = (mi, li, v) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? {
            ...m,
            lectures: m.lectures.map((l, idx) =>
              idx === li ? { ...l, title: v } : l
            ),
          }
          : m
      )
    );
  const updateContent = (mi, li, ci, v) =>
    setModules(
      modules.map((m, i) =>
        i === mi
          ? {
            ...m,
            lectures: m.lectures.map((l, idx) =>
              idx === li
                ? {
                  ...l,
                  content: l.content.map((c, cidx) =>
                    cidx === ci ? v : c
                  ),
                }
                : l
            ),
          }
          : m
      )
    );

  const addMentor = () =>
    setMentors([
      ...mentors,
      {
        facultyId: "",
        name: "",
        designation: "",
        photo: "",
        photoFile: null,
        photoPreview: "",
      },
    ]);
  const removeMentor = (idx) => setMentors(mentors.filter((_, i) => i !== idx));
  const handleFacultySelect = (idx, facultyId) => {
    const selectedFaculty = allFaculty.find((f) => f._id === facultyId);
    if (selectedFaculty) {
      setMentors(
        mentors.map((m, i) =>
          i === idx
            ? {
              ...m,
              facultyId: facultyId,
              name: selectedFaculty.name,
              designation: selectedFaculty.designation || "Mentor",
              photo: selectedFaculty.photo || "",
              photoPreview: selectedFaculty.photo || "",
            }
            : m
        )
      );
    } else {
      setMentors(
        mentors.map((m, i) =>
          i === idx
            ? {
              ...m,
              facultyId: "",
              name: "",
              designation: "",
              photo: "",
              photoFile: null,
              photoPreview: "",
            }
            : m
        )
      );
    }
  };
  const updateMentorDesignation = (idx, value) =>
    setMentors(
      mentors.map((m, i) => (i === idx ? { ...m, designation: value } : m))
    );
  const handleMentorPhoto = (idx, file) => {
    if (file)
      setMentors(
        mentors.map((m, i) =>
          i === idx
            ? { ...m, photoFile: file, photoPreview: URL.createObjectURL(file) }
            : m
        )
      );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-violet-900/50">
      {/* TOPBAR */}
      <div className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <LayoutGrid size={20} className="text-black" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Admin<span className="text-zinc-500">Panel</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-white/5">
            {[
              { id: "courses", icon: BookOpen, label: "Courses" },
              { id: "enrollments", icon: Users, label: "Enrollments" },
              { id: "faculty", icon: Briefcase, label: "Faculty" },
              { id: "results", icon: Trophy, label: "Results" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* --- COURSES TAB --- */}
        {activeTab === "courses" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-bold text-white">My Courses</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
              >
                <Plus size={20} /> Create New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-zinc-900/40 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex flex-col overflow-hidden hover:shadow-2xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://via.placeholder.com/400x200"
                      }
                      alt={course.subject}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setSubject(course.subject);
                          setDescription(course.description || "");
                          setDuration(course.duration || "");
                          setLevel(course.level || "Beginner");
                          setDemoVideo(course.demoVideo || "");
                          setThumbnailPreview(course.thumbnail || "");
                          setModules(course.modules || []);
                          setReviews(course.reviews || []);
                          setMentors(
                            course.mentors?.map((m) => ({
                              ...m,
                              photoPreview: m.photo,
                              photoFile: null,
                            })) || []
                          );
                          setBrochureName(course.brochure ? "Uploaded" : "");
                          setRoadmapImagePreview(course.roadmapImage || "");
                          setExistingSkillsImages(course.skillsImages || []);
                          setShowForm(true);
                        }}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black border border-white/10"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Delete this course?")) {
                            await fetch(
                              `${import.meta.env.VITE_API_URL}/api/courses/${course._id}`,
                              { method: "DELETE" }
                            );
                            fetchCourses();
                          }
                        }}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-red-500 border border-white/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white text-black">
                      {course.level}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {course.subject}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                      {course.description}
                    </p>
                    <div className="pt-4 border-t border-white/5 flex justify-between text-sm text-zinc-400">
                      <span>
                        <Calendar size={14} className="inline mr-1" />{" "}
                        {course.duration}
                      </span>
                      <span>
                        <Users size={14} className="inline mr-1" />{" "}
                        {course.totalReviews || 0} enrolled
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ENROLLMENTS TAB (With Delete Logic) --- */}
        {activeTab === "enrollments" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Recent Enrollments
              </h2>
              {enrollments.length > 0 && (
                <button
                  onClick={handleDeleteAllEnrollments}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50 rounded-lg font-bold text-sm"
                >
                  <Trash2 size={16} /> Delete All
                </button>
              )}
            </div>
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin text-zinc-500 w-8 h-8" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className="p-20 text-center text-zinc-500">
                  No enrollments yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-6">Student</th>
                        <th className="p-6">Contact</th>
                        <th className="p-6">Course</th>
                        <th className="p-6">Date</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {enrollments.map((e) => (
                        <tr
                          key={e._id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-6">
                            <div>{e.student?.name || e.name}</div>
                            <div className="text-xs text-zinc-500">
                              {e.student?.email || e.email}
                            </div>
                          </td>
                          <td className="p-6 text-sm text-zinc-400">
                            {e.phone || "-"}
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300">
                              {e.course?.subject || "Unknown"}
                            </span>
                          </td>
                          <td className="p-6 text-sm text-zinc-500">
                            {formatDate(e.enrolledAt || e.createdAt)}
                          </td>
                          <td className="p-6 text-right">
                            <button
                              onClick={() => handleDeleteEnrollment(e._id)}
                              className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- FACULTY TAB (With Correct ID for Deletion) --- */}
        {activeTab === "faculty" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-white mb-8">
              Faculty Overview
            </h2>
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin text-zinc-500 w-8 h-8" />
                </div>
              ) : facultyAssignments.length === 0 ? (
                <div className="p-20 text-center text-zinc-500">
                  No faculty data.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-6">Faculty Name</th>
                        <th className="p-6">Assigned Courses</th>
                        <th className="p-6 text-right">Count</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {facultyAssignments.map((f) => (
                        <tr
                          key={f.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold">
                              {f.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold">{f.name}</div>
                              <div className="text-xs text-zinc-500">
                                {f.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-wrap gap-2">
                              {f.assignedCourses.map((c) => (
                                <span
                                  key={c.courseId}
                                  className="px-3 py-1 rounded bg-black border border-zinc-800 text-xs text-zinc-300"
                                >
                                  {c.subject}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-6 text-right font-mono text-zinc-400">
                            {f.assignedCourses.length}
                          </td>
                          <td className="p-6 text-right">
                            {/* ✅ FIXED: Using f._id || f.id for safer deletion */}
                            <button
                              onClick={() => handleDeleteFaculty(f._id || f.id)}
                              className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- RESULTS TAB --- */}
        {activeTab === "results" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-white mb-8">
              Student Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block">
                  1. Select Course
                </label>
                <select
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  value={resultSelectedCourse}
                  onChange={(e) => handleCourseSelectForResults(e.target.value)}
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block">
                  2. Select Quiz
                </label>
                <select
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none disabled:opacity-50"
                  value={resultSelectedQuiz}
                  onChange={(e) => handleQuizSelectForResults(e.target.value)}
                  disabled={!resultSelectedCourse}
                >
                  <option value="">-- Choose Quiz --</option>
                  {resultQuizzes.map((q) => (
                    <option key={q._id} value={q._id}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              {resultsLoading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin text-zinc-500 w-8 h-8" />
                </div>
              ) : !resultSelectedQuiz ? (
                <div className="p-20 text-center text-zinc-500">
                  Select a course and quiz.
                </div>
              ) : studentResults.length === 0 ? (
                <div className="p-20 text-center text-zinc-500">
                  No results found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-6">Student</th>
                        <th className="p-6">Score</th>
                        <th className="p-6 text-center">Stats</th>
                        <th className="p-6">Date</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {studentResults.map((res) => (
                        <tr
                          key={res._id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-6">
                            <div>{res.student?.name}</div>
                            <div className="text-xs text-zinc-500">
                              {res.student?.email}
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-violet-500/10 text-violet-300">
                              {res.score} /{" "}
                              {res.totalMarks || res.totalQuestions}
                            </span>
                          </td>
                          <td className="p-6 text-center font-mono text-sm">
                            <span className="text-green-400">
                              {res.correctAnswers}
                            </span>{" "}
                            /{" "}
                            <span className="text-red-400">
                              {res.wrongAnswers}
                            </span>
                          </td>
                          <td className="p-6 text-sm text-zinc-400">
                            {formatDate(res.createdAt)}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {res.submittedFile && (
                                <>
                                  <a
                                    href={res.submittedFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700"
                                    title="View"
                                  >
                                    <ExternalLink size={14} /> View
                                  </a>
                                  <button
                                    onClick={() =>
                                      handleDownloadFile(
                                        res.submittedFile,
                                        res.student?.name || "Student"
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg"
                                    title="Download"
                                  >
                                    <Download size={14} /> Download
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleSendCertificate(res._id)}
                                disabled={sendingCert === res._id}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-lg"
                              >
                                {sendingCert === res._id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Award size={14} />
                                )}{" "}
                                Certify
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* SIDE FORM (Create/Edit Course) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeForm}
          ></div>
          <div className="relative w-full max-w-7xl bg-[#0a0a0a] h-full shadow-2xl overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-20 border-b border-white/5 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingCourse ? "Edit Course" : "Create New Course"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-10">
              <section className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>{" "}
                  Basic Information
                </h3>
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Title
                    </label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500"
                      placeholder="e.g. Master React JS"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Duration
                      </label>
                      <input
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                        placeholder="e.g. 8 Weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </section>
              <div className="h-px bg-white/5 w-full"></div>
              <section className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>{" "}
                  Media & Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400">
                      Thumbnail
                    </label>
                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors text-center cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setThumbnail(file);
                            setThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="py-6">
                          <CloudUpload className="mx-auto h-10 w-10 text-zinc-600" />
                          <p className="mt-2 text-xs text-zinc-500">
                            Upload Image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Video Link
                      </label>
                      <input
                        value={demoVideo}
                        onChange={(e) => setDemoVideo(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                        placeholder="YouTube URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Brochure
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setBrochure(file);
                            setBrochureName(file.name);
                          }
                        }}
                        className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-white/10 file:text-white"
                      />
                      {brochureName && (
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                          <Check size={12} /> {brochureName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-white/5 w-full"></div>

              {/* NEW SECTION: ROADMAP */}
              <section className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>{" "}
                  Course Roadmap
                </h3>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-4">
                    Roadmap Image
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="cursor-pointer bg-zinc-900 border border-white/10 hover:border-white/30 px-6 py-4 rounded-xl text-sm text-zinc-300 flex flex-col items-center gap-2 transition-all hover:bg-zinc-800">
                      <CloudUpload size={24} className="text-cyan-500" />
                      <span className="font-bold">Upload Roadmap</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setRoadmapImage(file);
                            setRoadmapImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    {roadmapImagePreview ? (
                      <div className="relative group">
                        <img
                          src={roadmapImagePreview}
                          alt="Roadmap"
                          className="w-48 h-28 object-cover rounded-xl border border-white/20 shadow-lg"
                        />
                        <button
                          onClick={() => {
                            setRoadmapImage(null);
                            setRoadmapImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-zinc-600 italic text-sm">
                        No roadmap uploaded
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">
                    Recommended: High resolution landscape image showing the
                    learning path.
                  </p>
                </div>
              </section>

              <div className="h-px bg-white/5 w-full"></div>

              {/* NEW SECTION: SKILLS */}
              <section className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                  Skills Acquired
                </h3>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-zinc-400">
                      Skills Images
                    </label>
                    <label className="cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                      <Plus size={14} /> Add Skill
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setSkillsImages((prev) => [...prev, ...files]);
                            const newPreviews = files.map((f) =>
                              URL.createObjectURL(f)
                            );
                            setSkillsImagesPreviews((prev) => [
                              ...prev,
                              ...newPreviews,
                            ]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 min-h-[100px]">
                    {existingSkillsImages.length === 0 &&
                      skillsImagesPreviews.length === 0 ? (
                      <div className="text-center text-zinc-600 py-4">
                        No skills added yet. Upload icons or badges.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {/* Existing */}
                        {existingSkillsImages.map((url, i) => (
                          <div
                            key={`exist-${i}`}
                            className="relative w-20 h-20 group bg-black rounded-xl border border-white/10 flex items-center justify-center p-2"
                          >
                            <img
                              src={url}
                              className="max-w-full max-h-full object-contain"
                              alt="Skill"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setExistingSkillsImages((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                )
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {/* New Previews */}
                        {skillsImagesPreviews.map((url, i) => (
                          <div
                            key={`new-${i}`}
                            className="relative w-20 h-20 group bg-black rounded-xl border border-emerald-500/30 flex items-center justify-center p-2"
                          >
                            <img
                              src={url}
                              className="max-w-full max-h-full object-contain"
                              alt="New Skill"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSkillsImagesPreviews((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                                setSkillsImages((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                              <X size={12} />
                            </button>
                            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-xl pointer-events-none"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
              <div className="h-px bg-white/5 w-full"></div>
              {/* Keeping Curriculum & Mentors Sections concise to save space but functionality is fully intact */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>{" "}
                    Curriculum
                  </h3>
                  <button
                    onClick={addModule}
                    className="text-xs font-bold text-black bg-white hover:bg-zinc-200 px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={14} /> Module
                  </button>
                </div>
                <div className="space-y-6">
                  {modules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 relative group"
                    >
                      <button
                        onClick={() => removeModule(mIdx)}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                      <input
                        value={mod.title}
                        onChange={(e) =>
                          updateModuleTitle(mIdx, e.target.value)
                        }
                        placeholder="Module Title"
                        className="bg-transparent text-xl font-bold text-white w-full mb-6 focus:outline-none border-b border-transparent focus:border-white/20 pb-1"
                      />
                      <div className="space-y-4 border-l border-white/10 pl-4 ml-2">
                        {mod.lectures.map((lec, lIdx) => (
                          <div
                            key={lIdx}
                            className="bg-black/40 border border-white/5 rounded-xl p-4"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <input
                                value={lec.title}
                                onChange={(e) =>
                                  updateLectureTitle(mIdx, lIdx, e.target.value)
                                }
                                placeholder="Lecture Title"
                                className="bg-transparent text-sm font-bold text-zinc-200 w-full focus:outline-none"
                              />
                              <button
                                onClick={() => removeLecture(mIdx, lIdx)}
                                className="text-zinc-600 hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {lec.content.map((c, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex gap-2 items-center"
                                >
                                  <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                  <input
                                    value={typeof c === "string" ? c : c.text}
                                    onChange={(e) =>
                                      updateContent(
                                        mIdx,
                                        lIdx,
                                        cIdx,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 bg-transparent border-b border-white/5 px-0 py-1 text-xs text-zinc-400 focus:outline-none"
                                    placeholder="Topic..."
                                  />
                                  <button
                                    onClick={() =>
                                      removeContent(mIdx, lIdx, cIdx)
                                    }
                                    className="text-zinc-700 hover:text-red-400"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addContent(mIdx, lIdx)}
                                className="text-xs text-zinc-500 hover:text-white font-medium mt-2 flex items-center gap-1"
                              >
                                + Topic
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addLecture(mIdx)}
                          className="text-xs font-bold text-zinc-500 hover:text-white border border-dashed border-zinc-700 rounded-xl px-4 py-3 w-full text-left"
                        >
                          + Add Lecture
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <div className="h-px bg-white/5 w-full"></div>
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>{" "}
                    Mentors
                  </h3>
                  <button
                    onClick={addMentor}
                    className="text-xs font-bold text-zinc-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={14} /> Assign
                  </button>
                </div>
                <div className="space-y-4">
                  {mentors.map((mentor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl"
                    >
                      <div className="w-12 h-12 bg-black rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                        {mentor.photoPreview ? (
                          <img
                            src={mentor.photoPreview}
                            className="w-full h-full object-cover"
                            alt="Mentor"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-700">
                            <Users size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          value={mentor.facultyId || ""}
                          onChange={(e) =>
                            handleFacultySelect(idx, e.target.value)
                          }
                          className="bg-black border border-white/10 text-sm rounded-lg px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="">Select Faculty</option>
                          {allFaculty.map((f) => (
                            <option key={f._id} value={f._id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                        <input
                          value={mentor.designation || ""}
                          onChange={(e) =>
                            updateMentorDesignation(idx, e.target.value)
                          }
                          placeholder="Designation"
                          className="bg-black border border-white/10 text-sm rounded-lg px-3 py-2 text-white focus:outline-none"
                          disabled={!mentor.facultyId}
                        />
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        id={`mentor-file-${idx}`}
                        onChange={(e) =>
                          handleMentorPhoto(idx, e.target.files[0])
                        }
                      />
                      <label
                        htmlFor={`mentor-file-${idx}`}
                        className="cursor-pointer p-2 text-zinc-500 hover:text-white"
                      >
                        <CloudUpload size={18} />
                      </label>
                      <button
                        onClick={() => removeMentor(idx)}
                        className="p-2 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 p-6 flex justify-between items-center z-20">
              <button
                onClick={closeForm}
                className="px-6 py-3 text-zinc-400 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveCourse}
                disabled={saving}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} /> Save Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
