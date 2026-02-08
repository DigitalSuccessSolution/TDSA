// // components/admin/AdminLayout.jsx
// import React from 'react';
// import { FaBook, FaPlus, FaHome, FaSignOutAlt } from 'react-icons/fa';

// const AdminLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-[#151316] flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-[#1a181b] border-r border-white/10">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D22D1E] via-[#963AB0] to-[#20469B]">
//             Admin Panel
//           </h1>
//         </div>
//         <nav className="mt-6">
//           <a href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-white/5 transition">
//             <FaHome className="mr-3" /> Dashboard
//           </a>
//           <a href="#" className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-[#D22D1E]/20 to-[#20469B]/20 border-l-4 border-[#963AB0]">
//             <FaBook className="mr-3" /> Courses
//           </a>
//           <a href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-white/5 transition">
//             <FaSignOutAlt className="mr-3" /> Logout
//           </a>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;