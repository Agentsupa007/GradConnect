import axiosInstance from './axiosInstance.js';

export const getRecruiterProfile = () => axiosInstance.get('/recruiter/profile');
export const updateRecruiterProfile = (data) => axiosInstance.put('/recruiter/profile', data);
export const getRecruiterAllStudents = (params) => axiosInstance.get('/recruiter/students', { params });
export const getRecruiterStudentById = (id) => axiosInstance.get(`/recruiter/students/${id}`);
export const starStudentRecruiter = (studentId) => axiosInstance.post(`/recruiter/star/${studentId}`);
export const unstarStudentRecruiter = (studentId) => axiosInstance.delete(`/recruiter/star/${studentId}`);
export const getStarredStudentsRecruiter = () => axiosInstance.get('/recruiter/starred');
