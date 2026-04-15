import { useState, useEffect } from 'react';
import { getOpenJobs, applyToJob } from '../../api/jobApi.js';
import { Briefcase, MapPin, Clock, ChevronRight, CheckCircle2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const typeColors = {
  'Full-time': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Internship': 'bg-sky-50 text-sky-700 border-sky-100',
  'Part-time': 'bg-violet-50 text-violet-700 border-violet-100',
  'Contract': 'bg-amber-50 text-amber-700 border-amber-100',
};

const JobCard = ({ job, onApply, applying }) => {
  const rp = job.recruiter;
  const deadlinePassed = job.deadline && new Date() > new Date(job.deadline);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-zinc-900 leading-tight">{job.title}</h3>
          <p className="text-sm text-zinc-500 mt-0.5">{rp?.companyName || 'Company'}</p>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColors[job.jobType] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
          {job.jobType}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-400 mb-3">
        {job.package && <span className="font-semibold text-zinc-800 text-sm">{job.package}</span>}
        {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
        {job.rounds?.length > 0 && <span>{job.rounds.length} round{job.rounds.length !== 1 ? 's' : ''}</span>}
        {job.deadline && (
          <span className={`flex items-center gap-1 ${deadlinePassed ? 'text-red-400' : ''}`}>
            <Clock className="h-3 w-3" />
            {deadlinePassed ? 'Deadline passed' : `Due ${new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </span>
        )}
      </div>

      {/* Eligibility */}
      {(job.eligibility?.branches?.length > 0 || job.eligibility?.minCGPA > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.eligibility.branches.slice(0, 3).map(b => (
            <span key={b} className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
              {b.replace(' Engineering', '')}
            </span>
          ))}
          {job.eligibility.branches.length > 3 && (
            <span className="text-[11px] text-zinc-400">+{job.eligibility.branches.length - 3} more</span>
          )}
          {job.eligibility.minCGPA > 0 && (
            <span className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">CGPA ≥ {job.eligibility.minCGPA}</span>
          )}
        </div>
      )}

      {/* Skills required */}
      {job.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skillsRequired.slice(0, 4).map(sk => (
            <span key={sk} className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">{sk}</span>
          ))}
          {job.skillsRequired.length > 4 && <span className="text-[11px] text-zinc-400">+{job.skillsRequired.length - 4}</span>}
        </div>
      )}

      {/* Description snippet */}
      {job.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{job.description}</p>
      )}

      {/* Apply button */}
      <div className="mt-auto">
        {job.hasApplied ? (
          <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Application submitted
          </div>
        ) : (
          <button
            onClick={() => onApply(job._id)}
            disabled={applying === job._id || deadlinePassed}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applying === job._id ? 'Applying...' : deadlinePassed ? 'Deadline Passed' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

const StudentJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    getOpenJobs()
      .then(({ data }) => { setJobs(data); setFiltered(data); })
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = jobs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.recruiter?.companyName?.toLowerCase().includes(q) ||
        j.skillsRequired?.some(s => s.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== 'All') result = result.filter(j => j.jobType === typeFilter);
    setFiltered(result);
  }, [search, typeFilter, jobs]);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, hasApplied: true } : j));
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">Job Opportunities</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{jobs.length} open position{jobs.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Full-time', 'Internship', 'Part-time', 'Contract'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === t ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center">
          <Briefcase className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
          <p className="font-semibold text-zinc-700">{jobs.length === 0 ? 'No jobs posted yet' : 'No jobs match your search'}</p>
          <p className="text-sm text-zinc-400 mt-1">{jobs.length === 0 ? 'Check back soon — companies are being onboarded' : 'Try a different search term or filter'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(job => (
            <JobCard key={job._id} job={job} onApply={handleApply} applying={applying} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentJobsPage;
