import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAlumniProfile, updateAlumniProfile } from '../../api/alumniApi.js';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const AlumniProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentCompany: '', currentRole: '', graduationYear: '', branch: '', linkedInUrl: '', bio: '', phone: '', isAvailableForMentorship: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAlumniProfile().then(({ data }) => {
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
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAlumniProfile(form);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Alumni Profile</h1>
        <p className="text-slate-500 text-sm">{user?.email}</p>
      </div>
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {[
          { key: 'currentCompany', label: 'Current Company', placeholder: 'Google, Microsoft, ...' },
          { key: 'currentRole', label: 'Current Role', placeholder: 'Senior Software Engineer' },
          { key: 'branch', label: 'Branch', placeholder: 'Computer Science Engineering' },
          { key: 'graduationYear', label: 'Graduation Year', placeholder: '2022', type: 'number' },
          { key: 'linkedInUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', type: 'url' },
          { key: 'phone', label: 'Phone', placeholder: '+91 9876543210', type: 'tel' },
        ].map(f => (
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
            placeholder="Share your journey and what you can help students with..."
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
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default AlumniProfilePage;
