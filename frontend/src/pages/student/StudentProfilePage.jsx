import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getStudentProfile, updateStudentProfile, updateStudentSkills,
  addResume, deleteResume, activateResume,
  addProject, updateProject, deleteProject,
} from '../../api/studentApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import SkillBadge from '../../components/shared/SkillBadge.jsx';
import Modal from '../../components/shared/Modal.jsx';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, ExternalLink, GitBranch, FileText, Edit2, CheckCircle2 } from 'lucide-react';

const BRANCHES = [
  'Computer Science Engineering', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Data Science', 'Artificial Intelligence', 'Other',
];

const StudentProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [infoForm, setInfoForm] = useState({ rollNumber: '', branch: '', year: 1, cgpa: 0, phone: '' });
  const [skills, setSkills] = useState([]);

  const [resumeModal, setResumeModal] = useState(false);
  const [resumeForm, setResumeForm] = useState({ title: '', fileUrl: '' });

  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', liveLink: '', githubLink: '', skillsUsed: [] });

  const load = async () => {
    try {
      const { data } = await getStudentProfile();
      setProfile(data);
      setInfoForm({ rollNumber: data.rollNumber || '', branch: data.branch || '', year: data.year || 1, cgpa: data.cgpa || 0, phone: data.phone || '' });
      setSkills(data.skills || []);
    } catch { /* ok */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const saveInfo = async () => {
    setSaving(true);
    try {
      await updateStudentProfile(infoForm);
      await updateStudentSkills(skills);
      await load();
      refreshProfile();
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleAddResume = async (e) => {
    e.preventDefault();
    try {
      await addResume(resumeForm);
      setResumeModal(false);
      setResumeForm({ title: '', fileUrl: '' });
      await load();
      toast.success('Resume added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try { await deleteResume(id); await load(); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  const handleActivateResume = async (id) => {
    try { await activateResume(id); await load(); toast.success('Active resume updated'); } catch { toast.error('Failed'); }
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj._id);
      setProjectForm({ title: proj.title, description: proj.description, liveLink: proj.liveLink, githubLink: proj.githubLink, skillsUsed: proj.skillsUsed || [] });
    } else {
      setEditingProject(null);
      setProjectForm({ title: '', description: '', liveLink: '', githubLink: '', skillsUsed: [] });
    }
    setProjectModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) { await updateProject(editingProject, projectForm); toast.success('Updated!'); }
      else { await addProject(projectForm); toast.success('Project added!'); }
      setProjectModal(false);
      await load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await deleteProject(id); await load(); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'info', label: 'Info & Skills' },
    { id: 'resumes', label: `Resumes${profile?.resumes?.length ? ` (${profile.resumes.length})` : ''}` },
    { id: 'projects', label: `Projects${profile?.projects?.length ? ` (${profile.projects.length})` : ''}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Profile</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{user?.name} · {user?.email}</p>
        </div>
        {profile?.profileCompleted && (
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl mb-7 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="font-semibold text-zinc-900 mb-5">Academic details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Roll Number</label>
                <input
                  type="text"
                  value={infoForm.rollNumber}
                  onChange={e => setInfoForm({ ...infoForm, rollNumber: e.target.value })}
                  placeholder="CS21B001"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={infoForm.phone}
                  onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Branch</label>
                <select
                  value={infoForm.branch}
                  onChange={e => setInfoForm({ ...infoForm, branch: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Current Year</label>
                <select
                  value={infoForm.year}
                  onChange={e => setInfoForm({ ...infoForm, year: +e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">CGPA</label>
                <input
                  type="number"
                  value={infoForm.cgpa}
                  onChange={e => setInfoForm({ ...infoForm, cgpa: +e.target.value })}
                  min={0} max={10} step={0.01}
                  placeholder="8.5"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="font-semibold text-zinc-900 mb-2">Skills</h3>
            <p className="text-xs text-zinc-400 mb-4">These are how recruiters find you — be specific.</p>
            <SkillSelector selected={skills} onChange={setSkills} />
          </div>

          <button
            onClick={saveInfo}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}

      {/* RESUMES TAB */}
      {activeTab === 'resumes' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-zinc-500">Link your resume from Google Drive or Dropbox</p>
            <button
              onClick={() => setResumeModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add resume
            </button>
          </div>

          {profile?.resumes?.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="font-semibold text-zinc-700 mb-1">No resumes yet</p>
              <p className="text-sm text-zinc-400">Add a Google Drive or Dropbox link to share with recruiters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.resumes.map(resume => (
                <div key={resume._id} className={`bg-white rounded-xl p-4 flex items-center gap-4 border-2 transition-colors ${resume.isActive ? 'border-indigo-300' : 'border-zinc-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${resume.isActive ? 'bg-indigo-100' : 'bg-zinc-100'}`}>
                    <FileText className={`h-5 w-5 ${resume.isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-800 text-sm">{resume.title}</p>
                      {resume.isActive && (
                        <span className="text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium">Active</span>
                      )}
                    </div>
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline truncate block mt-0.5">
                      {resume.fileUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!resume.isActive && (
                      <button onClick={() => handleActivateResume(resume._id)} className="text-xs px-3 py-1.5 border border-zinc-300 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors font-medium">
                        Set active
                      </button>
                    )}
                    <button onClick={() => handleDeleteResume(resume._id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-zinc-500">{profile?.projects?.length || 0} project{profile?.projects?.length !== 1 ? 's' : ''}</p>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add project
            </button>
          </div>

          {profile?.projects?.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">🛠️</div>
              <p className="font-semibold text-zinc-700 mb-1">No projects yet</p>
              <p className="text-sm text-zinc-400">Projects are the #1 thing recruiters look at on your profile</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map(proj => (
                <div key={proj._id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-zinc-900">{proj.title}</h4>
                    <div className="flex gap-1 ml-3">
                      <button onClick={() => openProjectModal(proj)} className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteProject(proj._id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{proj.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.skillsUsed?.map(s => <SkillBadge key={s} skill={s} size="xs" />)}
                  </div>
                  <div className="flex gap-4">
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                        <ExternalLink className="h-3 w-3" /> Live demo
                      </a>
                    )}
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-zinc-500 hover:underline font-medium">
                        <GitBranch className="h-3 w-3" /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resume Modal */}
      <Modal isOpen={resumeModal} onClose={() => setResumeModal(false)} title="Add resume">
        <form onSubmit={handleAddResume} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Resume title</label>
            <input type="text" value={resumeForm.title} onChange={e => setResumeForm({ ...resumeForm, title: e.target.value })} required className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Full Stack Developer Resume 2024" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Resume URL</label>
            <input type="url" value={resumeForm.fileUrl} onChange={e => setResumeForm({ ...resumeForm, fileUrl: e.target.value })} required className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://drive.google.com/..." />
            <p className="text-xs text-zinc-400 mt-1.5">Paste a public Google Drive or Dropbox link</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setResumeModal(false)} className="flex-1 px-4 py-2.5 border border-zinc-300 text-zinc-600 rounded-xl text-sm font-medium hover:bg-zinc-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700">Add resume</button>
          </div>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={projectModal} onClose={() => setProjectModal(false)} title={editingProject ? 'Edit project' : 'Add project'} size="lg">
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Project title *</label>
            <input type="text" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Description</label>
            <textarea value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="What does this project do? What problem does it solve?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Live link</label>
              <input type="url" value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">GitHub link</label>
              <input type="url" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://github.com/..." />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Technologies used</label>
            <SkillSelector selected={projectForm.skillsUsed} onChange={(s) => setProjectForm({ ...projectForm, skillsUsed: s })} placeholder="React.js, Node.js, MongoDB..." />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setProjectModal(false)} className="flex-1 px-4 py-2.5 border border-zinc-300 text-zinc-600 rounded-xl text-sm font-medium hover:bg-zinc-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700">{editingProject ? 'Save changes' : 'Add project'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfilePage;
