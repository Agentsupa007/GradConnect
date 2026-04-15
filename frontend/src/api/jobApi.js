import axiosInstance from './axiosInstance.js';

// Recruiter — job management
export const createJob = (data) => axiosInstance.post('/recruiter/jobs', data);
export const getMyJobs = () => axiosInstance.get('/recruiter/jobs');
export const getJobById = (jobId) => axiosInstance.get(`/recruiter/jobs/${jobId}`);
export const updateJob = (jobId, data) => axiosInstance.put(`/recruiter/jobs/${jobId}`, data);
export const deleteJob = (jobId) => axiosInstance.delete(`/recruiter/jobs/${jobId}`);

// Recruiter — application management
export const getJobApplications = (jobId) => axiosInstance.get(`/recruiter/jobs/${jobId}/applications`);
export const advanceApplication = (jobId, appId, data) => axiosInstance.put(`/recruiter/jobs/${jobId}/applications/${appId}/advance`, data || {});
export const rejectApplication = (jobId, appId, data) => axiosInstance.put(`/recruiter/jobs/${jobId}/applications/${appId}/reject`, data || {});
export const selectApplication = (jobId, appId, data) => axiosInstance.put(`/recruiter/jobs/${jobId}/applications/${appId}/select`, data || {});

// Student — job browsing & applications
export const getOpenJobs = () => axiosInstance.get('/student/jobs');
export const applyToJob = (jobId) => axiosInstance.post(`/student/jobs/${jobId}/apply`);
export const getMyApplications = () => axiosInstance.get('/student/applications');
export const getPlacements = () => axiosInstance.get('/student/placements');
