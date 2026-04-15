import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, GraduationCap, Bell } from 'lucide-react';

const roleLinks = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/profile', label: 'My Profile' },
    { to: '/student/chat', label: 'Chat' },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/search', label: 'Find Students' },
    { to: '/recruiter/shortlist', label: 'Shortlist' },
    { to: '/recruiter/chat', label: 'Chat' },
  ],
  alumni: [
    { to: '/alumni/dashboard', label: 'Dashboard' },
    { to: '/alumni/search', label: 'Find Students' },
    { to: '/alumni/shortlist', label: 'Shortlist' },
    { to: '/alumni/chat', label: 'Chat' },
  ],
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = user ? (roleLinks[user.role] || []) : [];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            <span className="font-bold text-xl text-indigo-600">GradConnect</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.to)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-800">{user.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
