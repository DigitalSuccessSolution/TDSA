const express = require('express');
const router = express.Router();

// Imports
const enrollmentController = require('../controllers/enrollmentController');
// Path check kar lena (aapne authMiddleware.js banaya tha ya auth.js)
const { protect } = require('../middleware/auth'); 
const { emailMiddleware } = require('../middleware/emailMiddleware');

console.log("Loading Enrollment Routes...");

// Routes

// 1. STUDENT: Enroll in a course
router.post('/', 
  protect,                     // 1. Pehle verify karo kaun user hai
  emailMiddleware("enrollment"), // 2. Phir email bhejo (Data ab req.user me hai)
  enrollmentController.createEnrollment // 3. Phir database me save karo
);
// 2. STUDENT: Get ONLY My Enrollments (Jo Student Dashboard me dikhta hai)
router.get('/my', protect, enrollmentController.getMyEnrollments); 
// Note: Maine path '/my' kar diya hai taaki conflict na ho. 
// Par agar Student Dashboard me URL '/api/enrollments' hai, to ise '/' hi rehne dein 
// aur Admin ke liye '/all' bana dein. Niche dekhein 👇

// --- BEHTAR OPTION ---

// Route 1: Student Dashboard ke liye (Existing)
router.get('/', protect, enrollmentController.getMyEnrollments);

// Route 2: Admin Dashboard ke liye (New)
// Ye naya route 'getAllEnrollments' controller ko call karega
router.get('/all',  enrollmentController.getAllEnrollments);
router.delete('/all', enrollmentController.deleteAllEnrollments); // Delete All
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;