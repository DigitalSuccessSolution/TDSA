import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Loader2, CheckCircle, AlertTriangle, ShieldAlert,
    Maximize, Lock, EyeOff, Menu, SquareCheckBig,
    XCircle, Check, ChevronRight, RotateCcw, HelpCircle,
    Trophy, BarChart2, Upload, FileText, Trash2, Clock
} from 'lucide-react';

// --- Component 1: Question Navigation (Smart Sidebar) ---
const QuestionNavigation = ({ quiz, answers, isResultMode = false, detailedResults = [] }) => {

    const scrollToQuestion = (index) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="sticky top-24 w-full p-5 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-xl">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Menu size={16} className="text-blue-500" />
                {isResultMode ? "Overview" : `Navigator`}
            </h3>
            <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {quiz.questions.map((q, index) => {
                    let btnClass = 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-transparent';

                    if (isResultMode && detailedResults.length > 0) {
                        const resultData = detailedResults.find(r => r.questionId === q._id);
                        if (resultData?.isCorrect) {
                            btnClass = 'bg-green-500/20 text-green-400 border-green-500/50';
                        } else {
                            btnClass = 'bg-red-500/20 text-red-400 border-red-500/50';
                        }
                    } else {
                        const isAnswered = answers[q._id] && answers[q._id].length > 0;
                        if (isAnswered) btnClass = 'bg-blue-600 text-white shadow-lg shadow-blue-900/20';
                    }

                    return (
                        <button
                            key={q._id}
                            onClick={() => scrollToQuestion(index + 1)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-xs transition-all duration-200 ${btnClass}`}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Component 2: Quiz Player (Main) ---
const QuizPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [answers, setAnswers] = useState({});
    const [pdfFile, setPdfFile] = useState(null);
    const [result, setResult] = useState(null);

    // --- NEW: Submission State ---
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- SECURITY STATES ---
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isTerminated, setIsTerminated] = useState(false);

    const MAX_VIOLATIONS_ALLOWED = 3;

    // Refs
    const violationsRef = useRef(0);
    const isTerminatedRef = useRef(false);
    const hasResultRef = useRef(false);
    const isUploadingRef = useRef(false);

    // Sync Refs
    useEffect(() => {
        violationsRef.current = tabSwitchCount;
        isTerminatedRef.current = isTerminated;
        hasResultRef.current = !!result;
    }, [tabSwitchCount, isTerminated, result]);

    useEffect(() => {
        if (user && token) {
            fetchQuizData();
        }
    }, [id, user, token]);

    // --- SECURITY HANDLERS ---
    const enterFullscreen = async () => {
        const elem = document.documentElement;
        try {
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
            setIsFullscreen(true);
        } catch (err) {
            console.error("Fullscreen Error:", err);
        }
    };

    const handleViolation = useCallback((type) => {
        if (hasResultRef.current || isTerminatedRef.current || !isExamStarted || isUploadingRef.current) return;

        const newCount = violationsRef.current + 1;
        setTabSwitchCount(newCount);

        if (newCount >= MAX_VIOLATIONS_ALLOWED) {
            handleTerminateQuiz("Security Violation Limit Reached.");
        } else {
            setWarningMessage(type === 'blur'
                ? "Switching tabs or minimizing window is prohibited!"
                : "You must stay in Full Screen mode!"
            );
            setShowWarning(true);
        }
    }, [isExamStarted]);

    useEffect(() => {
        if (!isExamStarted || result) return;

        const handleVisibilityChange = () => { if (document.hidden) handleViolation('blur'); };
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                handleViolation('fullscreen');
            } else {
                setIsFullscreen(true);
            }
        };
        const handleContextMenu = (e) => { e.preventDefault(); return false; };
        const handleCopyPaste = (e) => { e.preventDefault(); return false; };
        const handleKeyDown = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.altKey && e.key === 'Tab')) {
                e.preventDefault();
            }
        };

        const handleWindowFocus = () => {
            if (isUploadingRef.current) {
                setTimeout(() => { isUploadingRef.current = false; }, 1000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('focus', handleWindowFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [isExamStarted, result, handleViolation]);

    // --- DATA HANDLERS ---
    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/quiz/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load quiz.");
            const data = await res.json();
            setQuiz(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => {
            const currentAnswers = prev[questionId] || [];
            let newAnswers;
            if (currentAnswers.includes(optionId)) {
                newAnswers = currentAnswers.filter(id => id !== optionId);
            } else {
                newAnswers = [...currentAnswers, optionId];
            }
            if (newAnswers.length === 0) {
                const { [questionId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [questionId]: newAnswers };
        });
    };

    const handleResetAnswer = (questionId) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[questionId];
            return newAnswers;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file type. Allowed: PDF, DOC, JPG, PNG");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB.");
                return;
            }
            setPdfFile(file);
        }
    };

    const removeFile = () => {
        setPdfFile(null);
    };

    const handleSubmit = async (isForced = false) => {
        if (isSubmitting) return; // Prevent double clicks

        if (!isForced && !window.confirm("Are you sure you want to finish the exam?")) return;

        if (quiz.isFinalExam && !pdfFile && !isForced) {
            if (!window.confirm("Warning: You haven't uploaded an answer sheet. Submit anyway?")) return;
        }

        setIsSubmitting(true); // Start Loading
        isTerminatedRef.current = true;

        try {
            const formattedResponses = Object.keys(answers).map(qId => ({
                questionId: qId,
                selectedOptions: answers[qId]
            }));

            const formData = new FormData();
            formData.append('answers', JSON.stringify(formattedResponses));

            // ✅ Exact Key for your backend
            if (pdfFile) {
                formData.append('answerSheet', pdfFile);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/quizzes/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                if (document.exitFullscreen) document.exitFullscreen().catch(err => { });
                setResult(data);
                window.scrollTo(0, 0);
            } else {
                alert(data.message || "Submission failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network Error during submission.");
        } finally {
            setIsSubmitting(false); // Stop Loading
        }
    };

    const handleTerminateQuiz = (reason) => {
        if (isTerminatedRef.current) return;
        setIsTerminated(true);
        setShowWarning(false);
        // alert(`EXAM TERMINATED: ${reason}`); // Optional: alert is annoying, UI message is better
        handleSubmit(true);
    };

    const handleStartExam = () => {
        enterFullscreen();
        setIsExamStarted(true);
    };

    const calculateProgress = () => {
        if (!quiz) return 0;
        const answeredCount = Object.keys(answers).filter(qId => answers[qId] && answers[qId].length > 0).length;
        return Math.round((answeredCount / quiz.questions.length) * 100);
    };

    const getQuestionResult = (qId) => result?.detailedResults?.find(r => r.questionId === qId);

    // --- RENDER HELPERS ---
    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            <p className="text-zinc-500 animate-pulse font-medium">Preparing Environment...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#09090b] flex justify-center items-center p-6">
            <div className="text-center">
                <p className="text-red-500 mb-4 text-lg font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700">Retry</button>
            </div>
        </div>
    );

    // =========================================================
    // 1. RESULT VIEW (MODERN UI)
    // =========================================================
    if (result) {
        const percentage = Math.round((result.score / result.totalQuestions) * 100);
        const passed = percentage >= 40;

        return (
            <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans pb-20 select-none">
                {/* Result Header */}
                <div className="bg-zinc-900/50 border-b border-zinc-800 pt-10 pb-10 px-6 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-8">
                                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-[6px] ${passed ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                                    {passed ? <Trophy size={40} /> : <BarChart2 size={40} />}
                                    <div className="absolute -bottom-2 bg-zinc-900 px-2 py-1 rounded-md text-xs font-bold border border-zinc-800 text-white">
                                        {percentage}%
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Assessment Result</h2>
                                    <h1 className="text-xl md:text-4xl font-bold text-white mb-2">{passed ? "Excellent Work!" : "Needs Improvement"}</h1>
                                    <p className="text-zinc-500 text-xs md:text-base flex items-center gap-2">
                                        You answered <span className="text-white font-bold">{result.correctAnswers}</span> out of {result.totalQuestions} correctly.
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/my-courses')} className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-white/5">
                                <ChevronRight className="rotate-180" size={18} /> Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 md:px-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    <div className="space-y-6">
                        {quiz.questions.map((q, index) => {
                            const qResult = getQuestionResult(q._id);
                            const isCorrect = qResult?.isCorrect;

                            return (
                                <div key={q._id} id={`question-${index + 1}`} className={`rounded-2xl border overflow-hidden transition-all ${isCorrect ? 'bg-zinc-900/40 border-zinc-800' : 'bg-red-900/5 border-red-900/20'}`}>
                                    <div className="p-3 md:p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-lg font-medium flex gap-4 leading-relaxed text-zinc-100 pr-4">
                                                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${isCorrect ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    {index + 1}
                                                </span>
                                                {q.questionText}
                                            </h3>
                                            {isCorrect ? <CheckCircle className="text-green-500 flex-shrink-0" /> : <XCircle className="text-red-500 flex-shrink-0" />}
                                        </div>

                                        <div className="grid gap-3">
                                            {q.options.map((opt) => {
                                                const wasSelected = qResult?.selectedOptionIds?.includes(opt._id);

                                                let optionClass = "bg-zinc-900/50 border-zinc-800 text-zinc-400";
                                                let icon = null;

                                                if (wasSelected) {
                                                    if (isCorrect) {
                                                        optionClass = "bg-green-500/10 border-green-500/50 text-white shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]";
                                                        icon = <Check size={16} className="text-green-400" />;
                                                    } else {
                                                        optionClass = "bg-red-500/10 border-red-500/50 text-white";
                                                        icon = <XCircle size={16} className="text-red-400" />;
                                                    }
                                                }

                                                return (
                                                    <div key={opt._id} className={`relative p-4 rounded-xl border flex items-center gap-4 ${optionClass}`}>
                                                        <div className="flex-shrink-0 w-5 flex justify-center">
                                                            {icon}
                                                        </div>
                                                        <span className="text-sm font-medium">{opt.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {(q.questionDescription || q.explanation) && (
                                            <div className="mt-6 pt-5 border-t border-zinc-800/50">
                                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                    <HelpCircle size={16} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Explanation</span>
                                                </div>
                                                <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                                                    {q.questionDescription || q.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden lg:block">
                        <QuestionNavigation quiz={quiz} answers={answers} isResultMode={true} detailedResults={result.detailedResults} />
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // 2. START SCREEN (MODERNIZED)
    // =========================================================
    if (!isExamStarted) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
                <div className="max-w-lg w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-80"></div>

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-zinc-700">
                            <Lock size={36} className="text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">{quiz.title}</h1>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <ShieldAlert size={14} className="text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Proctored Environment</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition">
                            <Maximize size={22} className="text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="text-white font-medium text-sm">Full Screen Required</h3>
                                <p className="text-zinc-500 text-xs mt-1">The system will force full-screen mode.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition">
                            <EyeOff size={22} className="text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="text-white font-medium text-sm">Focus Tracking</h3>
                                <p className="text-zinc-500 text-xs mt-1">Tab switching allows max <b>{MAX_VIOLATIONS_ALLOWED} violations</b>.</p>
                            </div>
                        </div>
                        {quiz.isFinalExam && (
                            <div className="flex items-start gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                                <Upload size={22} className="text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <h3 className="text-blue-100 font-medium text-sm">Answer Sheet Upload</h3>
                                    <p className="text-blue-300/60 text-xs mt-1">Upload PDF/Image before final submission.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStartExam}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-xl shadow-white/5 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                        Start Assessment <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    // =========================================================
    // 3. QUIZ ATTEMPT VIEW (MODERN & SIMPLE)
    // =========================================================
    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans pb-32 relative select-none" onContextMenu={(e) => e.preventDefault()}>

            {/* Modern Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-red-500/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Proctoring Alert</h3>
                        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">{warningMessage}</p>

                        <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/20 mb-6 flex justify-between items-center">
                            <span className="text-red-300 text-xs font-medium uppercase tracking-wider">Violations Left</span>
                            <span className="text-2xl font-bold text-red-500">{MAX_VIOLATIONS_ALLOWED - tabSwitchCount}</span>
                        </div>

                        <button
                            onClick={() => { setShowWarning(false); enterFullscreen(); }}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
                        >
                            Return to Assessment
                        </button>
                    </div>
                </div>
            )}

            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-lg border-b border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live
                        </span>
                        <h1 className="text-sm font-semibold text-zinc-300 hidden md:block">{quiz.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Progress</span>
                            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out" style={{ width: `${calculateProgress()}%` }}></div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-white w-8 text-right">{calculateProgress()}%</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
                <div>
                    <div className="space-y-8">
                        {quiz.questions.map((q, index) => (
                            <div key={q._id} id={`question-${index + 1}`} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors duration-300">
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg md:text-xl font-medium flex gap-5 leading-relaxed text-zinc-100 pr-4">
                                            <span className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700/50">
                                                {index + 1}
                                            </span>
                                            <span className="select-none pointer-events-none">{q.questionText}</span>
                                        </h3>
                                        {answers[q._id] && answers[q._id].length > 0 && (
                                            <button onClick={() => handleResetAnswer(q._id)} className="text-xs font-medium text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                                                <RotateCcw size={12} /> Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-3">
                                        {q.options.map((opt) => {
                                            const isSelected = answers[q._id]?.includes(opt._id);
                                            return (
                                                <div
                                                    key={opt._id}
                                                    onClick={() => handleOptionSelect(q._id, opt._id)}
                                                    className={`group relative p-4 pl-12 rounded-xl border cursor-pointer transition-all duration-200 select-none ${isSelected ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_10px_-2px_rgba(37,99,235,0.2)]' : 'bg-zinc-950/30 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600'}`}
                                                >
                                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                                                        <Check size={12} className={`text-white transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                                                    </div>
                                                    <span className={`text-sm md:text-base ${isSelected ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{opt.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* --- FILE UPLOAD SECTION (MODERN) --- */}
                        {quiz.isFinalExam && (
                            <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-dashed border-zinc-700 p-8 mt-10 text-center">
                                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Upload size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Upload Answer Sheet</h3>
                                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">Please upload your final answer sheet (PDF or Image) to complete the submission process.</p>

                                {!pdfFile ? (
                                    <label
                                        onClick={() => { isUploadingRef.current = true; }}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium cursor-pointer transition border border-zinc-700 hover:border-zinc-600"
                                    >
                                        <span>Select File</span>
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                            <FileText size={20} className="text-blue-400" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-white truncate max-w-[150px]">{pdfFile.name}</p>
                                                <p className="text-[10px] text-zinc-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button onClick={removeFile} className="p-3 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-xl transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:block">
                    <QuestionNavigation quiz={quiz} answers={answers} />
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#09090b]/90 backdrop-blur-xl border-t border-zinc-800 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
                    <div className="hidden md:flex items-center gap-2 text-zinc-500 text-xs font-medium">
                        <ShieldAlert size={14} />
                        PROCTORED SESSION ID: {id.slice(-6).toUpperCase()}
                    </div>

                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                        className={`
                            px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-3 shadow-xl transition-all
                            ${isSubmitting
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <SquareCheckBig size={20} />
                                Submit Assessment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;