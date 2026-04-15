import axiosInstance from './axiosInstance.js';

export const getStudentProfile = () => axiosInstance.get('/student/profile');
export const updateStudentProfile = (data) => axiosInstance.put('/student/profile', data);
export const updateStudentSkills = (skills) => axiosInstance.put('/student/skills', { skills });
export const addResume = (data) => axiosInstance.post('/student/resumes', data);
export const deleteResume = (resumeId) => axiosInstance.delete(`/student/resumes/${resumeId}`);
export const activateResume = (resumeId) => axiosInstance.put(`/student/resumes/${resumeId}/activate`);
export const addProject = (data) => axiosInstance.post('/student/projects', data);
export const updateProject = (projectId, data) => axiosInstance.put(`/student/projects/${projectId}`, data);
export const deleteProject = (projectId) => axiosInstance.delete(`/student/projects/${projectId}`);

export const getStarredStudentsStudent = () => axiosInstance.get('/student/starred');
export const starStudentStudent = (studentId) => axiosInstance.post(`/student/star/${studentId}`);
export const unstarStudentStudent = (studentId) => axiosInstance.delete(`/student/star/${studentId}`);
