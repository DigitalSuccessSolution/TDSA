// // components/admin/CourseForm.jsx
// import React, { useState } from 'react';
// import { FaUpload, FaTimes } from 'react-icons/fa';

// const CourseForm = ({ course, onSave, onCancel }) => {
//   const [formData, setFormData] = useState({
//     title: course?.title || '',
//     price: course?.price || '',
//     comparePrice: course?.comparePrice || '',
//     description: course?.description || '',
//     category: course?.category || '',
//     duration: course?.duration || '',
//     thumbnail: course?.thumbnail || '',
//     syllabus: course?.syllabus || '',
//   });

//   const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnail || '');
//   const [syllabusFile, setSyllabusFile] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleThumbnail = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setThumbnailPreview(reader.result);
//         setFormData({ ...formData, thumbnail: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSyllabus = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSyllabusFile(file);
//       setFormData({ ...formData, syllabus: file.name });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({ ...formData, id: course?.id || Date.now() });
//   };

//   return (
//     <div className="bg-[#1a181b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
//       <h2 className="text-3xl font-bold text-white mb-8">
//         {course ? 'Edit' : 'Add New'} Course
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Course Title"
//             className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white placeholder-gray-400 focus:border-[#963AB0]/50 focus:shadow-[0_0_15px_#963AB0/30]"
//             required
//           />

//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white"
//             required
//           >
//             <option value="">Select Category</option>
//             <option>Machine Learning</option>
//             <option>Data Engineering</option>
//             <option>AI</option>
//             <option>Data Visualization</option>
//           </select>

//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             placeholder="Price (₹)"
//             className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white"
//             required
//           />

//           <input
//             type="number"
//             name="comparePrice"
//             value={formData.comparePrice}
//             onChange={handleChange}
//             placeholder="Compare Price (₹)"
//             className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white"
//           />

//           <input
//             type="text"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             placeholder="Duration (e.g. 12 weeks)"
//             className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white"
//             required
//           />
//         </div>

//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           rows="4"
//           placeholder="Course Description"
//           className="w-full px-4 py-3 bg-[#151316] border border-white/15 rounded-xl text-white placeholder-gray-400"
//           required
//         />

//         {/* Thumbnail Upload */}
//         <div>
//           <label className="text-gray-300 text-sm font-semibold">Thumbnail</label>
//           <div className="mt-2 flex items-center space-x-4">
//             {thumbnailPreview && (
//               <img src={thumbnailPreview} alt="preview" className="w-32 h-32 object-cover rounded-xl" />
//             )}
//             <label className="cursor-pointer bg-gradient-to-r from-[#D22D1E] to-[#20469B] text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:opacity-90">
//               <FaUpload />
//               <span>Upload Thumbnail</span>
//               <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
//             </label>
//           </div>
//         </div>

//         {/* Syllabus PDF */}
//         <div>
//           <label className="text-gray-300 text-sm font-semibold">Syllabus PDF</label>
//           <label className="block mt-2 cursor-pointer bg-[#151316] border border-dashed border-white/30 rounded-xl p-6 text-center hover:border-[#963AB0]">
//             <FaUpload className="mx-auto text-3xl text-gray-400" />
//             <p className="text-gray-400 mt-2">
//               {syllabusFile ? syllabusFile.name : 'Upload Syllabus PDF'}
//             </p>
//             <input type="file" accept=".pdf" onChange={handleSyllabus} className="hidden" />
//           </label>
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             className="flex-1 py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-[#D22D1E] via-[#963AB0] to-[#20469B] hover:shadow-lg hover:shadow-purple-500/50 transition"
//           >
//             {course ? 'Update' : 'Add'} Course
//           </button>
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-8 py-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CourseForm;