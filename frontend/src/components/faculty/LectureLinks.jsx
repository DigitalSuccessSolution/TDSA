import React, { useState } from "react";
import { 
  Plus, Trash2, Video, FileVideo, Archive, Globe, X, 
  Loader2, Link as LinkIcon, ExternalLink, PlayCircle 
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const LectureLinks = ({ authToken, assignedCourses, loading, fetchAssignedCourses }) => {
    // --- UI States ---
    const [currentContext, setCurrentContext] = useState(null);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [newLinkType, setNewLinkType] = useState("Live");
    const [isSaving, setIsSaving] = useState(false);

    // --- Logic Functions (Kept exactly same as your code) ---
    const addLectureLink = async () => {
        if (!newLinkUrl.trim()) return alert("Please enter a valid URL!");
        if (!currentContext) return alert("Error: Lecture context missing.");

        const { courseId, moduleId, lectureId } = currentContext;
        setIsSaving(true);

        try {
            const res = await fetch(
                `${API_BASE}/faculty/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}/link`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ url: newLinkUrl.trim(), type: newLinkType }),
                }
            );

            if (res.ok) {
                setShowLinkForm(false);
                setCurrentContext(null);
                setNewLinkUrl("");
                setNewLinkType("Live");
                await fetchAssignedCourses();
            } else {
                const err = await res.json();
                alert(err.message || "Failed to add link");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLectureLink = async (courseId, moduleId, lectureId, linkId) => {
        if (!confirm("Delete this link permanently?")) return;
        try {
            const res = await fetch(
                `${API_BASE}/faculty/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}/link/${linkId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            if (res.ok) await fetchAssignedCourses();
            else alert("Delete failed");
        } catch (err) {
            alert("Delete failed");
        }
    };

    // --- Styling Helpers ---
    const getLinkConfig = (type) => {
        switch (type) {
            case "Live":
                return { icon: <Video size={14} />, style: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20" };
            case "Recording":
                return { icon: <PlayCircle size={14} />, style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" };
            case "Backup":
                return { icon: <Archive size={14} />, style: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" };
            default:
                return { icon: <LinkIcon size={14} />, style: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20" };
        }
    };

    // --- Sub-Component: The Link Pill ---
    const LinkPill = ({ link, context }) => {
        const config = getLinkConfig(link.type);

        return (
            <div className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border transition-all duration-200 ${config.style}`}>
                <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 text-xs font-medium hover:underline decoration-white/30 underline-offset-2"
                >
                    {config.icon}
                    <span>{link.type}</span>
                    <ExternalLink size={10} className="opacity-50" />
                </a>
                
                <div className="w-px h-3 bg-current opacity-20 mx-1"></div>

                <button
                    onClick={() => deleteLectureLink(context.courseId, context.moduleId, context.lectureId, link._id)}
                    className="p-1 rounded-full hover:bg-black/20 text-current transition-colors opacity-60 group-hover:opacity-100"
                    title="Remove Link"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30">
            {/* Background Decoration (Glows) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                
                {/* Header */}
                <div className="mb-8 lg:mb-16">
                    <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
                            Resource Manager
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm lg:text-lg font-light">
                        Organize streaming and recording links for your curriculum.
                    </p>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 animate-pulse">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <span className="text-zinc-600 text-sm tracking-widest uppercase">Loading Resources...</span>
                    </div>
                ) : assignedCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
                        <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                            <Archive className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">No courses assigned to you yet.</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {assignedCourses.map((course) => (
                            <div key={course.courseId} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                
                                {/* Course Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                                        {course.subject}
                                    </h2>
                                </div>

                                {/* Modules Grid */}
                                <div className="grid gap-6">
                                    {course.modules?.map((module) => (
                                        <div 
                                            key={module._id} 
                                            className="group bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors duration-300"
                                        >
                                            {/* Module Title */}
                                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                                    {module.title}
                                                </h3>
                                            </div>

                                            {/* Lectures List */}
                                            <div className="divide-y divide-white/5">
                                                {module.lectures.map((lecture) => {
                                                    const context = {
                                                        courseId: course.courseId,
                                                        moduleId: module._id,
                                                        lectureId: lecture._id,
                                                        lectureTitle: lecture.title,
                                                        moduleTitle: module.title
                                                    };

                                                    return (
                                                        <div key={lecture._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                                            {/* Left: Title */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500">
                                                                        <FileVideo size={16} />
                                                                    </div>
                                                                    <span className="text-zinc-200 font-medium truncate">
                                                                        {lecture.title || "Untitled Lecture"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Right: Links & Actions */}
                                                            <div className="flex items-center gap-3 flex-wrap justify-end">
                                                                {lecture.lectureLinks?.map((link) => (
                                                                    <LinkPill key={link._id} link={link} context={context} />
                                                                ))}

                                                                {/* Add Button */}
                                                                <button
                                                                    onClick={() => {
                                                                        setCurrentContext(context);
                                                                        setShowLinkForm(true);
                                                                        setNewLinkUrl("");
                                                                    }}
                                                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-zinc-600 text-zinc-500 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all"
                                                                    title="Add Link"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                
                                                {(!module.lectures || module.lectures.length === 0) && (
                                                    <div className="p-6 text-center text-zinc-600 text-sm italic">
                                                        No lectures in this module.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- PREMIUM MODAL --- */}
            {showLinkForm && currentContext && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowLinkForm(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-[#0e0e11] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">Add Resource</h3>
                                <p className="text-zinc-500 text-sm mt-1 truncate max-w-[300px]">
                                    {currentContext.lectureTitle}
                                </p>
                            </div>
                            <button onClick={() => setShowLinkForm(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">URL</label>
                                <input
                                    type="url"
                                    placeholder="https://zoom.us/..."
                                    value={newLinkUrl}
                                    onChange={(e) => setNewLinkUrl(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-700"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Live", "Recording", "Backup", "Other"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewLinkType(type)}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                                                newLinkType === type
                                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 bg-zinc-900/30 border-t border-zinc-800 flex justify-end gap-3">
                            <button
                                onClick={() => setShowLinkForm(false)}
                                className="px-5 py-2.5 rounded-xl text-zinc-400 font-medium hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addLectureLink}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isSaving && <Loader2 size={16} className="animate-spin" />}
                                {isSaving ? "Saving..." : "Save Link"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureLinks;