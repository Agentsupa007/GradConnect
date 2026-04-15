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
import { Save, Plus, Trash2, ExternalLink, GitBranch, FileText, CheckCircle, Edit2 } from 'lucide-react';

const TABS = ['info', 'resumes', 'projects'];

const StudentProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Info form
  const [infoForm, setInfoForm] = useState({ rollNumber: '', branch: '', year: 1, cgpa: 0, phone: '' });
  const [skills, setSkills] = useState([]);

  // Resume modal
  const [resumeModal, setResumeModal] = useState(false);
  const [resumeForm, setResumeForm] = useState({ title: '', fileUrl: '' });

  // Project modal
  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', liveLink: '', githubLink: '', skillsUsed: [] });

  const loadProfile = async () => {
    try {
      const { data } = await getStudentProfile();
      setProfile(data);
      setInfoForm({
        rollNumber: data.rollNumber || '',
        branch: data.branch || '',
        year: data.year || 1,
        cgpa: data.cgpa || 0,
        phone: data.phone || '',
      });
      setSkills(data.skills || []);
    } catch { /* ok */ }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProfile(); }, []);

  const saveInfo = async () => {
    setSaving(true);
    try {
      await updateStudentProfile(infoForm);
      await updateStudentSkills(skills);
      await loadProfile();
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
      await loadProfile();
      toast.success('Resume added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      await loadProfile();
      toast.success('Resume deleted');
    } catch { toast.error('Failed'); }
  };

  const handleActivateResume = async (id) => {
    try {
      await activateResume(id);
      await loadProfile();
      toast.success('Active resume updated');
    } catch { toast.error('Failed'); }
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
      if (editingProject) {
        await updateProject(editingProject, projectForm);
        toast.success('Project updated!');
      } else {
        await addProject(projectForm);
        toast.success('Project added!');
      }
      setProjectModal(false);
      await loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      await loadProfile();
      toast.success('Project deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm">{user?.email}</p>
        </div>
        {profile?.profileCompleted && (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Profile complete
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab}
            {tab === 'resumes' && profile?.resumes?.length > 0 && (
              <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                {profile.resumes.length}
              </span>
            )}
            {tab === 'projects' && profile?.projects?.length > 0 && (
              <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                {profile.projects.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Academic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'rollNumber', label: 'Roll Number', type: 'text', placeholder: 'CS21B001' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 9876543210' },
                { key: 'branch', label: 'Branch', type: 'text', placeholder: 'Computer Science Engineering' },
                { key: 'year', label: 'Current Year', type: 'number', min: 1, max: 6 },
                { key: 'cgpa', label: 'CGPA', type: 'number', min: 0, max: 10, step: 0.01 },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={infoForm[f.key]}
                    onChange={e => setInfoForm({ ...infoForm, [f.key]: f.type === 'number' ? +e.target.value : e.target.value })}
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Skills</h3>
            <SkillSelector selected={skills} onChange={setSkills} />
            {skills.length === 0 && <p className="text-sm text-slate-400 mt-2">Add skills to appear in recruiter searches</p>}
          </div>

          <button
            onClick={saveInfo}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* RESUMES TAB */}
      {activeTab === 'resumes' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">Upload resume links (Google Drive, Dropbox, etc.)</p>
            <button
              onClick={() => setResumeModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Resume
            </button>
          </div>

          {profile?.resumes?.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-10 text-center">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No resumes yet</p>
              <p className="text-sm text-slate-400">Add a resume link to share with recruiters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.resumes.map(resume => (
                <div key={resume._id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${resume.isActive ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200'}`}>
                  <FileText className={`h-8 w-8 flex-shrink-0 ${resume.isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 text-sm">{resume.title}</p>
                      {resume.isActive && (
                        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline truncate block">{resume.fileUrl}</a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!resume.isActive && (
                      <button onClick={() => handleActivateResume(resume._id)} className="text-xs px-3 py-1.5 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                        Set Active
                      </button>
                    )}
                    <button onClick={() => handleDeleteResume(resume._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">{profile?.projects?.length || 0} project{profile?.projects?.length !== 1 ? 's' : ''}</p>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>

          {profile?.projects?.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-10 text-center">
              <p className="text-slate-500 font-medium mb-1">No projects yet</p>
              <p className="text-sm text-slate-400">Projects are the most important part of your profile!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map(proj => (
                <div key={proj._id} className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{proj.title}</h4>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => openProjectModal(proj)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteProject(proj._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{proj.description}</p>}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.skillsUsed?.map(s => <SkillBadge key={s} skill={s} size="xs" />)}
                  </div>
                  <div className="flex gap-3">
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                        <ExternalLink className="h-3 w-3" /> Live
                      </a>
                    )}
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-slate-600 hover:underline">
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
      <Modal isOpen={resumeModal} onClose={() => setResumeModal(false)} title="Add Resume">
        <form onSubmit={handleAddResume} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume Title</label>
            <input type="text" value={resumeForm.title} onChange={e => setResumeForm({ ...resumeForm, title: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Full Stack Developer Resume 2024" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume URL</label>
            <input type="url" value={resumeForm.fileUrl} onChange={e => setResumeForm({ ...resumeForm, fileUrl: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://drive.google.com/..." />
            <p className="text-xs text-slate-500 mt-1">Use a public Google Drive or Dropbox link</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setResumeModal(false)} className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add Resume</button>
          </div>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={projectModal} onClose={() => setProjectModal(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Title *</label>
            <input type="text" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Describe what this project does..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Live Link</label>
              <input type="url" value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub Link</label>
              <input type="url" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://github.com/..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Technologies Used</label>
            <SkillSelector selected={projectForm.skillsUsed} onChange={(s) => setProjectForm({ ...projectForm, skillsUsed: s })} placeholder="Select technologies used..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setProjectModal(false)} className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{editingProject ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfilePage;
