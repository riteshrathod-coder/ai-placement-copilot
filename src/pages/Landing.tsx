import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Briefcase, UserCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { setUserRole } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'hr') => {
    navigate('/signup', { state: { role } });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sage-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold mb-6"
          >
            <Sparkles size={14} />
            <span>AI-Powered Career Intelligence</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight"
          >
            Navigate Your Career with <span className="text-sage-600">Precision</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-500 mb-10 leading-relaxed"
          >
            The bridge between raw talent and professional excellence. 
            AI Placement Copilot uses advanced AI to align your experience with market demands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-sage-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-200 group"
            >
              <span>I'm a Candidate</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleRoleSelect('hr')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:border-sage-300 hover:bg-sage-50 transition-all shadow-sm"
            >
              <span>I'm an HR Professional</span>
            </button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Briefcase className="text-sage-500" />,
              title: "Resume Analysis",
              desc: "Deep-dive into your professional narrative with AI-driven insights."
            },
            {
              icon: <UserCheck className="text-sage-500" />,
              title: "Market Alignment",
              desc: "See exactly how your skills map to current industry standards."
            },
            {
              icon: <Sparkles className="text-sage-500" />,
              title: "Smart Matching",
              desc: "HR tools that surface the right talent through multi-faceted filtering."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bento-card"
            >
              <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
