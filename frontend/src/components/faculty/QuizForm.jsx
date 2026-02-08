import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Check, HelpCircle, FileCheck } from "lucide-react"; // Added FileCheck icon

const API_BASE = "http://localhost:5000/api";

const QuizForm = ({ authToken, assignedCourses, editingQuiz, setShowQuizForm, fetchQuizzes, resetQuizForm }) => {
    // Quiz Form Fields
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [quizInstructions, setQuizInstructions] = useState("");
    const [quizCourseId, setQuizCourseId] = useState("");
    
    // ✅ NEW STATE: Is Final Exam
    const [isFinalExam, setIsFinalExam] = useState(false);

    const [questions, setQuestions] = useState([{
        questionText: "",
        questionDescription: "",
        type: "radio",
        options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }]
    }]);

    // Initialize form with editing quiz data
    useEffect(() => {
        if (editingQuiz) {
            setQuizTitle(editingQuiz.title);
            setQuizDescription(editingQuiz.description);
            setQuizInstructions(editingQuiz.instructions || "");
            setQuizCourseId(editingQuiz.courseId);
            setIsFinalExam(editingQuiz.isFinalExam || false); // ✅ Load state
            
            const mappedQuestions = editingQuiz.questions.map(q => ({
                ...q,
                questionDescription: q.questionDescription || ""
            }));
            setQuestions(mappedQuestions);
        } else {
            resetForm();
        }
    }, [editingQuiz]);

    const resetForm = () => {
        setQuizTitle("");
        setQuizDescription("");
        setQuizInstructions("");
        setQuizCourseId("");
        setIsFinalExam(false); // ✅ Reset state
        setQuestions([{
            questionText: "",
            questionDescription: "",
            type: "radio",
            options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }]
        }]);
    };

    // Question Functions (Identical to previous code)
    const addQuestion = () => setQuestions([...questions, { 
        questionText: "", questionDescription: "", type: "radio", 
        options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] 
    }]);
    const removeQuestion = (qIdx) => setQuestions(questions.filter((_, i) => i !== qIdx));
    const updateQuestionText = (qIdx, text) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, questionText: text } : q));
    const updateQuestionType = (qIdx, type) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, type: type, options: q.options.map(o => ({...o, isCorrect: false})) } : q));
    const updateQuestionDescription = (qIdx, description) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, questionDescription: description } : q));
    const addOption = (qIdx) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, options: [...q.options, { text: "", isCorrect: false }] } : q));
    const removeOption = (qIdx, oIdx) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q));
    const updateOptionText = (qIdx, oIdx, text) => setQuestions(questions.map((q, i) => i === qIdx ? { ...q, options: q.options.map((opt, j) => j === oIdx ? { ...opt, text } : opt) } : q));
    const toggleCorrectOption = (qIdx, oIdx) => {
        setQuestions(questions.map((q, i) => {
            if (i !== qIdx) return q;
            if (q.type === 'radio') {
                return { ...q, options: q.options.map((opt, j) => ({ ...opt, isCorrect: j === oIdx })) };
            } else {
                return { ...q, options: q.options.map((opt, j) => j === oIdx ? { ...opt, isCorrect: !opt.isCorrect } : opt) };
            }
        }));
    };

    // Save Quiz
    const saveQuiz = async () => {
        if (!quizTitle || !quizCourseId || questions.length === 0) {
            return alert("Please fill Title, Select Course, and add Questions.");
        }
        
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const correctCount = q.options.filter(o => o.isCorrect).length;
            if (q.type === 'radio' && correctCount !== 1) return alert(`Q${i+1} (Radio) needs exactly 1 correct answer.`);
            if (q.type === 'checkbox' && correctCount < 1) return alert(`Q${i+1} (Checkbox) needs at least 1 correct answer.`);
        }
        
        const quizData = {
            title: quizTitle, 
            description: quizDescription, 
            instructions: quizInstructions,
            courseId: quizCourseId,
            isFinalExam, // ✅ Send Flag to Backend
            questions
        };
        
        try {
            const url = editingQuiz ? `${API_BASE}/faculty/quizzes/${editingQuiz._id}` : `${API_BASE}/faculty/quizzes`;
            const method = editingQuiz ? "PUT" : "POST";
            const res = await fetch(url, {
                method, 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify(quizData)
            });
            
            if (res.ok) {
                alert("Quiz Saved Successfully!");
                setShowQuizForm(false); 
                resetQuizForm();
                fetchQuizzes();
            } else {
                const errData = await res.json(); 
                alert(`Error: ${errData.message}`);
            }
        } catch (err) { 
            alert("Network Error"); 
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowQuizForm(false)}></div>
            <div className="relative w-full max-w-5xl bg-zinc-950 h-full shadow-2xl overflow-y-auto border-l border-zinc-800 animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10 border-b border-zinc-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</h2>
                        <p className="text-sm text-zinc-500">Configure questions and assignment settings.</p>
                    </div>
                    <button onClick={() => setShowQuizForm(false)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                        <X size={24} />
                    </button>
                </div>
              
                <div className="p-8 space-y-8">
                    {/* Section: Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">Quiz Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* --- ✅ NEW: FINAL EXAM CHECKBOX --- */}
                            <div className="md:col-span-2 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-white flex items-center gap-2">
                                        <FileCheck size={18} className="text-violet-500"/>
                                        Final Exam Mode
                                    </label>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        If enabled, students will be required to upload an answer sheet/file.
                                    </p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                        type="checkbox" 
                                        name="toggle" 
                                        id="toggle" 
                                        checked={isFinalExam}
                                        onChange={(e) => setIsFinalExam(e.target.checked)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                                        style={{ right: isFinalExam ? '0' : '50%' }}
                                    />
                                    <label 
                                        htmlFor="toggle" 
                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer border border-zinc-700 ${isFinalExam ? 'bg-violet-600' : 'bg-zinc-800'}`}
                                    ></label>
                                </div>
                            </div>
                            {/* ----------------------------------- */}

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Title</label>
                                <input 
                                    value={quizTitle} 
                                    onChange={e => setQuizTitle(e.target.value)} 
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                                    placeholder="e.g. Mid-Term Assessment" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Assign to Course</label>
                                <select 
                                    value={quizCourseId} 
                                    onChange={e => setQuizCourseId(e.target.value)} 
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                                >
                                    <option value="">Select a course</option>
                                    {assignedCourses.map(course => (
                                        <option key={course.courseId} value={course.courseId}>{course.subject}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Instructions (Optional)</label>
                                <input 
                                    value={quizInstructions} 
                                    onChange={e => setQuizInstructions(e.target.value)} 
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                                    placeholder="e.g. 1 point deduction for wrong answers." 
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Description (Optional)</label>
                                <textarea 
                                    value={quizDescription} 
                                    onChange={e => setQuizDescription(e.target.value)} 
                                    rows="2" 
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                                    placeholder="A brief overview of the quiz topics."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    
                    {/* Section: Questions */}
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">Questions ({questions.length})</h3>
                            <button onClick={addQuestion} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                                <Plus size={16}/> Add Question
                            </button>
                        </div>
                        
                        <div className="space-y-8">
                            {questions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-bold text-white">Question {qIdx + 1}</h4>
                                        <button onClick={() => removeQuestion(qIdx)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Question Type */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-400">Question Type</label>
                                            <select 
                                                value={q.type} 
                                                onChange={e => updateQuestionType(qIdx, e.target.value)} 
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                            >
                                                <option value="radio">Single Choice (Radio)</option>
                                                <option value="checkbox">Multiple Choice (Checkbox)</option>
                                            </select>
                                        </div>
                                        
                                        {/* Question Text */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-400">Question Text</label>
                                            <textarea 
                                                value={q.questionText} 
                                                onChange={e => updateQuestionText(qIdx, e.target.value)} 
                                                rows="2" 
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                                                placeholder="Enter the question here..." 
                                                required
                                            ></textarea>
                                        </div>
                                      
                                        {/* Question Description */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                                                Question Description/Hint <HelpCircle size={14} className="text-zinc-500"/> (Optional)
                                            </label>
                                            <textarea
                                                value={q.questionDescription}
                                                onChange={e => updateQuestionDescription(qIdx, e.target.value)}
                                                rows="2"
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                                placeholder="Provide an optional explanation or hint for this question."
                                            ></textarea>
                                        </div>
                                        
                                        {/* Options */}
                                        <div className="pt-2">
                                            <h5 className="text-sm font-bold text-zinc-300 mb-3">
                                                Options ({q.type === 'radio' ? 'Select ONE correct answer' : 'Select AT LEAST ONE correct answer'})
                                            </h5>
                                            <div className="space-y-2">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCorrectOption(qIdx, oIdx)}
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors border ${opt.isCorrect ? 'bg-green-600 border-green-600 text-white' : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:bg-zinc-800'}`}
                                                        >
                                                            {q.type === 'radio' ? (
                                                                opt.isCorrect ? <Check size={14}/> : <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                                                            ) : (
                                                                opt.isCorrect ? <Check size={14}/> : <div className="w-3 h-3 border border-zinc-600 rounded-sm"></div>
                                                            )}
                                                        </button>
                                                        <input
                                                            value={opt.text}
                                                            onChange={e => updateOptionText(qIdx, oIdx, e.target.value)}
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                                            required
                                                        />
                                                        <button 
                                                            onClick={() => removeOption(qIdx, oIdx)} 
                                                            disabled={q.options.length <= 2} 
                                                            type="button" 
                                                            className={`p-2 transition-colors ${q.options.length <= 2 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-500 hover:text-red-400'}`}
                                                        >
                                                            <X size={16}/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => addOption(qIdx)} type="button" className="mt-3 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1.5">
                                                <Plus size={14}/> Add Option
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  
                    {/* Save Button */}
                    <div className="sticky bottom-0 bg-zinc-950/90 border-t border-zinc-800 -mx-8 px-8 py-5 flex justify-end">
                        <button onClick={saveQuiz} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-900/30 transition transform active:scale-95">
                            <Check size={20}/> <span>{editingQuiz ? "Update Quiz" : "Create Quiz"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizForm;