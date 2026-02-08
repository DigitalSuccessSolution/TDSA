// // components/admin/CourseCard.jsx
// import React from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const CourseCard = ({ course, onEdit, onDelete }) => {
//   return (
//     <div className="bg-[#1a181b] border border-white/10 rounded-2xl overflow-hidden hover:border-[#963AB0]/50 transition">
//       <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-white">{course.title}</h3>
//         <p className="text-gray-400  text-sm mt-1">{course.category}</p>
        
//         <div className="mt-4 flex items-center justify-between">
//           <div>
//             <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D22D1E] to-[#20469B]">
//               ₹{course.price}
//             </span>
//             {course.comparePrice && (
//               <span className="ml-2 text-gray-500 line-through">₹{course.comparePrice}</span>
//             )}
//           </div>
//           <div className="text-sm text-gray-400">{course.duration}</div>
//         </div>

//         <div className="mt-6 flex space-x-3">
//           <button onClick={() => onEdit(course)} className="flex-1 py-2 bg-[#963AB0]/20 text-[#963AB0] rounded-lg hover:bg-[#963AB0]/30 transition flex items-center justify-center space-x-2">
//             <FaEdit /> <span>Edit</span>
//           </button>
//           <button onClick={() => onDelete(course.id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center justify-center space-x-2">
//             <FaTrash /> <span>Delete</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;