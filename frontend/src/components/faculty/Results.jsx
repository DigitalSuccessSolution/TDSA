import React, { useState } from 'react';
import { 
    Search, FileText, ExternalLink, 
    CheckCircle, XCircle 
} from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const Results = ({ authToken, quizzes }) => {
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleQuizChange = async (e) => {
        const quizId = e.target.value;
        setSelectedQuizId(quizId);
        if (!quizId) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/faculty/quizzes/${quizId}/results`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log("Fetched Results Data:", data); // ✅ Check Console for 'submittedFile'
                setResults(data);
            } else {
                alert("Failed to fetch results");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(r => 
        r.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Controls */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                <div className="w-full md:w-1/3 space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Select Quiz to View Results</label>
                    <select 
                        value={selectedQuizId} 
                        onChange={handleQuizChange} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                        <option value="">-- Choose a Quiz --</option>
                        {quizzes.map(q => (
                            <option key={q._id} value={q._id}>{q.title}</option>
                        ))}
                    </select>
                </div>

                {selectedQuizId && (
                    <div className="w-full md:w-1/3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search student..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                )}
            </div>

            {/* Results Table */}
            {selectedQuizId && (
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                                    <th className="p-4 font-medium">Rank</th>
                                    <th className="p-4 font-medium">Student Name</th>
                                    <th className="p-4 font-medium">Score</th>
                                    <th className="p-4 font-medium text-center">Correct/Wrong</th>
                                    <th className="p-4 font-medium">Submission Date</th>
                                    <th className="p-4 font-medium text-right">Answer Sheet</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-zinc-500">Loading results...</td>
                                    </tr>
                                ) : filteredResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-zinc-500">No results found.</td>
                                    </tr>
                                ) : (
                                    filteredResults.map((result, index) => (
                                        <tr key={result._id} className="group hover:bg-zinc-800/50 transition-colors">
                                            <td className="p-4 text-zinc-500 font-mono text-sm">#{index + 1}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-white">{result.student?.name || "Unknown"}</div>
                                                <div className="text-xs text-zinc-500">{result.student?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                                    {result.score} / {result.totalQuestions}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-3 text-sm">
                                                    <span className="flex items-center gap-1 text-green-400" title="Correct">
                                                        <CheckCircle size={14} /> {result.correctAnswers || 0}
                                                    </span>
                                                    <span className="text-zinc-600">|</span>
                                                    <span className="flex items-center gap-1 text-red-400" title="Wrong">
                                                        <XCircle size={14} /> {result.wrongAnswers || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-zinc-400 text-sm">
                                                {new Date(result.createdAt).toLocaleDateString()}
                                                <div className="text-xs text-zinc-600">
                                                    {new Date(result.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                {result.submittedFile ? (
                                                    <a 
                                                        href={result.submittedFile} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                                                    >
                                                        <FileText size={14} />
                                                        View File
                                                        <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-zinc-600 italic">No File</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;