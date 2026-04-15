import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecruiterProfile, updateRecruiterProfile } from '../../api/recruiterApi.js';
import toast from 'react-hot-toast';
import { Save, Pencil, X, Building2, Briefcase, Globe, MapPin, Phone, Factory } from 'lucide-react';

const EMPTY = { companyName: '', designation: '', companyWebsite: '', industry: '', companyLocation: '', phone: '' };

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="mt-0.5 text-slate-400"><Icon className="h-4 w-4" /></div>
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value || <span className="text-slate-400 font-normal italic">Not set</span>}</p>
    </div>
  </div>
);

const FIELDS = [
  { key: 'companyName',    label: 'Company Name',    placeholder: 'Google, Microsoft, …',  icon: Building2 },
  { key: 'designation',   label: 'Designation',      placeholder: 'Technical Recruiter',   icon: Briefcase },
  { key: 'industry',      label: 'Industry',         placeholder: 'Technology, Finance, …', icon: Factory },
  { key: 'companyLocation', label: 'Location',       placeholder: 'Bangalore, India',      icon: MapPin },
  { key: 'companyWebsite', label: 'Company Website', placeholder: 'https://company.com',   icon: Globe, type: 'url' },
  { key: 'phone',         label: 'Phone',            placeholder: '+91 9876543210',         icon: Phone, type: 'tel' },
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
        setForm({
          companyName: data.companyName || '',
          designation: data.designation || '',
          companyWebsite: data.companyWebsite || '',
          industry: data.industry || '',
          companyLocation: data.companyLocation || '',
          phone: data.phone || '',
        });
        // Open edit mode automatically if profile is empty
        const isEmpty = !data.companyName && !data.designation;
        setEditing(isEmpty);
      })
      .catch(() => setEditing(true))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setForm({
      companyName: profile?.companyName || '',
      designation: profile?.designation || '',
      companyWebsite: profile?.companyWebsite || '',
      industry: profile?.industry || '',
      companyLocation: profile?.companyLocation || '',
      phone: profile?.phone || '',
    });
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);

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
          <h1 className="text-2xl font-bold text-slate-800">Company Profile</h1>
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
          {FIELDS.map(f => (
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
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
            {profile?.companyName && (
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
          <Field icon={Building2} label="Company Name"    value={profile?.companyName} />
          <Field icon={Briefcase} label="Designation"     value={profile?.designation} />
          <Field icon={Factory}   label="Industry"        value={profile?.industry} />
          <Field icon={MapPin}    label="Location"        value={profile?.companyLocation} />
          <Field icon={Globe}     label="Company Website" value={profile?.companyWebsite} />
          <Field icon={Phone}     label="Phone"           value={profile?.phone} />
        </div>
      )}
    </div>
  );
};

export default RecruiterProfilePage;
