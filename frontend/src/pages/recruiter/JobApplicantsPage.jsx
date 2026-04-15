import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplications, advanceApplication, rejectApplication, selectApplication } from '../../api/jobApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, MessageCircle, FileText, MapPin, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const avatarBgs = ['bg-indigo-500', 'bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

const statusBadge = (status, currentRound, rounds) => {
  if (status === 'applied') return { label: 'Applied', cls: 'bg-zinc-100 text-zinc-600' };
  if (status === 'selected') return { label: 'Selected', cls: 'bg-green-50 text-green-700' };
  if (status === 'rejected') return { label: 'Rejected', cls: 'bg-red-50 text-red-700' };
  if (status === 'in_progress') {
    const name = rounds?.[currentRound]?.name || `Round ${currentRound + 1}`;
    return { label: `Round ${currentRound + 1}: ${name}`, cls: 'bg-blue-50 text-blue-700' };
  }
  return { label: status, cls: 'bg-zinc-100 text-zinc-600' };
};

const ApplicantCard = ({ app, job, onAction }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const s = app.student || {};
  const user = s.user || {};
  const avatarColor = avatarBgs[(user.name || 'S').charCodeAt(0) % avatarBgs.length];
  const activeResume = s.resumes?.find(r => r.isActive) || s.resumes?.[0];

  const act = async (type) => {
    setLoading(true);
    try { await onAction(app._id, type); }
    finally { setLoading(false); }
  };

  const canAdvance = (app.status === 'applied' || app.status === 'in_progress')
    && app.currentRound + 1 < (job.rounds?.length || 0);
  const canFinalize = app.status !== 'selected' && app.status !== 'rejected';
  const nextRoundName = canAdvance ? (job.rounds[app.currentRound + 1]?.name || `Round ${app.currentRound + 2}`) : null;

  const handleChat = async () => {
    try {
      const { data } = await createOrGetConversation(user._id);
      navigate(`/recruiter/chat?conv=${data._id}`);
    } catch { toast.error('Could not open chat'); }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {(user.name || 'S')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-zinc-900 text-sm">{user.name || '—'}</p>
            <span className="text-xs text-zinc-400">{user.email}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {[s.branch?.replace(' Engineering', ''), s.year && `Year ${s.year}`, s.cgpa && `CGPA ${s.cgpa}`].filter(Boolean).join(' · ')}
          </p>
          {s.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {s.skills.slice(0, 4).map(sk => (
                <span key={sk} className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{sk}</span>
              ))}
              {s.skills.length > 4 && <span className="text-[11px] text-zinc-400">+{s.skills.length - 4}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 flex-wrap">
        {activeResume && (
          <a href={activeResume.fileUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors font-medium">
            <FileText className="h-3 w-3" /> Resume
          </a>
        )}
        <button onClick={handleChat}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors font-medium">
          <MessageCircle className="h-3 w-3" /> Message
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          {canAdvance && (
            <button onClick={() => act('advance')} disabled={loading}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50">
              <ChevronRight className="h-3.5 w-3.5" />
              Move to Round {app.currentRound + 2}: {nextRoundName}
            </button>
          )}
          {canFinalize && (
            <>
              <button onClick={() => act('select')} disabled={loading}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50">
                <CheckCircle2 className="h-3.5 w-3.5" /> Select
              </button>
              <button onClick={() => act('reject')} disabled={loading}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-semibold disabled:opacity-50">
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');

  useEffect(() => {
    getJobApplications(jobId)
      .then(({ data }) => { setJob(data.job); setApplications(data.applications); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleAction = async (appId, type) => {
    try {
      let updated;
      if (type === 'advance') updated = await advanceApplication(jobId, appId);
      else if (type === 'select') updated = await selectApplication(jobId, appId);
      else if (type === 'reject') updated = await rejectApplication(jobId, appId);

      setApplications(prev => prev.map(a =>
        a._id === appId
          ? { ...a, status: updated.data.status, currentRound: updated.data.currentRound, history: updated.data.history }
          : a
      ));
      toast.success(type === 'advance' ? 'Moved to next round' : type === 'select' ? 'Candidate selected!' : 'Candidate rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-center">
      <p className="text-zinc-500">Job not found.</p>
    </div>
  );

  // Build tabs dynamically from job.rounds
  const tabs = [
    { key: 'applied', label: 'Applied', filter: a => a.status === 'applied' },
    ...(job.rounds || []).map((r, i) => ({
      key: `round_${i}`,
      label: `Round ${i + 1}: ${r.name}`,
      filter: a => a.status === 'in_progress' && a.currentRound === i,
    })),
    { key: 'selected', label: 'Selected', filter: a => a.status === 'selected' },
    { key: 'rejected', label: 'Rejected', filter: a => a.status === 'rejected' },
  ];

  const currentFilter = tabs.find(t => t.key === activeTab)?.filter || (() => false);
  const visibleApps = applications.filter(currentFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      {/* Job header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{job.title}</h1>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1.5 flex-wrap">
              {job.package && <span className="font-semibold text-zinc-700 text-sm">{job.package}</span>}
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
              {job.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{applications.length} total applicants</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${job.status === 'open' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
            {job.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>
        {job.rounds?.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {job.rounds.map((r, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-zinc-600">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                {r.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-5">
        {tabs.map(tab => {
          const count = applications.filter(tab.filter).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-zinc-100 text-zinc-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applicant list */}
      {visibleApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 font-medium">No applicants in this stage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleApps.map(app => (
            <ApplicantCard key={app._id} app={app} job={job} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;
