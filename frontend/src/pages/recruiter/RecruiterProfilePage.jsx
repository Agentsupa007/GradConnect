import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecruiterProfile, updateRecruiterProfile } from '../../api/recruiterApi.js';
import toast from 'react-hot-toast';
import { Save, Pencil, X, Building2, Briefcase, Globe, MapPin, Phone, Factory } from 'lucide-react';

const EMPTY = { companyName: '', designation: '', companyWebsite: '', industry: '', companyLocation: '', phone: '' };

const ViewField = ({ label, value }) => (
  <div className="py-3 border-b border-zinc-50 last:border-0">
    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm text-zinc-800 font-medium">{value || <span className="text-zinc-300 font-normal italic">Not set</span>}</p>
  </div>
);

const FIELDS = [
  { key: 'companyName',     label: 'Company Name',    placeholder: 'Google, Microsoft, …' },
  { key: 'designation',    label: 'Your Designation', placeholder: 'Technical Recruiter' },
  { key: 'industry',       label: 'Industry',         placeholder: 'Technology, Finance, …' },
  { key: 'companyLocation', label: 'Location',        placeholder: 'Bangalore, India' },
  { key: 'companyWebsite', label: 'Company Website',  placeholder: 'https://company.com', type: 'url' },
  { key: 'phone',          label: 'Phone',            placeholder: '+91 9876543210', type: 'tel' },
];

const RecruiterProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRecruiterProfile()
      .then(({ data }) => {
        setProfile(data);
        setForm({ companyName: data.companyName || '', designation: data.designation || '', companyWebsite: data.companyWebsite || '', industry: data.industry || '', companyLocation: data.companyLocation || '', phone: data.phone || '' });
        if (!data.companyName && !data.designation) setEditing(true);
      })
      .catch(() => setEditing(true))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setForm({ companyName: profile?.companyName || '', designation: profile?.designation || '', companyWebsite: profile?.companyWebsite || '', industry: profile?.industry || '', companyLocation: profile?.companyLocation || '', phone: profile?.phone || '' });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateRecruiterProfile(form);
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Company Profile</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{user?.name} · {user?.email}</p>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 text-sm">
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save profile'}
            </button>
            {profile?.companyName && (
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors">
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <ViewField label="Company" value={profile?.companyName} />
          <ViewField label="Designation" value={profile?.designation} />
          <ViewField label="Industry" value={profile?.industry} />
          <ViewField label="Location" value={profile?.companyLocation} />
          <ViewField label="Website" value={profile?.companyWebsite} />
          <ViewField label="Phone" value={profile?.phone} />
        </div>
      )}
    </div>
  );
};

export default RecruiterProfilePage;
