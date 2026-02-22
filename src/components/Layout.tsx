import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, User, Briefcase, LayoutDashboard, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userRole, setUserRole } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      navigate('/signin');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isPublic = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-display font-bold text-slate-800 tracking-tight">
              AI Placement Copilot
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-8">
              <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                Home
              </Link>
              <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                About
              </Link>
              <Link to="/contact" className={`text-sm font-medium transition-colors ${location.pathname === '/contact' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                Contact
              </Link>
              {!isPublic && userRole && (
                <div className="h-4 w-px bg-slate-200 mx-2" />
              )}
              {!isPublic && userRole && (
                <>
                  {userRole === 'student' ? (
                    <>
                      <Link to="/student" className={`text-sm font-medium transition-colors ${location.pathname === '/student' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                        Dashboard
                      </Link>
                      <Link to="/student/resume" className={`text-sm font-medium transition-colors ${location.pathname === '/student/resume' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                        Analysis
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/hr" className={`text-sm font-medium transition-colors ${location.pathname === '/hr' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                        Candidates
                      </Link>
                      <Link to="/hr/analytics" className={`text-sm font-medium transition-colors ${location.pathname === '/hr/analytics' ? 'text-sage-600' : 'text-slate-500 hover:text-slate-900'}`}>
                        Insights
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {userRole ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
                  <User size={16} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 capitalize">{userRole}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signin" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-sage-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sage-700 transition-all shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          key={location.pathname}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2026 AI Placement Copilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
