import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  getCourses: () => axios.get(`${API_BASE}/courses`),
  getCourse: (id) => axios.get(`${API_BASE}/courses/${id}`),
  createCourse: (data) => axios.post(`${API_BASE}/courses`, data),  // Pure JSON
  updateCourse: (id, data) => axios.put(`${API_BASE}/courses/${id}`, data),
  deleteCourse: (id) => axios.delete(`${API_BASE}/courses/${id}`)
};