import axiosInstance from './axiosInstance.js';

export const searchStudents = ({ skills = [], page = 1, limit = 20 } = {}) =>
  axiosInstance.get('/search/students', {
    params: { skills: skills.join(','), page, limit },
  });
