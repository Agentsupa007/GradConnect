import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentProfilePage from './pages/student/StudentProfilePage.jsx';
import StudentChatPage from './pages/student/StudentChatPage.jsx';
import StudentPeerSearchPage from './pages/student/StudentSearchPage.jsx';
import StudentShortlistPage from './pages/student/StudentShortlistPage.jsx';
import StudentJobsPage from './pages/student/StudentJobsPage.jsx';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage.jsx';
import PlacementsPage from './pages/student/PlacementsPage.jsx';
import StudentMentorsPage from './pages/student/StudentMentorsPage.jsx';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage.jsx';
import StudentSearchPage from './pages/recruiter/StudentSearchPage.jsx';
import ShortlistPage from './pages/recruiter/ShortlistPage.jsx';
import RecruiterChatPage from './pages/recruiter/RecruiterChatPage.jsx';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage.jsx';
import JobApplicantsPage from './pages/recruiter/JobApplicantsPage.jsx';

import AlumniDashboard from './pages/alumni/AlumniDashboard.jsx';
import AlumniProfilePage from './pages/alumni/AlumniProfilePage.jsx';
import AlumniSearchPage from './pages/alumni/AlumniSearchPage.jsx';
import AlumniShortlistPage from './pages/alumni/AlumniShortlistPage.jsx';
import AlumniChatPage from './pages/alumni/AlumniChatPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-[#f5f4f0]">
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfilePage />} />
                <Route path="/student/chat" element={<StudentChatPage />} />
                <Route path="/student/search" element={<StudentPeerSearchPage />} />
                <Route path="/student/shortlist" element={<StudentShortlistPage />} />
                <Route path="/student/jobs" element={<StudentJobsPage />} />
                <Route path="/student/applications" element={<StudentApplicationsPage />} />
                <Route path="/student/placements" element={<PlacementsPage />} />
                <Route path="/student/mentors" element={<StudentMentorsPage />} />
              </Route>

              {/* Recruiter Routes */}
              <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
                <Route path="/recruiter/search" element={<StudentSearchPage />} />
                <Route path="/recruiter/shortlist" element={<ShortlistPage />} />
                <Route path="/recruiter/chat" element={<RecruiterChatPage />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
                <Route path="/recruiter/jobs/:jobId/applicants" element={<JobApplicantsPage />} />
              </Route>

              {/* Alumni Routes */}
              <Route element={<ProtectedRoute allowedRoles={['alumni']} />}>
                <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
                <Route path="/alumni/profile" element={<AlumniProfilePage />} />
                <Route path="/alumni/search" element={<AlumniSearchPage />} />
                <Route path="/alumni/shortlist" element={<AlumniShortlistPage />} />
                <Route path="/alumni/chat" element={<AlumniChatPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontSize: '14px', borderRadius: '10px', background: '#1e293b', color: '#f8fafc' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
