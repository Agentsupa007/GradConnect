import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAlumniProfile, updateAlumniProfile } from '../../api/alumniApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import SkillBadge from '../../components/shared/SkillBadge.jsx';
import toast from 'react-hot-toast';
import { Save, Pencil, X } from 'lucide-react';

const EMPTY = { currentCompany: '', currentRole: '', graduationYear: '', branch: '', linkedInUrl: '', bio: '', phone: '', yearsOfExperience: '', skills: [], isAvailableForMentorship: true };

const BRANCHES = [
  'Computer Science Engineering', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Data Science', 'Artificial Intelligence', 'Other',
];

const ViewField = ({ label, value }) => (
  <div className="py-3 border-b border-zinc-50 last:border-0">
    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm text-zinc-800 font-medium">{value || <span className="text-zinc-300 font-normal italic">Not set</span>}</p>
  </div>
);

const AlumniProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAlumniProfile()
      .then(({ data }) => {
        setProfile(data);
        setForm({ currentCompany: data.currentCompany || '', currentRole: data.currentRole || '', graduationYear: data.graduationYear || '', branch: data.branch || '', linkedInUrl: data.linkedInUrl || '', bio: data.bio || '', phone: data.phone || '', yearsOfExperience: data.yearsOfExperience || '', skills: data.skills || [], isAvailableForMentorship: data.isAvailableForMentorship ?? true });
        if (!data.currentCompany && !data.currentRole) setEditing(true);
      })
      .catch(() => setEditing(true))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setForm({ currentCompany: profile?.currentCompany || '', currentRole: profile?.currentRole || '', graduationYear: profile?.graduationYear || '', branch: profile?.branch || '', linkedInUrl: profile?.linkedInUrl || '', bio: profile?.bio || '', phone: profile?.phone || '', yearsOfExperience: profile?.yearsOfExperience || '', skills: profile?.skills || [], isAvailableForMentorship: profile?.isAvailableForMentorship ?? true });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateAlumniProfile(form);
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Alumni Profile</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{user?.name} · {user?.email}</p>
        </div>
        {!editing && (
          <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'currentCompany', label: 'Current Company', placeholder: 'Google, Microsoft, …' },
              { key: 'currentRole',    label: 'Current Role',    placeholder: 'Senior Software Engineer' },
              { key: 'phone',          label: 'Phone',           placeholder: '+91 9876543210', type: 'tel' },
              { key: 'graduationYear', label: 'Graduation Year', placeholder: '2022', type: 'number' },
              { key: 'linkedInUrl',    label: 'LinkedIn URL',       placeholder: 'https://linkedin.com/in/…', type: 'url' },
              { key: 'yearsOfExperience', label: 'Years of Experience', placeholder: '3', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">{f.label}</label>
                <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            ))}
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Branch</label>
              <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Tech Stack / Skills</label>
            <SkillSelector selected={form.skills} onChange={v => setForm({ ...form, skills: v })} placeholder="React.js, Node.js, Python…" />
            <p className="text-xs text-zinc-400 mt-1">Students will find you based on these skills</p>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Share your journey and what you can help students with…" className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isAvailableForMentorship} onChange={e => setForm({ ...form, isAvailableForMentorship: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-zinc-300" />
            <span className="text-sm font-medium text-zinc-700">Available for student mentorship</span>
          </label>
          <div className="flex items-center gap-2 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 text-sm">
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save profile'}
            </button>
            {profile?.currentCompany && (
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors">
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <ViewField label="Current Company"    value={profile?.currentCompany} />
          <ViewField label="Current Role"       value={profile?.currentRole} />
          <ViewField label="Years of Experience" value={profile?.yearsOfExperience ? `${profile.yearsOfExperience} year${profile.yearsOfExperience !== 1 ? 's' : ''}` : null} />
          <ViewField label="Branch"             value={profile?.branch} />
          <ViewField label="Graduation Year"    value={profile?.graduationYear} />
          <ViewField label="LinkedIn"           value={profile?.linkedInUrl} />
          <ViewField label="Phone"              value={profile?.phone} />
          {profile?.skills?.length > 0 && (
            <div className="py-3 border-b border-zinc-50">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map(s => <SkillBadge key={s} skill={s} />)}
              </div>
            </div>
          )}
          {profile?.bio && (
            <div className="py-3 border-b border-zinc-50">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Bio</p>
              <p className="text-sm text-zinc-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}
          <div className="pt-3">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Mentorship</p>
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${profile?.isAvailableForMentorship ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-zinc-100 text-zinc-500'}`}>
              {profile?.isAvailableForMentorship ? '✓ Available for mentorship' : 'Not available right now'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniProfilePage;
