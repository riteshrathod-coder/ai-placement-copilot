import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, Briefcase, Check, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useEffect } from 'react';

export default function Auth() {
  const { user, userRole, setUserRole } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'hr'>(location.state?.role || 'student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (user && userRole && user.emailVerified) {
      navigate(userRole === 'student' ? '/student' : '/hr', { replace: true });
    } else if (user && !user.emailVerified) {
      setVerificationSent(true);
    }
  }, [user, userRole, navigate]);
  
  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setIsResending(true);
    setError(null);
    try {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/signin',
      });
      setVerificationSent(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-continue-uri') {
        setError("This domain is not authorized in Firebase. Please add " + window.location.origin + " to your Firebase Authorized Domains.");
      } else {
        setError("Failed to resend verification email. Please try again later.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await sendEmailVerification(userCredential.user, {
            url: window.location.origin + '/signin',
          });
        } catch (emailErr: any) {
          console.error("Error sending verification email:", emailErr);
          if (emailErr.code === 'auth/unauthorized-continue-uri') {
            setError("Account created, but verification email failed: Domain not authorized in Firebase. Please add " + window.location.origin + " to Authorized Domains.");
          }
        }
        // We don't sign out immediately anymore, we let the UI handle the unverified state
        setVerificationSent(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setVerificationSent(true);
          return;
        }
        setUserRole(role);
        navigate(role === 'student' ? '/student' : '/hr');
      }
    } catch (err: any) {
      console.error(err);
      if (isSignUp) {
        if (err.code === 'auth/email-already-in-use') {
          setError("User already exists. Please sign in");
        } else {
          setError("An error occurred during sign up. Please try again.");
        }
      } else {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          setError("Email or password is incorrect");
        } else {
          setError("An error occurred during sign in. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-2xl text-sage-600 mb-6">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-4">Verify Your Email</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We have sent you a verification email to <span className="font-semibold text-slate-900">{email || auth.currentUser?.email}</span>. 
              Please verify it and log in.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  signOut(auth);
                  setVerificationSent(false);
                  navigate('/signin');
                }}
                className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-100"
              >
                Back to Login
              </button>
              
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Tip: Check your spam folder if you don't see the email.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-sage-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-slate-100/30 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-xl text-sage-600 mb-4">
              {isSignUp ? <Sparkles size={24} /> : <ShieldCheck size={24} />}
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {isSignUp 
                ? 'Join AI Placement Copilot and elevate your career flow.' 
                : 'Sign in to continue your professional journey.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 text-sm font-medium"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                {isSignUp ? 'Select Your Role' : 'Sign in as'}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                    role === 'student'
                      ? 'border-sage-500 bg-sage-50/50 ring-4 ring-sage-500/10'
                      : 'border-slate-100 bg-white hover:border-sage-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    role === 'student' ? 'bg-sage-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <User size={20} />
                  </div>
                  <div className="font-bold text-sm text-slate-900">Candidate</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">Apply for jobs & analyze resume</div>
                  {role === 'student' && (
                    <motion.div 
                      layoutId="activeRole"
                      className="absolute top-3 right-3 w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check size={12} strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('hr')}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                    role === 'hr'
                      ? 'border-sage-500 bg-sage-50/50 ring-4 ring-sage-500/10'
                      : 'border-slate-100 bg-white hover:border-sage-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    role === 'hr' ? 'bg-sage-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Briefcase size={20} />
                  </div>
                  <div className="font-bold text-sm text-slate-900">HR Pro</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">Manage talent & view insights</div>
                  {role === 'hr' && (
                    <motion.div 
                      layoutId="activeRole"
                      className="absolute top-3 right-3 w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check size={12} strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-[10px] font-bold text-sage-600 hover:text-sage-700 uppercase tracking-wider">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-100 flex items-center justify-center space-x-2 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link 
                to={isSignUp ? '/signin' : '/signup'} 
                className="font-bold text-sage-600 hover:text-sage-700 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
