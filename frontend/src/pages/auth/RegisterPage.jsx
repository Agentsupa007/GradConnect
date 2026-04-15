import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const roles = [
  { value: 'student', label: 'Student', emoji: '🎓', desc: 'Showcase skills & get hired' },
  { value: 'recruiter', label: 'Recruiter', emoji: '🏢', desc: 'Find talent by skills' },
  { value: 'alumni', label: 'Alumni', emoji: '🤝', desc: 'Mentor the next batch' },
];

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = roles.find(r => r.value === searchParams.get('role'))?.value || 'student';

  const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to GradConnect, ${user.name.split(' ')[0]}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-zinc-900">GradConnect</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-7">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-zinc-900">Create your account</h1>
            <p className="text-sm text-zinc-500 mt-1">Join the platform — it takes under a minute</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector first */}
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      form.role === r.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{r.emoji}</div>
                    <div className={`text-[12px] font-semibold ${form.role === r.value ? 'text-indigo-700' : 'text-zinc-700'}`}>{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Priya Sharma"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@college.edu"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-semibold py-2.5 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
