import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, createJob, updateJob, deleteJob } from '../../api/jobApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import { Plus, Briefcase, MapPin, Users, CheckCircle2, XCircle, Pencil, Trash2, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { BRANCHES } from '../../constants.js';

const JOB_TYPES = ['Full-time', 'Internship', 'Part-time', 'Contract'];
const YEARS = [1, 2, 3, 4];

const emptyForm = {
  title: '', description: '', location: '', jobType: 'Full-time',
  package: '', skillsRequired: [],
  eligibility: { branches: [], minCGPA: 0, years: [] },
  rounds: [],
  deadline: '', status: 'open',
};

const typeColors = {
  'Full-time': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Internship': 'bg-sky-50 text-sky-700 border-sky-100',
  'Part-time': 'bg-violet-50 text-violet-700 border-violet-100',
  'Contract': 'bg-amber-50 text-amber-700 border-amber-100',
};

const JobFormModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const setElig = (field, val) => setForm(f => ({ ...f, eligibility: { ...f.eligibility, [field]: val } }));

  const toggleBranch = (b) => {
    const cur = form.eligibility.branches;
    setElig('branches', cur.includes(b) ? cur.filter(x => x !== b) : [...cur, b]);
  };
  const toggleYear = (y) => {
    const cur = form.eligibility.years;
    setElig('years', cur.includes(y) ? cur.filter(x => x !== y) : [...cur, y]);
  };

  const addRound = () => setForm(f => ({ ...f, rounds: [...f.rounds, { name: '', description: '' }] }));
  const updateRound = (i, field, val) => setForm(f => {
    const rounds = f.rounds.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    return { ...f, rounds };
  });
  const removeRound = (i) => setForm(f => ({ ...f, rounds: f.rounds.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Job title is required');
    setSaving(true);
    try {
      await onSave({
        ...form,
        deadline: form.deadline || null,
        eligibility: {
          ...form.eligibility,
          minCGPA: parseFloat(form.eligibility.minCGPA) || 0,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-zinc-900">{initial ? 'Edit Job' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition-colors">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Job Title *</label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Job Type</label>
                <select
                  value={form.jobType}
                  onChange={e => set('jobType', e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Package / Stipend</label>
                <input
                  value={form.package}
                  onChange={e => set('package', e.target.value)}
                  placeholder="e.g. 12 LPA / ₹25,000/month"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Location</label>
                <input
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Bengaluru / Remote"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Application Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => set('deadline', e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Role overview, responsibilities, what you're looking for..."
                  rows={4}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Eligibility</h3>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Eligible Branches <span className="text-zinc-400 font-normal">(leave empty for all)</span></label>
              <div className="flex flex-wrap gap-2">
                {BRANCHES.map(b => (
                  <button
                    key={b} type="button"
                    onClick={() => toggleBranch(b)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.eligibility.branches.includes(b)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-400'
                    }`}
                  >
                    {b.replace(' Engineering', '').replace('Electronics & Communication', 'ECE')}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Eligible Years</label>
                <div className="flex gap-2">
                  {YEARS.map(y => (
                    <button
                      key={y} type="button"
                      onClick={() => toggleYear(y)}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        form.eligibility.years.includes(y)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-400'
                      }`}
                    >
                      Y{y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Min. CGPA <span className="text-zinc-400 font-normal">(0 = no filter)</span></label>
                <input
                  type="number" min="0" max="10" step="0.1"
                  value={form.eligibility.minCGPA}
                  onChange={e => setElig('minCGPA', e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Required Skills</label>
              <SkillSelector selected={form.skillsRequired} onChange={v => set('skillsRequired', v)} placeholder="Add required skills..." />
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Interview Rounds</h3>
              <button type="button" onClick={addRound} className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800">
                <Plus className="h-3.5 w-3.5" /> Add round
              </button>
            </div>
            {form.rounds.length === 0 && (
              <p className="text-xs text-zinc-400 italic">No rounds added — students can be directly selected or rejected.</p>
            )}
            {form.rounds.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    value={r.name}
                    onChange={e => updateRound(i, 'name', e.target.value)}
                    placeholder="Round name, e.g. Aptitude Test"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    value={r.description}
                    onChange={e => updateRound(i, 'description', e.target.value)}
                    placeholder="Brief description (optional)"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <button type="button" onClick={() => removeRound(i)} className="text-zinc-300 hover:text-red-500 transition-colors mt-0.5 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-4 border border-zinc-100">
            <div>
              <p className="text-sm font-medium text-zinc-800">Job Status</p>
              <p className="text-xs text-zinc-400 mt-0.5">{form.status === 'open' ? 'Students can apply' : 'Applications closed'}</p>
            </div>
            <button
              type="button"
              onClick={() => set('status', form.status === 'open' ? 'closed' : 'open')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 'open' ? 'bg-green-500' : 'bg-zinc-300'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.status === 'open' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-zinc-200 text-zinc-700 font-semibold rounded-xl text-sm hover:bg-zinc-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : initial ? 'Save Changes' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const load = () => {
    getMyJobs()
      .then(({ data }) => setJobs(data))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingJob) {
        const { data: updated } = await updateJob(editingJob._id, data);
        setJobs(prev => prev.map(j => j._id === updated._id ? { ...updated, applicantCount: j.applicantCount, selectedCount: j.selectedCount } : j));
        toast.success('Job updated');
      } else {
        const { data: created } = await createJob(data);
        setJobs(prev => [{ ...created, applicantCount: 0, selectedCount: 0 }, ...prev]);
        toast.success('Job posted!');
      }
      setShowForm(false);
      setEditingJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job and all its applications?')) return;
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (job) => { setEditingJob(job); setShowForm(true); };
  const openCreate = () => { setEditingJob(null); setShowForm(true); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Job Postings</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" /> Post a Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <Briefcase className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
          <p className="font-semibold text-zinc-700 mb-1">No jobs posted yet</p>
          <p className="text-sm text-zinc-400 mb-6">Post your first job to start receiving applications from students</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
            <Plus className="h-4 w-4" /> Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-zinc-900">{job.title}</h3>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[job.jobType] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                      {job.jobType}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${job.status === 'open' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap mt-1">
                    {job.package && <span className="font-semibold text-zinc-700">{job.package}</span>}
                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    {job.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    {job.rounds?.length > 0 && <span>{job.rounds.length} round{job.rounds.length !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(job)} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Users className="h-4 w-4" />
                    <strong className="text-zinc-800">{job.applicantCount}</strong> applicant{job.applicantCount !== 1 ? 's' : ''}
                  </span>
                  {job.selectedCount > 0 && (
                    <span className="flex items-center gap-1.5 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <strong>{job.selectedCount}</strong> selected
                    </span>
                  )}
                </div>
                <Link
                  to={`/recruiter/jobs/${job._id}/applicants`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                >
                  View applicants <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <JobFormModal
          initial={editingJob}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingJob(null); }}
        />
      )}
    </div>
  );
};

export default RecruiterJobsPage;
