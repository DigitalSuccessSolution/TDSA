import React, { useState, useEffect } from "react";
import { BookA, Briefcase, CandlestickChart, LogOut, LucidePictureInPicture, User } from "lucide-react";
import LectureLinks from "./LectureLinks";
import Quizzes from "./Quizzes";
import Results from "./Results"; // ✅ Ensure Results.js is imported

const API_BASE = "http://localhost:5000/api";

const FacultyDashboard = () => {
    // --- Auth & Profile States ---
    const [authToken, setAuthToken] = useState(null);
    const [facultyProfile, setFacultyProfile] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("lecture-links");
    
    // --- Data States ---
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    // --- Initial Load ---
    useEffect(() => {
        const token = localStorage.getItem('facultyToken');
        if (token) {
            setAuthToken(token);
            fetchFacultyProfile(token);
        } else {
            console.warn("Faculty token not found.");
            setError("Authentication token missing. Please log in.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            fetchAssignedCourses();
            fetchQuizzes();
        }
    }, [authToken]);

    // --- API Helpers ---
    const fetchFacultyProfile = async (token) => {
        try { 
            const res = await fetch(`${API_BASE}/faculty/me`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            }); 
            if (res.ok) setFacultyProfile(await res.json()); 
        } catch (err) { console.error(err); }
    };

    const fetchAssignedCourses = async () => {
        setLoading(true);
        try { 
            const res = await fetch(`${API_BASE}/faculty/courses`, { 
                headers: { 'Authorization': `Bearer ${authToken}` } 
            }); 
            if (res.ok) {
                setAssignedCourses(await res.json());
            } else {
                console.error("Failed to load courses");
            }
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    const fetchQuizzes = async () => {
        setLoading(true);
        try { 
            const res = await fetch(`${API_BASE}/faculty/quizzes`, { 
                headers: { 'Authorization': `Bearer ${authToken}` } 
            }); 
            if (res.ok) setQuizzes(await res.json()); 
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('facultyToken');
        window.location.reload();
    };

    if (error) return (
        <div className="min-h-screen bg-black text-zinc-100 flex justify-center items-center flex-col gap-4">
            <Briefcase size={48} className="text-violet-500" />
            <div className="text-xl font-semibold">Authentication Error</div>
            <p className="text-zinc-500">Please login to access the faculty portal. </p>
            <button onClick={() => window.location.href = '/faculty/login'} className="mt-4 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-md shadow-violet-900/20 transition-colors">Go to Login</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-violet-900/50">
            {/* --- TOPBAR --- */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/20">
                            <Briefcase size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white leading-none">Faculty<span className="text-zinc-500">Portal</span></h1>
                            <span className="text-xs text-zinc-500 font-medium tracking-wide">INSTRUCTOR DASHBOARD</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/50">
                        <button onClick={() => setActiveTab("lecture-links")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "lecture-links" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}>
                            <LucidePictureInPicture size={16} /> Lecture Links
                        </button>
                        <button onClick={() => setActiveTab("quizzes")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "quizzes" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}>
                            <BookA size={16} /> My Quizzes
                        </button>
                        <button onClick={() => setActiveTab("results")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "results" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}>
                            <CandlestickChart size={16} /> Results
                        </button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-zinc-800">
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">{facultyProfile.name}</div>
                                <div className="text-xs text-zinc-500">{facultyProfile.email}</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <User size={16} className="text-zinc-400" />
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {activeTab === "lecture-links" && (
                    <LectureLinks 
                        authToken={authToken}
                        assignedCourses={assignedCourses}
                        loading={loading}
                        fetchAssignedCourses={fetchAssignedCourses}
                    />
                )}
                
                {activeTab === "quizzes" && (
                    <Quizzes 
                        authToken={authToken}
                        assignedCourses={assignedCourses}
                        quizzes={quizzes}
                        loading={loading}
                        fetchQuizzes={fetchQuizzes}
                    />
                )}
                
                {activeTab === "results" && (
                    <Results 
                        authToken={authToken}
                        quizzes={quizzes} // ✅ Passed Quizzes list to populate dropdown
                    />
                )}
            </main>
        </div>
    );
};

export default FacultyDashboard;