import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Trophy, PlayCircle, Loader2, LogOut, ChevronRight,
  LayoutDashboard, BrainCircuit, CheckCircle, Clock,
  Target, Zap, ArrowUpRight, Award, FileCheck // ✅ Added FileCheck icon
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    if (!token) return;
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch enrollments");
      const enrollments = await res.json();

      const fullData = await Promise.all(enrollments.map(async (enrollment) => {
        const courseId = enrollment.course?._id || enrollment.course || enrollment.courseId;
        if (!courseId) return null;

        let quizzes = [];
        let courseDetails = enrollment.course;

        try {
          if (typeof enrollment.course === 'string' || !enrollment.course?.subject) {
            const cRes = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);
            if (cRes.ok) courseDetails = await cRes.json();
          }
          const qRes = await fetch(`${import.meta.env.VITE_API_URL}/api/student/quizzes/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (qRes.ok) quizzes = await qRes.json();
        } catch (err) { console.error(err); }

        return {
          ...enrollment,
          course: courseDetails,
          quizzes: Array.isArray(quizzes) ? quizzes : []
        };
      }));

      setDashboardData(fullData.filter(item => item !== null));
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAllQuizzes = () => {
    let all = [];
    dashboardData.forEach(item => {
      if (!item.course) return;
      if (item.quizzes?.length > 0) {
        all = [...all, ...item.quizzes.map(q => ({ ...q, courseName: item.course.subject }))];
      }
    });
    return all;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-white w-12 h-12 mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-5 lg:mb-16 pb-8 border-b border-zinc-800/50">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold mg-1 lg:mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.name?.split(' ')[0]}</span>👋🏻
            </h1>
            <p className="text-zinc-500 text-sm lg:text-lg">Continue your learning journey</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 lg:px-5 py-2 lg:py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all text-zinc-400 hover:text-white border border-zinc-800"
          >
            <LogOut size={16} />
            <span className="font-sm lg:font-medium">Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 lg:mb-16">
          <div className="group bg-zinc-900  border border-zinc-800 rounded-2xl p-2 lg:p-5 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-purple-500/10 transition-all flex-shrink-0">
                <BookOpen className="text-purple-400" size={22} />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-bold mb-0.5">{dashboardData.length}</div>
                <div className="text-zinc-500 text-xs lg:text-sm font-medium">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="group bg-zinc-900 border  border-zinc-800 rounded-2xl p-2 lg:p-5 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/10 transition-all flex-shrink-0">
                <BrainCircuit className="text-blue-400" size={22} />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-bold mb-0.5">{getAllQuizzes().length}</div>
                <div className="text-zinc-500 text-xs lg:text-sm font-medium">Total Quizzes</div>
              </div>
            </div>
          </div>

          <div className="group bg-zinc-900  border border-zinc-800 rounded-2xl p-2 lg:p-5 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/10 transition-all flex-shrink-0">
                <Trophy className="text-yellow-400" size={22} />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-bold mb-0.5">{getAllQuizzes().filter(q => q.attempted).length}</div>
                <div className="text-zinc-500 text-xs lg:text-sm font-medium">Completed</div>
              </div>
            </div>
          </div>

          <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-2 lg:p-5 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-green-500/10 transition-all flex-shrink-0">
                <Target className="text-green-400" size={22} />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-bold mb-0.5">
                  {getAllQuizzes().length > 0 ? Math.round((getAllQuizzes().filter(q => q.attempted).length / getAllQuizzes().length) * 100) : 0}%
                </div>
                <div className="text-zinc-500 text-xs lg:text-sm font-medium">Progress Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Tabs */}
        <div className="flex gap-1 mb-12 border-b border-zinc-800/50">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-4 font-semibold transition-all relative ${activeTab === 'courses'
                ? 'text-white'
                : 'text-zinc-600 hover:text-zinc-400'
              }`}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              Courses
            </span>
            {activeTab === 'courses' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-4 font-semibold transition-all relative ${activeTab === 'quizzes'
                ? 'text-white'
                : 'text-zinc-600 hover:text-zinc-400'
              }`}
          >
            <span className="flex items-center gap-2">
              <Trophy size={18} />
              Quizzes
            </span>
            {activeTab === 'quizzes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'courses' && (
            <div className="space-y-3">
              {dashboardData.length === 0 ? (
                <div className="text-center py-10 lg:py-24">
                  <BookOpen size={48} className="mx-auto text-zinc-800 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No courses enrolled</h3>
                  <p className="text-zinc-500 mb-8">Start learning by enrolling in your first course</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-all"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                dashboardData.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-zinc-900/30 hover:bg-zinc-900/50 border-l-2 border-transparent hover:border-purple-500 px-3 md:px-8 py-3 md:py-6 transition-all"
                  >
                    <div className="flex items-center flex-col md:flex-row justify-between gap-8">
                      <div className="flex items-center  gap-3 md:gap-6 flex-1">
                        <div className="w-14 h-14 bg-zinc-900 rounded-xl hidden md:flex items-center justify-center group-hover:bg-zinc-800 transition-all">
                          <BookOpen size={24} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-0 md:mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                              {item.course?.subject || "Loading..."}
                            </h3>
                            <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-[8px] md:text-xs font-bold uppercase">
                              Active
                            </span>
                          </div>
                          <p className="text-zinc-500 text-sm mb-3 max-w-2xl line-clamp-1">
                            {item.course?.description || "No description available."}
                          </p>
                          <div className="flex items-center gap-4 text-zinc-600 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Trophy size={14} />
                              {item.quizzes?.length || 0} Quizzes
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/curriculum/${item.course?.subject?.replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-all whitespace-nowrap"
                      >
                        <PlayCircle size={18} />
                        Continue
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-3">
              {getAllQuizzes().length === 0 ? (
                <div className="text-center py-24">
                  <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No quizzes available</h3>
                  <p className="text-zinc-500">Check back later for new challenges</p>
                </div>
              ) : (
                getAllQuizzes().map((quiz) => (
                  <div
                    key={quiz._id}
                    className="relative group bg-zinc-900/30 hover:bg-zinc-900/50 border-l-2 border-transparent hover:border-blue-500 px-8 py-6 transition-all overflow-hidden"
                  >
                    {/* --- ✅ FINAL EXAM BADGE --- */}
                    {quiz.isFinalExam && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10">
                        Final Exam
                      </div>
                    )}

                    <div className="flex items-center flex-col md:flex-row justify-between gap-8">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-14 h-14 hidden md:flex bg-zinc-900 rounded-xl  items-center justify-center group-hover:bg-zinc-800 transition-all">
                          {quiz.isFinalExam ? (
                            <FileCheck size={24} className="text-purple-400" />
                          ) : (
                            <BrainCircuit size={24} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-0 md:gap-3 justify-between mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                              {quiz.title}
                            </h3>
                            {quiz.attempted ? (
                              <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs font-bold uppercase">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-xs font-bold uppercase">
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-zinc-600 text-sm">
                            <span className="flex items-center gap-1.5">
                              <BookOpen size={14} />
                              {quiz.courseName}
                            </span>
                            <span>•</span>
                            <span className=''>{quiz.questions?.length || 0} Questions</span>
                            {quiz.attempted && (
                              <>
                                <span>•</span>
                                <span className="text-green-400 font-semibold">
                                  Score: {quiz.score}/{quiz.totalMarks}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {quiz.attempted ? (
                          <div className="flex items-center gap-2 px-6 py-3 bg-zinc-800 rounded-lg border border-zinc-700">
                            <Award size={18} className="text-green-400" />
                            <span className="text-zinc-400 font-medium">Completed</span>
                          </div>
                        ) : (
                          <Link
                            to={`/quiz/${quiz._id}`}
                            // --- ✅ Highlight Button for Final Exam ---
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${quiz.isFinalExam
                                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-900/30'
                                : 'bg-white text-black hover:bg-zinc-200'
                              }`}
                          >
                            <Zap size={18} />
                            Start {quiz.isFinalExam ? 'Exam' : 'Quiz'}
                            <ArrowUpRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;