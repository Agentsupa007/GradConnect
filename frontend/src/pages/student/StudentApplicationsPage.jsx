import { useState, useEffect } from 'react';
import { getMyApplications } from '../../api/jobApi.js';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  applied: { label: 'Applied', cls: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' },
  in_progress: { label: 'In Progress', cls: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  selected: { label: 'Selected', cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  rejected: { label: 'Not Selected', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
};

const getStatusDisplay = (app) => {
  if (app.status === 'in_progress') {
    const roundName = app.job?.rounds?.[app.currentRound]?.name || `Round ${app.currentRound + 1}`;
    return { label: `Round ${app.currentRound + 1}: ${roundName}`, cls: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' };
  }
  return statusConfig[app.status] || statusConfig.applied;
};

const typeColors = {
  'Full-time': 'text-indigo-700',
  'Internship': 'text-sky-700',
  'Part-time': 'text-violet-700',
  'Contract': 'text-amber-700',
};

const ApplicationCard = ({ app }) => {
  const [expanded, setExpanded] = useState(false);
  const job = app.job || {};
  const rp = job.recruiter || {};
  const sd = getStatusDisplay(app);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-900 truncate">{job.title || 'Job'}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">{rp?.companyName || '—'}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 flex-wrap">
              {job.jobType && <span className={`font-medium ${typeColors[job.jobType] || ''}`}>{job.jobType}</span>}
              {job.package && <span className="font-semibold text-zinc-700">{job.package}</span>}
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sd.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sd.dot}`} />
              {sd.label}
            </span>
            <p className="text-xs text-zinc-400 mt-1.5">
              Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        {/* Rounds progress bar */}
        {job.rounds?.length > 0 && app.status !== 'rejected' && (
          <div className="mt-4">
            <div className="flex items-center gap-0">
              {job.rounds.map((r, i) => {
                const cleared = app.status === 'selected' || (app.status === 'in_progress' && i < app.currentRound) || (app.status === 'in_progress' && i === app.currentRound);
                const current = app.status === 'in_progress' && i === app.currentRound;
                return (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`h-2 flex-1 rounded-full transition-colors ${
                      i === 0 ? 'ml-0' : ''
                    } ${
                      app.status === 'selected' || (app.status === 'in_progress' && i <= app.currentRound)
                        ? 'bg-indigo-500'
                        : 'bg-zinc-200'
                    }`} />
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                      app.status === 'selected' ? 'bg-green-500' :
                      current ? 'bg-indigo-600 ring-2 ring-indigo-200' :
                      i < (app.currentRound || 0) ? 'bg-indigo-400' :
                      'bg-zinc-200'
                    }`}>
                      {(app.status === 'selected' || i < (app.currentRound || 0)) && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {i < job.rounds.length - 1 && (
                      <div className={`h-2 flex-1 rounded-full ${
                        app.status === 'selected' || (app.status === 'in_progress' && i < app.currentRound)
                          ? 'bg-indigo-500' : 'bg-zinc-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              {job.rounds.map((r, i) => (
                <span key={i} className={`text-[10px] text-center flex-1 ${
                  app.status === 'in_progress' && i === app.currentRound ? 'text-indigo-600 font-semibold' : 'text-zinc-400'
                }`}>
                  R{i + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {app.status === 'selected' && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-green-800">Congratulations! You've been selected.</p>
          </div>
        )}
        {app.status === 'rejected' && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">Your application was not taken further.</p>
          </div>
        )}
      </div>

      {/* History toggle */}
      {app.history?.length > 0 && (
        <div className="border-t border-zinc-100">
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <span>Application timeline ({app.history.length} events)</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {expanded && (
            <div className="px-5 pb-4 space-y-2">
              {app.history.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    h.action === 'selected' ? 'bg-green-500' :
                    h.action === 'rejected' ? 'bg-red-400' :
                    h.action === 'advanced' ? 'bg-indigo-500' : 'bg-zinc-400'
                  }`} />
                  <div>
                    <span className="font-medium text-zinc-700">{h.roundName}</span>
                    {h.note && <span className="text-zinc-400"> — {h.note}</span>}
                    <span className="text-zinc-400 ml-1.5">
                      {new Date(h.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">My Applications</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'applied', label: 'Applied' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'selected', label: 'Selected' },
          { key: 'rejected', label: 'Rejected' },
        ].map(f => {
          const count = f.key === 'all' ? applications.length : applications.filter(a => a.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 rounded-full font-bold ${filter === f.key ? 'bg-white/20' : 'bg-zinc-100 text-zinc-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <Briefcase className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
          <p className="font-semibold text-zinc-700 mb-1">
            {applications.length === 0 ? 'No applications yet' : 'No applications in this category'}
          </p>
          {applications.length === 0 && (
            <>
              <p className="text-sm text-zinc-400 mb-5">Browse open jobs and apply to get started</p>
              <Link to="/student/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                Browse Jobs →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => <ApplicationCard key={app._id} app={app} />)}
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;
