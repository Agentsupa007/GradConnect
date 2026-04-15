import axiosInstance from './axiosInstance.js';

export const getAlumniProfile = () => axiosInstance.get('/alumni/profile');
export const updateAlumniProfile = (data) => axiosInstance.put('/alumni/profile', data);
export const getAlumniAllStudents = (params) => axiosInstance.get('/alumni/students', { params });
export const getAlumniStudentById = (id) => axiosInstance.get(`/alumni/students/${id}`);
export const starStudentAlumni = (studentId) => axiosInstance.post(`/alumni/star/${studentId}`);
export const unstarStudentAlumni = (studentId) => axiosInstance.delete(`/alumni/star/${studentId}`);
export const getStarredStudentsAlumni = () => axiosInstance.get('/alumni/starred');
