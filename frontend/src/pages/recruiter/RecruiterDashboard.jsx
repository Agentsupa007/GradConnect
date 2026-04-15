import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecruiterProfile, getStarredStudentsRecruiter } from '../../api/recruiterApi.js';
import { ArrowRight, Search, Star, MessageCircle, Building2, Briefcase } from 'lucide-react';
import { getMyJobs } from '../../api/jobApi.js';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [starred, setStarred] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRecruiterProfile().catch(() => null),
      getStarredStudentsRecruiter().catch(() => ({ data: [] })),
      getMyJobs().catch(() => ({ data: [] })),
    ]).then(([p, s, j]) => {
      setProfile(p?.data);
      setStarred(s?.data || []);
      setJobs(j?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Hey, {firstName}</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          {profile?.companyName
            ? `${profile.designation || 'Recruiter'} at ${profile.companyName}`
            : 'Complete your profile to get started'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{jobs.length}</div>
          <div className="text-xs text-zinc-500">Jobs posted</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{jobs.reduce((s, j) => s + (j.applicantCount || 0), 0)}</div>
          <div className="text-xs text-zinc-500">Total applicants</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="text-sm font-semibold text-zinc-800 mb-1 truncate">
            {profile?.companyName || <span className="text-zinc-400 font-normal">No company set</span>}
          </div>
          <div className="text-xs text-zinc-400 truncate">
            {profile?.industry || 'Industry not set'}
            {profile?.companyLocation && ` · ${profile.companyLocation}`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link to="/recruiter/jobs" className="bg-zinc-900 rounded-2xl p-5 text-white hover:bg-zinc-800 transition-colors group">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <p className="font-semibold mb-1">Post Jobs</p>
          <p className="text-xs text-zinc-400">Manage job postings</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-white transition-colors">
            Go to jobs <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link to="/recruiter/search" className="bg-white rounded-2xl p-5 border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <Search className="h-5 w-5 text-zinc-600" />
          </div>
          <p className="font-semibold text-zinc-900 mb-1">Find Students</p>
          <p className="text-xs text-zinc-400">Search by skill — ranked by match</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
            Search now <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link to="/recruiter/shortlist" className="bg-white rounded-2xl p-5 border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Star className="h-5 w-5 text-amber-500" />
          </div>
          <p className="font-semibold text-zinc-900 mb-1">My Shortlist</p>
          <p className="text-xs text-zinc-400">{starred.length} starred candidate{starred.length !== 1 ? 's' : ''}</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
            View shortlist <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link to="/recruiter/chat" className="bg-white rounded-2xl p-5 border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="font-semibold text-zinc-900 mb-1">Messages</p>
          <p className="text-xs text-zinc-400">Chat with candidates directly</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
            Open messages <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>

      {/* Recent shortlist preview */}
      {starred.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Recently shortlisted</h3>
            <Link to="/recruiter/shortlist" className="text-xs text-sky-600 hover:underline font-medium">See all →</Link>
          </div>
          <div className="space-y-2">
            {starred.slice(0, 4).map(s => (
              <div key={s._id} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
                  {(s.user?.name || 'S')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">{s.user?.name}</p>
                  <p className="text-xs text-zinc-400 truncate">
                    {[s.branch?.replace(' Engineering', ''), s.year && `Year ${s.year}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.skills?.slice(0, 2).map(sk => (
                    <span key={sk} className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile CTA */}
      {!profile?.companyName && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-sky-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sky-800">Set up your company profile</p>
              <p className="text-sm text-sky-600 mt-0.5">Let students know who they're talking to.</p>
            </div>
            <Link to="/recruiter/profile" className="flex-shrink-0 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors">
              Set up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
