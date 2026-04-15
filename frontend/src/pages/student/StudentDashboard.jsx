import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudentProfile } from '../../api/studentApi.js';
import { User, FileText, Code, MessageCircle, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import SkillBadge from '../../components/shared/SkillBadge.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeResume = profile?.resumes?.find(r => r.isActive);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}!</h1>
        <p className="text-indigo-200 text-sm">Keep your profile updated to attract the right opportunities.</p>
      </div>

      {/* Profile Completion */}
      {!profile?.profileCompleted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Complete your profile</p>
            <p className="text-xs text-amber-600">Add your branch, year, and roll number to appear in search results.</p>
          </div>
          <Link to="/student/profile" className="text-xs font-semibold text-amber-700 hover:underline">Complete →</Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Skills', value: profile?.skills?.length || 0, icon: <Code className="h-5 w-5 text-indigo-500" />, bg: 'bg-indigo-50' },
          { label: 'Projects', value: profile?.projects?.length || 0, icon: <Code className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
          { label: 'Resumes', value: profile?.resumes?.length || 0, icon: <FileText className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Year', value: profile?.year ? `Year ${profile.year}` : '—', icon: <User className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/student/profile" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Edit Profile</p>
            <p className="text-xs text-slate-500">Update skills & info</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>
        <Link to="/student/profile?tab=resumes" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Manage Resumes</p>
            <p className="text-xs text-slate-500">{activeResume ? `Active: ${activeResume.title}` : 'No resume uploaded'}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </Link>
        <Link to="/student/chat" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Messages</p>
            <p className="text-xs text-slate-500">Chat with recruiters & alumni</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 transition-colors" />
        </Link>
      </div>

      {/* Skills Preview */}
      {profile?.skills?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Your Skills</h3>
            <Link to="/student/profile" className="text-sm text-indigo-600 hover:underline">Edit</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>
      )}

      {/* Projects Preview */}
      {profile?.projects?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Your Projects</h3>
            <Link to="/student/profile?tab=projects" className="text-sm text-indigo-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-3">
            {profile.projects.slice(0, 3).map(proj => (
              <div key={proj._id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{proj.title}</p>
                  {proj.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{proj.description}</p>}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.skillsUsed?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} size="xs" />)}
                  </div>
                </div>
                <div className="flex gap-2 ml-3 flex-shrink-0">
                  {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">Live</a>}
                  {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:underline">GitHub</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
