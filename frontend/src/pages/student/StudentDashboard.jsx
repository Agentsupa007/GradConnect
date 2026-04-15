import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudentProfile, getStarredStudentsStudent } from '../../api/studentApi.js';
import SkillBadge from '../../components/shared/SkillBadge.jsx';
import { ArrowRight, FileText, MessageCircle, AlertCircle, GitBranch, ExternalLink, Search, Star } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentProfile().catch(() => null),
      getStarredStudentsStudent().catch(() => ({ data: [] })),
    ]).then(([p, s]) => {
      setProfile(p?.data);
      setStarred(s?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeResume = profile?.resumes?.find(r => r.isActive);
  const firstName = user?.name?.split(' ')[0] || 'there';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          Hey, {firstName}
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">
          {profile?.branch ? `${profile.branch} · Year ${profile.year}` : 'Complete your profile to get discovered'}
        </p>
      </div>

      {/* Profile incomplete banner */}
      {!profile?.profileCompleted && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Your profile is incomplete</p>
            <p className="text-xs text-amber-600 mt-0.5">Add your branch, year, and roll number to appear in recruiter searches.</p>
          </div>
          <Link to="/student/profile" className="text-xs font-semibold text-amber-700 hover:underline flex-shrink-0">
            Fix this →
          </Link>
        </div>
      )}

      {/* Bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 col-span-1">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{profile?.skills?.length || 0}</div>
          <div className="text-xs text-zinc-500">Skills added</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 col-span-1">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{profile?.projects?.length || 0}</div>
          <div className="text-xs text-zinc-500">Projects</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 col-span-1">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{profile?.resumes?.length || 0}</div>
          <div className="text-xs text-zinc-500">Resumes</div>
        </div>
        <div className={`rounded-2xl p-4 col-span-1 ${profile?.profileCompleted ? 'bg-green-50 border border-green-200' : 'bg-zinc-100 border border-zinc-200'}`}>
          <div className={`text-3xl font-extrabold mb-1 ${profile?.profileCompleted ? 'text-green-600' : 'text-zinc-400'}`}>
            {profile?.profileCompleted ? '100%' : '--'}
          </div>
          <div className={`text-xs ${profile?.profileCompleted ? 'text-green-700 font-semibold' : 'text-zinc-500'}`}>
            {profile?.profileCompleted ? 'Profile complete' : 'Incomplete'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Skills card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Your skills</h3>
            <Link to="/student/profile" className="text-xs text-indigo-600 hover:underline font-medium">Edit →</Link>
          </div>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => <SkillBadge key={skill} skill={skill} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-zinc-500">No skills added yet</p>
              <Link to="/student/profile" className="text-xs text-indigo-600 hover:underline mt-1">Add skills to get discovered</Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <Link
            to="/student/profile?tab=resumes"
            className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800">Resumes</p>
              <p className="text-xs text-zinc-400 truncate">{activeResume?.title || 'None uploaded'}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </Link>

          <Link
            to="/student/search"
            className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
          >
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-800">Find Students</p>
              <p className="text-xs text-zinc-400">Discover peers by skills</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </Link>

          <Link
            to="/student/shortlist"
            className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
          >
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-800">My Shortlist</p>
              <p className="text-xs text-zinc-400">{starred.length} student{starred.length !== 1 ? 's' : ''} saved</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </Link>

          <Link
            to="/student/chat"
            className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
          >
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-800">Messages</p>
              <p className="text-xs text-zinc-400">Chat with recruiters</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Projects */}
      {profile?.projects?.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Projects</h3>
            <Link to="/student/profile?tab=projects" className="text-xs text-indigo-600 hover:underline font-medium">Manage →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {profile.projects.slice(0, 4).map(proj => (
              <div key={proj._id} className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-zinc-800 text-sm leading-tight">{proj.title}</h4>
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-700 transition-colors">
                        <GitBranch className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{proj.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {proj.skillsUsed?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} size="xs" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile?.projects?.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-8 text-center">
          <p className="font-semibold text-zinc-700 mb-1">No projects yet</p>
          <p className="text-sm text-zinc-400 mb-4">Projects are the most powerful part of your profile.</p>
          <Link to="/student/profile?tab=projects" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:underline">
            Add your first project →
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
