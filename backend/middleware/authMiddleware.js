// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'academy2025supersecretkey123';

const protectQuiz = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Token nikalna
      token = req.headers.authorization.split(' ')[1];

      // 2. Token ko Decode karna
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. User ko dhundna
      // "current_session_id" select karna zaroori hai check karne ke liye
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user failed' });
      }

      // --- CHECK: SINGLE DEVICE LOGIC ---
      // Agar Token ka session ID aur DB ka session ID match nahi hua
      // Matlab user ne kisi dusre device par login kar liya hai
      if (user.current_session_id !== decoded.sessionId) {
        return res.status(401).json({ 
            message: 'Session Expired: You logged in on another device.' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectQuiz };