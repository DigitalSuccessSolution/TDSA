import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { 
  BookOpen, Plus, Save, X, Trash2, Edit3, Eye, 
  GraduationCap, Users, TrendingUp, Award, ChevronDown,
  Loader2, CheckCircle, AlertCircle, Layers, FileText
} from 'lucide-react';
import { api } from '../utils/api';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    placementRate: '0%',
    averageSalary: '$0',
    studentsEnrolled: 0,
    completionRate: '0%',
    modules: [{ title: '', chapters: [{ title: '', content: [] }] }]
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    api.getCourses().then(res => setCourses(res.data)).catch(err => setErrorMsg('Failed to load courses: ' + err.message));
  }, []);

  const refresh = () => api.getCourses().then(res => setCourses(res.data));

  const normalizeCourseData = (course) => {
    if (!course) return formData;
    return {
      ...course,
      modules: (course.modules || []).map(mod => ({
        ...mod,
        title: mod.title || '',
        chapters: (mod.chapters || []).map(chap => ({
          ...chap,
          title: chap.title || '',
          content: Array.isArray(chap.content) 
            ? chap.content 
            : (typeof chap.content === 'string' 
                ? chap.content.split(',').map(item => item.trim()).filter(item => item) 
                : []
            )
        }))
      }))
    };
  };

  const prepareSubmitData = (data) => {
    const submitData = { ...data };
    submitData.modules = submitData.modules.map(m => ({
      ...m,
      chapters: m.chapters.map(ch => ({
        ...ch,
        content: Array.isArray(ch.content) ? ch.content : []
      }))
    })).filter(m => m.title.trim());
    return submitData;
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.subject.trim()) return 'Subject is required';
    if (formData.modules.some(mod => !mod.title.trim())) return 'All modules need titles';
    if (formData.modules.some(mod => mod.chapters.some(chap => !chap.title.trim()))) return 'All chapters need titles';
    return null;
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', chapters: [{ title: '', content: [] }] }]
    }));
  };

  const addChapter = (mIdx) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules[mIdx].chapters.push({ title: '', content: [] });
      return { ...prev, modules };
    });
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const match = part.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const [, key, idx] = match;
          current = current[key][parseInt(idx)];
        } else {
          current = current[part];
        }
      }
      const lastKey = parts[parts.length - 1];
      const match = lastKey.match(/(\w+)\[(\d+)\]/);
      if (match) {
        const [, key, idx] = match;
        if (key === 'content') {
          current[key][parseInt(idx)] = value.split(',').map(item => item.trim()).filter(item => item);
        } else {
          current[key][parseInt(idx)] = value;
        }
      } else {
        current[lastKey] = value;
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const valError = validateForm();
    if (valError) {
      setErrorMsg(valError);
      return;
    }

    setLoading(true);
    const submitData = prepareSubmitData(formData);
    const promise = editing 
      ? api.updateCourse(editing._id, submitData)
      : api.createCourse(submitData);

    promise
      .then(() => {
        setSuccessMsg(editing ? 'Course updated successfully!' : 'Course created successfully!');
        refresh();
        setShowForm(false);
        if (!editing) {
          setFormData({
            title: '',
            description: '',
            subject: '',
            placementRate: '0%',
            averageSalary: '$0',
            studentsEnrolled: 0,
            completionRate: '0%',
            modules: [{ title: '', chapters: [{ title: '', content: [] }] }]
          });
        }
        setEditing(null);
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.error || 'Submit failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeItem = (type, mIdx, cIdx) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (type === 'module') newData.modules.splice(mIdx, 1);
      else if (type === 'chapter') newData.modules[mIdx].chapters.splice(cIdx, 1);
      return newData;
    });
  };

  const toggleModule = (idx) => {
    setExpandedModules(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Admin Panel</span>
              </h1>
              <p className="text-zinc-500 text-lg">Manage courses and content</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditing(null);
                  setFormData({
                    title: '',
                    description: '',
                    subject: '',
                    placementRate: '0%',
                    averageSalary: '$0',
                    studentsEnrolled: 0,
                    completionRate: '0%',
                    modules: [{ title: '', chapters: [{ title: '', content: [] }] }]
                  });
                }
              }}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                showForm 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800' 
                  : 'bg-white hover:bg-zinc-200 text-black'
              }`}
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'Add New Course'}
            </button>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-4">
              <CheckCircle size={20} />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4">
              <AlertCircle size={20} />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="text-purple-400" size={24} />
              {editing ? 'Edit Course' : 'Create New Course'}
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Course Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Complete Web Development"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Subject/Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Web Development"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  placeholder="Enter course description..."
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Placement Rate</label>
                  <input
                    type="text"
                    placeholder="85%"
                    value={formData.placementRate}
                    onChange={e => setFormData(prev => ({ ...prev, placementRate: e.target.value }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Avg Salary</label>
                  <input
                    type="text"
                    placeholder="$75,000"
                    value={formData.averageSalary}
                    onChange={e => setFormData(prev => ({ ...prev, averageSalary: e.target.value }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Students</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={formData.studentsEnrolled}
                    onChange={e => setFormData(prev => ({ ...prev, studentsEnrolled: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Completion</label>
                  <input
                    type="text"
                    placeholder="92%"
                    value={formData.completionRate}
                    onChange={e => setFormData(prev => ({ ...prev, completionRate: e.target.value }))}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Modules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="text-blue-400" size={20} />
                    Course Modules
                  </h3>
                  <button
                    type="button"
                    onClick={addModule}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus size={16} />
                    Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.modules.map((mod, mIdx) => (
                    <div key={mIdx} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-zinc-400 mb-2">Module {mIdx + 1} Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Introduction to React"
                            value={mod.title}
                            onChange={e => updateField(`modules[${mIdx}].title`, e.target.value)}
                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem('module', mIdx)}
                          className="mt-8 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Chapters */}
                      <div className="space-y-3">
                        {mod.chapters.map((chap, cIdx) => (
                          <div key={cIdx} className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start gap-4 mb-3">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-zinc-500 mb-2">Chapter {cIdx + 1}</label>
                                <input
                                  type="text"
                                  placeholder="Chapter title"
                                  value={chap.title}
                                  onChange={e => updateField(`modules[${mIdx}].chapters[${cIdx}].title`, e.target.value)}
                                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem('chapter', mIdx, cIdx)}
                                className="mt-6 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <textarea
                              placeholder="Content (comma-separated, e.g., Topic 1, Topic 2, Topic 3)"
                              value={Array.isArray(chap.content) ? chap.content.join(', ') : (typeof chap.content === 'string' ? chap.content : '')}
                              onChange={e => updateField(`modules[${mIdx}].chapters[${cIdx}].content`, e.target.value)}
                              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none h-20 text-sm"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addChapter(mIdx)}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Plus size={14} />
                          Add Chapter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {loading ? 'Saving...' : (editing ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-purple-500/10 transition-all">
                  <BookOpen className="text-purple-400" size={20} />
                </div>
                <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs font-bold uppercase">
                  Active
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{course.title}</h3>
              <p className="text-sm text-zinc-500 mb-1 font-medium">{course.subject}</p>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{course.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="text-zinc-500" size={14} />
                  <span className="text-xs text-zinc-400">{course.studentsEnrolled} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-zinc-500" size={14} />
                  <span className="text-xs text-zinc-400">{course.placementRate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const normalizedData = normalizeCourseData(course);
                    setFormData(normalizedData);
                    setEditing(course);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this course?')) {
                      api.deleteCourse(course._id).then(refresh);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <a
                  href={`/course/${course._id}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye size={14} />
                  View
                </a>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !showForm && (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-zinc-800 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No courses yet</h3>
            <p className="text-zinc-500 mb-8">Create your first course to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;