import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAlumniProfile, getStarredStudentsAlumni } from '../../api/alumniApi.js';
import { ArrowRight, Search, Star, MessageCircle, Users, CheckCircle2 } from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAlumniProfile().catch(() => null),
      getStarredStudentsAlumni().catch(() => ({ data: [] })),
    ]).then(([p, s]) => {
      setProfile(p?.data);
      setStarred(s?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Hey, {firstName}</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          {profile?.currentCompany
            ? `${profile.currentRole || 'Alumni'} at ${profile.currentCompany}${profile.graduationYear ? ` · Batch of ${profile.graduationYear}` : ''}`
            : 'Tell students about your journey'}
        </p>
        {profile?.isAvailableForMentorship && (
          <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full mt-2 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Open for mentorship
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{starred.length}</div>
          <div className="text-xs text-zinc-500">Students starred</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 col-span-2">
          <div className="text-sm font-semibold text-zinc-800 mb-1 truncate">
            {profile?.currentCompany || <span className="text-zinc-400 font-normal">No company set</span>}
          </div>
          <div className="text-xs text-zinc-400">
            {profile?.branch || 'Branch not set'}
            {profile?.graduationYear && ` · Class of ${profile.graduationYear}`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Link to="/alumni/search" className="bg-violet-600 rounded-2xl p-5 text-white hover:bg-violet-700 transition-colors group">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Search className="h-5 w-5 text-white" />
          </div>
          <p className="font-semibold mb-1">Find Students</p>
          <p className="text-xs text-violet-200">Discover who to mentor</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-violet-200 group-hover:text-white transition-colors">
            Browse students <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link to="/alumni/shortlist" className="bg-white rounded-2xl p-5 border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Star className="h-5 w-5 text-amber-500" />
          </div>
          <p className="font-semibold text-zinc-900 mb-1">My Shortlist</p>
          <p className="text-xs text-zinc-400">{starred.length} student{starred.length !== 1 ? 's' : ''} starred</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
            View list <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link to="/alumni/chat" className="bg-white rounded-2xl p-5 border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="font-semibold text-zinc-900 mb-1">Mentorship Chat</p>
          <p className="text-xs text-zinc-400">Talk to your mentees</p>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
            Open messages <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>

      {/* Starred students preview */}
      {starred.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Students you're mentoring</h3>
            <Link to="/alumni/shortlist" className="text-xs text-violet-600 hover:underline font-medium">See all →</Link>
          </div>
          <div className="space-y-2">
            {starred.slice(0, 4).map(s => (
              <div key={s._id} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
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
      {!profile?.currentCompany && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-violet-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-violet-800">Complete your alumni profile</p>
              <p className="text-sm text-violet-600 mt-0.5">Share your journey — students look up to where you are now.</p>
            </div>
            <Link to="/alumni/profile" className="flex-shrink-0 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
              Set up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;
