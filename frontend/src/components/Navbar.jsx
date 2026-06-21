import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Menu, X, LogOut, Briefcase, LayoutDashboard, User as UserIcon, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin-dashboard';
    if (user.role === 'REFERRER') return '/referrer-dashboard';
    return '/user-dashboard';
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-wide bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          <Briefcase className="h-6 w-6 text-primary-400 inline" />
          <span>ReferalsHub</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={linkClass('/')}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/jobs" className={linkClass('/jobs')}>
            <Briefcase className="h-4 w-4" />
            <span>Jobs</span>
          </Link>

          {user ? (
            <>
              <Link to={getDashboardPath()} className={linkClass(getDashboardPath())}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className={linkClass('/profile')}>
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link to="/notifications" className={`${linkClass('/notifications')} relative`}>
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-all duration-250 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {user && (
            <Link to="/notifications" className="relative p-2 text-slate-300 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-2 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-lg text-base font-medium ${
              isActive('/jobs') ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300'
            }`}
          >
            Jobs
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium ${
                  isActive(getDashboardPath()) ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium ${
                  isActive('/profile') ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300'
                }`}
              >
                Profile
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium ${
                  isActive('/notifications') ? 'bg-primary-500/20 text-primary-400' : 'text-slate-300'
                }`}
              >
                Notifications ({unreadCount})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 rounded-lg text-base font-medium text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-900 flex flex-col space-y-2 px-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-base font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-base font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
