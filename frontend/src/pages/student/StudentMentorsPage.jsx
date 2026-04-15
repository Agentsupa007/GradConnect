import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentors } from '../../api/studentApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import SkillBadge from '../../components/shared/SkillBadge.jsx';
import { BRANCHES } from '../../constants.js';
import { MessageCircle, Briefcase, GraduationCap, Link, CheckCircle2, SlidersHorizontal, X } from 'lucide-react';
import toast from 'react-hot-toast';

const avatarBgs = [
  'bg-violet-500', 'bg-indigo-500', 'bg-sky-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const MentorCard = ({ mentor, onChat }) => {
  const [messaging, setMessaging] = useState(false);
  const user = mentor.user || {};
  const color = avatarBgs[(user.name || 'A').charCodeAt(0) % avatarBgs.length];
  const yoe = mentor.yearsOfExperience;

  const handleChat = async () => {
    setMessaging(true);
    try { await onChat(user._id); }
    finally { setMessaging(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
          {(user.name || 'A')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-zinc-900 text-sm leading-tight">{user.name}</h3>
            {mentor.matchCount > 0 && (
              <span className="text-[11px] bg-violet-50 text-violet-700 border border-violet-100 font-semibold px-2 py-0.5 rounded-full">
                {mentor.matchCount} skill{mentor.matchCount !== 1 ? 's' : ''} match
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {[mentor.currentRole, mentor.currentCompany].filter(Boolean).join(' at ')}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 flex-wrap">
            {yoe != null && yoe > 0 && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {yoe} yr{yoe !== 1 ? 's' : ''} exp
              </span>
            )}
            {mentor.branch && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {mentor.branch.replace(' Engineering', '')}
                {mentor.graduationYear ? ` · ${mentor.graduationYear}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-3">{mentor.bio}</p>
      )}

      {/* Skills */}
      {mentor.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.skills.slice(0, 6).map(s => <SkillBadge key={s} skill={s} size="xs" />)}
          {mentor.skills.length > 6 && (
            <span className="text-[11px] text-zinc-400 self-center">+{mentor.skills.length - 6}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center gap-2">
        {mentor.linkedInUrl && (
          <a
            href={mentor.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors font-medium"
          >
            <Link className="h-3 w-3" />
            LinkedIn
          </a>
        )}
        <button
          onClick={handleChat}
          disabled={messaging}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors ml-auto font-medium disabled:opacity-50"
        >
          <MessageCircle className="h-3 w-3" />
          {messaging ? 'Opening…' : 'Message'}
        </button>
      </div>
    </div>
  );
};

const StudentMentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [skills, setSkills] = useState([]);
  const [company, setCompany] = useState('');
  const [branch, setBranch] = useState('');
  const [minYoe, setMinYoe] = useState('');
  const [maxYoe, setMaxYoe] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);
  const navigate = useNavigate();

  const doSearch = useCallback(async (overrides = {}) => {
    setLoading(true);
    setSearched(true);
    const params = {
      skills: (overrides.skills ?? skills).join(','),
      company: overrides.company ?? company,
      branch: overrides.branch ?? branch,
      minYoe: overrides.minYoe ?? minYoe,
      maxYoe: overrides.maxYoe ?? maxYoe,
      availableOnly: String(overrides.availableOnly ?? availableOnly),
    };
    // strip empty params
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    try {
      const { data } = await getMentors(params);
      setMentors(data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [skills, company, branch, minYoe, maxYoe, availableOnly]);

  // load all on mount
  useEffect(() => { doSearch(); }, []);

  const handleChat = async (userId) => {
    try {
      const { data } = await createOrGetConversation(userId);
      navigate(`/student/chat?conv=${data._id}`);
    } catch {
      toast.error('Could not start chat');
    }
  };

  const clearFilters = () => {
    setSkills([]);
    setCompany('');
    setBranch('');
    setMinYoe('');
    setMaxYoe('');
    setAvailableOnly(true);
    doSearch({ skills: [], company: '', branch: '', minYoe: '', maxYoe: '', availableOnly: true });
  };

  const hasFilters = skills.length > 0 || company || branch || minYoe || maxYoe || !availableOnly;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">Find a Mentor</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Connect with alumni who've been where you want to go</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700">Filter mentors</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-zinc-400 hover:text-red-500 transition-colors">
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-[13px] font-medium text-zinc-600 mb-1.5">Tech stack</label>
          <SkillSelector selected={skills} onChange={setSkills} placeholder="React.js, Python, AWS…" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Company */}
          <div>
            <label className="block text-[13px] font-medium text-zinc-600 mb-1.5">Company</label>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Google, TCS…"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-[13px] font-medium text-zinc-600 mb-1.5">Alumni branch</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 bg-white"
            >
              <option value="">All branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b.replace(' Engineering', '')}</option>)}
            </select>
          </div>

          {/* YOE range */}
          <div>
            <label className="block text-[13px] font-medium text-zinc-600 mb-1.5">Min experience (yrs)</label>
            <input
              type="number" min="0" max="40"
              value={minYoe}
              onChange={e => setMinYoe(e.target.value)}
              placeholder="e.g. 2"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-600 mb-1.5">Max experience (yrs)</label>
            <input
              type="number" min="0" max="40"
              value={maxYoe}
              onChange={e => setMaxYoe(e.target.value)}
              placeholder="e.g. 10"
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Available toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setAvailableOnly(v => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${availableOnly ? 'bg-green-500' : 'bg-zinc-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${availableOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-zinc-700">Available for mentorship only</span>
            {availableOnly && (
              <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            )}
          </label>

          <button
            onClick={() => doSearch()}
            className="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searched && mentors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center">
          <p className="font-semibold text-zinc-700">No mentors found</p>
          <p className="text-sm text-zinc-400 mt-1">Try broader filters or turn off "available only"</p>
        </div>
      ) : (
        <>
          {mentors.length > 0 && (
            <p className="text-sm text-zinc-500 mb-4">
              <strong className="text-zinc-800">{mentors.length}</strong> mentor{mentors.length !== 1 ? 's' : ''} found
              {skills.length > 0 && <span> · ranked by skill match</span>}
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map(mentor => (
              <MentorCard key={mentor._id} mentor={mentor} onChat={handleChat} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentMentorsPage;
