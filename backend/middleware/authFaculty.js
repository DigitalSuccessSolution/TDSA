// FACULTY FEATURE - JWT Middleware
const jwt = require('jsonwebtoken');
const Faculty = require('../models/Faculty');
const JWT_SECRET = process.env.JWT_SECRET || 'facultysecret123';

exports.protectFaculty = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.faculty = await Faculty.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};