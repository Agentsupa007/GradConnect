import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecruiterProfile, updateRecruiterProfile } from '../../api/recruiterApi.js';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const RecruiterProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ companyName: '', designation: '', companyWebsite: '', industry: '', companyLocation: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRecruiterProfile().then(({ data }) => {
      setForm({
        companyName: data.companyName || '',
        designation: data.designation || '',
        companyWebsite: data.companyWebsite || '',
        industry: data.industry || '',
        companyLocation: data.companyLocation || '',
        phone: data.phone || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateRecruiterProfile(form);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Company Profile</h1>
        <p className="text-slate-500 text-sm">{user?.email}</p>
      </div>
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {[
          { key: 'companyName', label: 'Company Name', placeholder: 'Google, Microsoft, ...' },
          { key: 'designation', label: 'Your Designation', placeholder: 'Technical Recruiter' },
          { key: 'industry', label: 'Industry', placeholder: 'Technology, Finance, ...' },
          { key: 'companyLocation', label: 'Location', placeholder: 'Bangalore, India' },
          { key: 'companyWebsite', label: 'Company Website', placeholder: 'https://company.com', type: 'url' },
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
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default RecruiterProfilePage;
