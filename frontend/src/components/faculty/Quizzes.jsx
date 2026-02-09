import React, { useState } from "react";
import {
    Plus, Trash2, Edit, BookOpen, Clock,
    MoreVertical, FileCheck, AlertCircle
} from "lucide-react";
import QuizForm from "./QuizForm"; // Ensure this path is correct

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const Quizzes = ({ authToken, assignedCourses, quizzes, fetchQuizzes, allQuizResults = {} }) => {
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);

    // Delete Quiz Handler
    const handleDelete = async (quizId) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_BASE}/faculty/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) {
                fetchQuizzes();
            } else {
                alert("Failed to delete quiz");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Edit Quiz Handler
    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);
        setShowQuizForm(true);
    };

    // Open Create Modal
    const handleCreate = () => {
        setEditingQuiz(null);
        setShowQuizForm(true);
    };

    // Reset Form
    const resetQuizForm = () => {
        setEditingQuiz(null);
        setShowQuizForm(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <div>
                    <h2 className="text-xl font-bold text-white">My Quizzes</h2>
                    <p className="text-sm text-zinc-500">Manage assessments and exams for your courses.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg shadow-violet-900/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Create Quiz
                </button>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                        <BookOpen size={48} className="mx-auto text-zinc-600 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-400">No quizzes created yet</h3>
                        <p className="text-zinc-600 mb-6">Create your first assessment to get started.</p>
                        <button onClick={handleCreate} className="text-violet-400 hover:text-violet-300 font-medium">Create Now</button>
                    </div>
                ) : (
                    quizzes.map((quiz) => {
                        // ✅ SAFE ACCESS: Prevents the "Cannot read properties of undefined" error
                        // We default to an empty object if allQuizResults is undefined
                        const stats = allQuizResults?.[quiz._id] || { attempts: 0, avgScore: 0 };

                        return (
                            <div key={quiz._id} className="group bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden flex flex-col relative">

                                {/* ✅ FINAL EXAM BADGE */}
                                {quiz.isFinalExam && (
                                    <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                                        Final Exam
                                    </div>
                                )}

                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-violet-500/30 transition-colors">
                                            {quiz.isFinalExam ? (
                                                <FileCheck size={24} className="text-violet-400" />
                                            ) : (
                                                <BookOpen size={24} className="text-zinc-400 group-hover:text-white" />
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(quiz)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(quiz._id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{quiz.title}</h3>
                                    <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{quiz.description || "No description provided."}</p>

                                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                                        <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                            <AlertCircle size={12} /> {quiz.questions?.length || 0} Qs
                                        </span>
                                        {/* Optional: Show course name if available in your data */}
                                        {/* <span>Course ID: {quiz.courseId.toString().slice(-4)}</span> */}
                                    </div>
                                </div>

                                {/* Footer (Optional Stats Placeholder) */}
                                <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                                    <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                                    {quiz.isFinalExam && <span className="text-violet-500 font-medium">File Upload Req.</span>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Quiz Form Modal */}
            {showQuizForm && (
                <QuizForm
                    authToken={authToken}
                    assignedCourses={assignedCourses}
                    editingQuiz={editingQuiz}
                    setShowQuizForm={setShowQuizForm}
                    fetchQuizzes={fetchQuizzes}
                    resetQuizForm={resetQuizForm}
                />
            )}
        </div>
    );
};

export default Quizzes;