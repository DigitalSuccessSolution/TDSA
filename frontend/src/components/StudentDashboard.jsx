// import React, { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   BookOpen, Trophy, PlayCircle, Loader2, LogOut, ChevronRight, 
//   User, Mail, Shield, LayoutDashboard, BrainCircuit, Sparkles, Clock, CheckCircle, XCircle 
// } from 'lucide-react';

// const StudentDashboard = () => {
//   const { user, token, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [dashboardData, setDashboardData] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('courses');

//   useEffect(() => {
//     if(!token) return;
//     fetchDashboardData();
//   }, [token]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (!res.ok) throw new Error("Failed to fetch enrollments");
//       const enrollments = await res.json();
      
//       const fullData = await Promise.all(enrollments.map(async (enrollment) => {
//         const courseId = enrollment.course?._id || enrollment.course || enrollment.courseId;
//         if (!courseId) return null;

//         let quizzes = [];
//         let courseDetails = enrollment.course;

//         try {
//           if (typeof enrollment.course === 'string' || !enrollment.course?.subject) {
//              const cRes = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);
//              if(cRes.ok) courseDetails = await cRes.json();
//           }

//           const qRes = await fetch(`${import.meta.env.VITE_API_URL}/api/student/quizzes/${courseId}`, {
//              headers: { Authorization: `Bearer ${token}` }
//           });
          
//           if(qRes.ok) {
//              const qData = await qRes.json();
//              quizzes = Array.isArray(qData) ? qData : [];
//           }
//         } catch (err) { console.error("Error fetching sub-data", err); }

//         return {
//           ...enrollment,
//           course: courseDetails,
//           quizzes: quizzes
//         };
//       }));

//       setDashboardData(fullData.filter(item => item !== null));

//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const getAllQuizzes = () => {
//     let all = [];
//     dashboardData.forEach(item => {
//         if(!item.course) return;
//         if(item.quizzes?.length > 0) {
//             all = [...all, ...item.quizzes.map(q => ({
//                 ...q, 
//                 courseName: item.course.subject
//             }))];
//         }
//     });
//     return all;
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2 className="animate-spin text-slate-900 w-8 h-8" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-6xl mx-auto px-6 py-8">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-12 pb-6 border-b border-slate-200">
//           <div>
//             <h1 className="text-3xl font-semibold text-slate-900 mb-1">
//               Welcome back, {user?.name?.split(' ')[0]}
//             </h1>
//             <p className="text-slate-500">Track your learning progress</p>
//           </div>
//           <button 
//             onClick={handleLogout} 
//             className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
//           >
//             <LogOut size={18} />
//             <span>Sign out</span>
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
//                 <BookOpen size={20} className="text-blue-600" />
//               </div>
//               <span className="text-sm font-medium text-slate-500">Enrolled Courses</span>
//             </div>
//             <p className="text-3xl font-semibold text-slate-900">{dashboardData.length}</p>
//           </div>

//           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
//                 <BrainCircuit size={20} className="text-purple-600" />
//               </div>
//               <span className="text-sm font-medium text-slate-500">Total Quizzes</span>
//             </div>
//             <p className="text-3xl font-semibold text-slate-900">{getAllQuizzes().length}</p>
//           </div>

//           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
//                 <CheckCircle size={20} className="text-green-600" />
//               </div>
//               <span className="text-sm font-medium text-slate-500">Completed</span>
//             </div>
//             <p className="text-3xl font-semibold text-slate-900">
//               {getAllQuizzes().filter(q => q.attempted).length}
//             </p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-8 border-b border-slate-200">
//           <button 
//             onClick={() => setActiveTab('courses')} 
//             className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
//               activeTab === 'courses' 
//                 ? 'text-slate-900 border-b-2 border-slate-900' 
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             <LayoutDashboard size={18} />
//             Courses
//           </button>
//           <button 
//             onClick={() => setActiveTab('quizzes')} 
//             className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
//               activeTab === 'quizzes' 
//                 ? 'text-slate-900 border-b-2 border-slate-900' 
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             <Trophy size={18} />
//             Quizzes
//           </button>
//         </div>

//         {/* Content */}
//         <div>
//           {activeTab === 'courses' && (
//             <div className="grid gap-6 md:grid-cols-2">
//               {dashboardData.length === 0 ? (
//                 <div className="col-span-full text-center py-16">
//                   <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
//                   <h3 className="text-xl font-medium text-slate-900 mb-2">No courses yet</h3>
//                   <p className="text-slate-500 mb-6">Start learning by enrolling in a course</p>
//                   <Link 
//                     to="/" 
//                     className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
//                   >
//                     Browse Courses
//                   </Link>
//                 </div>
//               ) : (
//                 dashboardData.map((item) => (
//                   <div 
//                     key={item._id} 
//                     className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all overflow-hidden"
//                   >
//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
//                           <BookOpen size={24} className="text-slate-600" />
//                         </div>
//                         <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
//                           Active
//                         </span>
//                       </div>
//                       <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                         {item.course?.subject || "Loading..."}
//                       </h3>
//                       <p className="text-slate-500 text-sm mb-6 line-clamp-2">
//                         {item.course?.description || "No description."}
//                       </p>
//                       <Link 
//                         to={`/curriculum/${item.course?.subject?.replace(/\s+/g, '-')}`} 
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
//                       >
//                         <PlayCircle size={16} />
//                         Continue Learning
//                       </Link>
//                     </div>
//                     <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
//                       <span className="text-sm text-slate-600">
//                         {item.quizzes?.length || 0} Quizzes
//                       </span>
//                       {item.quizzes?.length > 0 && (
//                         <button 
//                           onClick={() => setActiveTab('quizzes')} 
//                           className="text-sm text-slate-900 font-medium hover:text-slate-700 flex items-center gap-1"
//                         >
//                           View all
//                           <ChevronRight size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}

//           {activeTab === 'quizzes' && (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {getAllQuizzes().length === 0 ? (
//                 <div className="col-span-full text-center py-16">
//                   <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
//                   <h3 className="text-xl font-medium text-slate-900 mb-2">No quizzes available</h3>
//                   <p className="text-slate-500">Check back later for new quizzes</p>
//                 </div>
//               ) : (
//                 getAllQuizzes().map((quiz) => (
//                   <div 
//                     key={quiz._id} 
//                     className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all p-6 flex flex-col"
//                   >
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-4">
//                         {quiz.attempted ? (
//                           <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
//                             <CheckCircle size={16} />
//                             Completed
//                           </span>
//                         ) : (
//                           <span className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
//                             <Clock size={16} />
//                             Pending
//                           </span>
//                         )}
//                         <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
//                           {quiz.questions?.length || 0} Questions
//                         </span>
//                       </div>
                      
//                       <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                         {quiz.title}
//                       </h3>
//                       <p className="text-sm text-slate-500 mb-4">
//                         {quiz.courseName}
//                       </p>

//                       {quiz.attempted && (
//                         <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-green-700 font-medium">Score</span>
//                             <span className="text-lg font-semibold text-green-900">
//                               {quiz.score}/{quiz.totalMarks}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
                    
//                     {quiz.attempted ? (
//                       <button 
//                         disabled 
//                         className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
//                       >
//                         Completed
//                       </button>
//                     ) : (
//                       <Link 
//                         to={`/quiz/${quiz._id}`} 
//                         className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium text-center hover:bg-slate-800 transition-colors"
//                       >
//                         Start Quiz
//                       </Link>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;