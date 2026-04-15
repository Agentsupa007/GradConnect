import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAlumniProfile, updateAlumniProfile } from '../../api/alumniApi.js';
import toast from 'react-hot-toast';
import { Save, Pencil, X, Building2, Briefcase, GraduationCap, BookOpen, Link, Phone, FileText, Users } from 'lucide-react';

const EMPTY = { currentCompany: '', currentRole: '', graduationYear: '', branch: '', linkedInUrl: '', bio: '', phone: '', isAvailableForMentorship: true };

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="mt-0.5 text-slate-400"><Icon className="h-4 w-4" /></div>
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value || <span className="text-slate-400 font-normal italic">Not set</span>}</p>
    </div>
  </div>
);

const TEXT_FIELDS = [
  { key: 'currentCompany',  label: 'Current Company',  placeholder: 'Google, Microsoft, …',       icon: Building2 },
  { key: 'currentRole',     label: 'Current Role',     placeholder: 'Senior Software Engineer',   icon: Briefcase },
  { key: 'branch',          label: 'Branch',           placeholder: 'Computer Science Engineering', icon: BookOpen },
  { key: 'graduationYear',  label: 'Graduation Year',  placeholder: '2022',                        icon: GraduationCap, type: 'number' },
  { key: 'linkedInUrl',     label: 'LinkedIn URL',     placeholder: 'https://linkedin.com/in/…',  icon: Link, type: 'url' },
  { key: 'phone',           label: 'Phone',            placeholder: '+91 9876543210',              icon: Phone, type: 'tel' },
];

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
        setForm({
          currentCompany: data.currentCompany || '',
          currentRole: data.currentRole || '',
          graduationYear: data.graduationYear || '',
          branch: data.branch || '',
          linkedInUrl: data.linkedInUrl || '',
          bio: data.bio || '',
          phone: data.phone || '',
          isAvailableForMentorship: data.isAvailableForMentorship ?? true,
        });
        const isEmpty = !data.currentCompany && !data.currentRole;
        setEditing(isEmpty);
      })
      .catch(() => setEditing(true))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setForm({
      currentCompany: profile?.currentCompany || '',
      currentRole: profile?.currentRole || '',
      graduationYear: profile?.graduationYear || '',
      branch: profile?.branch || '',
      linkedInUrl: profile?.linkedInUrl || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      isAvailableForMentorship: profile?.isAvailableForMentorship ?? true,
    });
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);

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
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alumni Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">{user?.name} · {user?.email}</p>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {TEXT_FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Share your journey and what you can help students with…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="mentorship"
              checked={form.isAvailableForMentorship}
              onChange={e => setForm({ ...form, isAvailableForMentorship: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="mentorship" className="text-sm font-medium text-slate-700">Available for student mentorship</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
            {profile?.currentCompany && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <Field icon={Building2}    label="Current Company"  value={profile?.currentCompany} />
          <Field icon={Briefcase}    label="Current Role"     value={profile?.currentRole} />
          <Field icon={BookOpen}     label="Branch"           value={profile?.branch} />
          <Field icon={GraduationCap} label="Graduation Year" value={profile?.graduationYear} />
          <Field icon={Link}          label="LinkedIn"         value={profile?.linkedInUrl} />
          <Field icon={Phone}        label="Phone"            value={profile?.phone} />
          {profile?.bio && (
            <div className="flex items-start gap-3 py-3 border-b border-slate-100">
              <div className="mt-0.5 text-slate-400"><FileText className="h-4 w-4" /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Bio</p>
                <p className="text-sm text-slate-800">{profile.bio}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 py-3">
            <div className="mt-0.5 text-slate-400"><Users className="h-4 w-4" /></div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Mentorship</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.isAvailableForMentorship ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {profile?.isAvailableForMentorship ? 'Available for mentorship' : 'Not available for mentorship'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniProfilePage;
