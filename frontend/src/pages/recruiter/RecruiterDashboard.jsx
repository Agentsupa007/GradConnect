import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecruiterProfile, getStarredStudentsRecruiter } from '../../api/recruiterApi.js';
import { Search, Star, MessageCircle, ArrowRight, Users, Building2 } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRecruiterProfile().catch(() => null),
      getStarredStudentsRecruiter().catch(() => ({ data: [] })),
    ]).then(([p, s]) => {
      setProfile(p?.data);
      setStarred(s?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}!</h1>
        <p className="text-indigo-200 text-sm">
          {profile?.companyName ? `${profile.designation || 'Recruiter'} at ${profile.companyName}` : 'Complete your profile to get started'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Starred Students', value: starred.length, icon: <Star className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'Company', value: profile?.companyName || 'Not set', icon: <Building2 className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Industry', value: profile?.industry || 'Not set', icon: <Users className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
            <div className="text-xl font-bold text-slate-800 truncate">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/recruiter/search" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Search className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Find Students</p>
            <p className="text-xs text-slate-500">Search by skills</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>
        <Link to="/recruiter/shortlist" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">My Shortlist</p>
            <p className="text-xs text-slate-500">{starred.length} starred student{starred.length !== 1 ? 's' : ''}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-yellow-600 transition-colors" />
        </Link>
        <Link to="/recruiter/chat" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Messages</p>
            <p className="text-xs text-slate-500">Chat with students</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 transition-colors" />
        </Link>
      </div>

      {/* Profile Setup CTA */}
      {!profile?.companyName && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-800 mb-1">Complete your company profile</h3>
          <p className="text-sm text-blue-600 mb-3">Add your company details so students know who you are.</p>
          <Link to="/recruiter/profile" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Set up profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
