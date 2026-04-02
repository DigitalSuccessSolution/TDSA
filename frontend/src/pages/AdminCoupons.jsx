import React, { useState, useEffect } from 'react';
import { 
  Ticket, Plus, Save, X, Trash2, Calendar, 
  Percent, Hash, Info, Loader2, CheckCircle, 
  AlertCircle, ChevronDown, Filter, Trash
} from 'lucide-react';
import { api } from '../utils/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
    usageLimit: '',
    applicableCourse: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, coursesRes] = await Promise.all([
        api.getCoupons(token),
        api.getCourses()
      ]);
      setCoupons(couponsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setErrorMsg('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.code || !formData.discountPercentage || !formData.expiryDate) {
      setErrorMsg('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountPercentage: Number(formData.discountPercentage),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        applicableCourse: formData.applicableCourse || null
      };

      await api.createCoupon(payload, token);
      setSuccessMsg('Coupon created successfully!');
      setShowForm(false);
      setFormData({
        code: '',
        discountPercentage: '',
        expiryDate: '',
        usageLimit: '',
        applicableCourse: ''
      });
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await api.deleteCoupon(id, token);
      setSuccessMsg('Coupon deleted successfully');
      fetchData();
    } catch (err) {
      setErrorMsg('Failed to delete coupon');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Ticket className="text-pink-500" size={32} />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Coupon Management
              </span>
            </h1>
            <p className="text-zinc-500 mt-1 font-medium italic">Create and manage course-specific discounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              showForm 
                ? 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white' 
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 text-white'
            }`}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Close Form' : 'Generate New Coupon'}
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={20} />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            {errorMsg}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="mb-10 bg-zinc-900/50 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-xl animate-in zoom-in-95 duration-300">
            <form onSubmit={handleCreateCoupon} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Coupon Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. SUMMER50"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-xl focus:border-pink-500 focus:outline-none transition-all font-bold tracking-widest placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Discount Percentage (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      min="1"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={e => setFormData({...formData, discountPercentage: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-xl focus:border-pink-500 focus:outline-none transition-all font-bold placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-xl focus:border-pink-500 focus:outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Usage Limit (Optional)</label>
                  <div className="relative">
                    <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      type="number"
                      placeholder="Unlimited if empty"
                      value={formData.usageLimit}
                      onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-xl focus:border-pink-500 focus:outline-none transition-all font-bold placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Applicable Course (Course-Specific)</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <select
                      value={formData.applicableCourse}
                      onChange={e => setFormData({...formData, applicableCourse: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-xl focus:border-pink-500 focus:outline-none appearance-none transition-all font-bold"
                    >
                      <option value="">All Courses (Global Coupon)</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.subject} - {course.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-lg font-black uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(219,39,119,0.3)]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {loading ? 'Processing...' : 'Save Coupon Policy'}
              </button>
            </form>
          </div>
        )}

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && !showForm ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="animate-spin text-pink-500 mx-auto" size={48} />
              <p className="text-zinc-500 mt-4 font-bold uppercase tracking-widest">Scanning Database...</p>
            </div>
          ) : coupons.length > 0 ? (
            coupons.map(coupon => (
              <div key={coupon._id} className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl p-6 transition-all hover:border-pink-500/40 hover:bg-zinc-900 hover:shadow-2xl">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-pink-400 border border-pink-500/30">
                    <Ticket size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-white">{coupon.code}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-md border border-pink-500/20">
                        {coupon.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-bold uppercase">Expires</span>
                    <span className="text-zinc-300 font-bold">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-bold uppercase">Redemptions</span>
                    <span className="text-zinc-300 font-bold">{coupon.usageCount} / {coupon.usageLimit || '∞'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-bold uppercase">Scope</span>
                    <span className={`font-bold ${coupon.applicableCourse ? 'text-blue-400' : 'text-purple-400'}`}>
                      {coupon.applicableCourse ? 'Course Specific' : 'Global Access'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-zinc-800">
              <Ticket className="mx-auto text-zinc-800 mb-4" size={60} />
              <h3 className="text-2xl font-bold text-zinc-500">No Active Coupons</h3>
              <p className="text-zinc-700 mt-2">Generate your first discount policy to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
