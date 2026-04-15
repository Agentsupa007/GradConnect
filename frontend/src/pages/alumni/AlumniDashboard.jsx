import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAlumniProfile, getStarredStudentsAlumni } from '../../api/alumniApi.js';
import { Search, Star, MessageCircle, ArrowRight, Award, Building2, GraduationCap } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}!</h1>
        <p className="text-purple-200 text-sm">
          {profile?.currentCompany ? `${profile.currentRole || 'Alumni'} at ${profile.currentCompany}` : 'Help shape the next generation of engineers'}
        </p>
        {profile?.isAvailableForMentorship && (
          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white/20 px-2.5 py-1 rounded-full">
            <Award className="h-3 w-3" /> Available for mentorship
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Students Starred', value: starred.length, icon: <Star className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'Company', value: profile?.currentCompany || 'Not set', icon: <Building2 className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Batch', value: profile?.graduationYear || 'Not set', icon: <GraduationCap className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
            <div className="text-xl font-bold text-slate-800 truncate">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/alumni/search', icon: <Search className="h-5 w-5 text-indigo-600" />, bg: 'bg-indigo-100', title: 'Find Students', desc: 'Discover & mentor students', color: 'group-hover:text-indigo-600' },
          { to: '/alumni/shortlist', icon: <Star className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-100', title: 'My Shortlist', desc: `${starred.length} starred`, color: 'group-hover:text-yellow-600' },
          { to: '/alumni/chat', icon: <MessageCircle className="h-5 w-5 text-green-600" />, bg: 'bg-green-100', title: 'Mentorship Chat', desc: 'Connect with students', color: 'group-hover:text-green-600' },
        ].map(link => (
          <Link key={link.to} to={link.to} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 group">
            <div className={`w-10 h-10 ${link.bg} rounded-xl flex items-center justify-center`}>{link.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{link.title}</p>
              <p className="text-xs text-slate-500">{link.desc}</p>
            </div>
            <ArrowRight className={`h-4 w-4 text-slate-400 ${link.color} transition-colors`} />
          </Link>
        ))}
      </div>

      {!profile?.currentCompany && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <h3 className="font-semibold text-purple-800 mb-1">Complete your alumni profile</h3>
          <p className="text-sm text-purple-600 mb-3">Share your journey so students can look up to you.</p>
          <Link to="/alumni/profile" className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Set up profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;
