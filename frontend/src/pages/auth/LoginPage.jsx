import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (status === 401 || status === 400) {
        setError(serverMsg || 'Incorrect email or password. Please try again.');
      } else if (status === 404) {
        setError('No account found with that email address.');
      } else if (!err.response) {
        setError('Unable to reach the server. Check your connection and try again.');
      } else {
        setError(serverMsg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center px-4">
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
            <h1 className="text-xl font-bold text-zinc-900">Welcome back</h1>
            <p className="text-sm text-zinc-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3.5 py-3 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                required
                autoComplete="email"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="you@college.edu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-zinc-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  required
                  autoComplete="current-password"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  placeholder="••••••••"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          Demo — Student@123 works for any seeded student
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
