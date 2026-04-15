import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, GraduationCap, Menu, X } from 'lucide-react';

const profileRoute = {
  student: '/student/profile',
  recruiter: '/recruiter/profile',
  alumni: '/alumni/profile',
};

const roleLinks = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/search', label: 'Find Students' },
    { to: '/student/shortlist', label: 'Shortlist' },
    { to: '/student/chat', label: 'Messages' },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/search', label: 'Find Students' },
    { to: '/recruiter/shortlist', label: 'Shortlist' },
    { to: '/recruiter/chat', label: 'Messages' },
  ],
  alumni: [
    { to: '/alumni/dashboard', label: 'Dashboard' },
    { to: '/alumni/search', label: 'Find Students' },
    { to: '/alumni/shortlist', label: 'Shortlist' },
    { to: '/alumni/chat', label: 'Messages' },
  ],
};

const avatarColors = {
  student: 'bg-indigo-600',
  recruiter: 'bg-sky-600',
  alumni: 'bg-violet-600',
};

const roleLabel = {
  student: 'Student',
  recruiter: 'Recruiter',
  alumni: 'Alumni',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = user ? (roleLinks[user.role] || []) : [];
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-4">

          {/* Logo — fixed width so center stays truly centered */}
          <div className="flex-none">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-[15px] text-zinc-900 tracking-tight">GradConnect</span>
            </Link>
          </div>

          {/* Center nav — grows to fill space, links sit in the middle */}
          {user && (
            <div className="hidden md:flex flex-1 items-center justify-center gap-0.5">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Spacer for logged-out state so sign-in stays right */}
          {!user && <div className="flex-1" />}

          {/* Right side */}
          <div className="flex-none flex items-center gap-2">
            {user ? (
              <>
                {/* Avatar — clickable, goes to profile */}
                <Link
                  to={profileRoute[user.role]}
                  title="My Profile"
                  className={`w-8 h-8 rounded-full ${avatarColors[user.role]} flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0`}
                >
                  {user.name?.[0]?.toUpperCase()}
                </Link>

                {/* Name + role — desktop only */}
                <div className="hidden md:block">
                  <p className="text-[13px] font-semibold text-zinc-800 leading-tight">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 capitalize">{roleLabel[user.role]}</p>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-900 rounded-md"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-3 py-1.5 bg-zinc-900 text-white text-[13.5px] font-medium rounded-lg hover:bg-zinc-700 transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && user && (
          <div className="md:hidden border-t border-zinc-100 py-2 space-y-0.5">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={profileRoute[user.role]}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(profileRoute[user.role])
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              My Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
