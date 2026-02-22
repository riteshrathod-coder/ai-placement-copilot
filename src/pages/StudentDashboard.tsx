import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Target, 
  Layers,
  ChevronRight,
  Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, PolarGrid, PolarAngleAxis, Radar, RadarChart } from 'recharts';

const LOADING_STEPS = [
  "Initializing neural parser...",
  "Extracting semantic experience...",
  "AI is parsing your experience...",
  "Mapping skill clusters...",
  "Calculating market fit...",
  "Generating career trajectory..."
];

export default function StudentDashboard() {
  const { resumeData, setResumeData } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setLoadingStep(0);
  };

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setResumeData({
                name: "Alex Rivera",
                email: "alex.rivera@example.com",
                skills: ["React", "TypeScript", "Node.js", "System Design", "Product Strategy"],
                experience: "Senior Software Engineer with 6 years of experience in fintech and SaaS.",
                scores: {
                  fit: 88,
                  authenticity: 94,
                  clarity: 82,
                  impact: 76,
                  relevance: 91
                }
              });
              setIsUploading(false);
            }, 1000);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      const stepInterval = setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
      };
    }
  }, [isUploading, setResumeData]);

  if (isUploading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center"
        >
          <div className="mb-8 relative">
            <div className="w-24 h-24 border-4 border-sage-100 rounded-full mx-auto" />
            <motion.div 
              className="absolute top-0 left-1/2 -ml-12 w-24 h-24 border-4 border-sage-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute top-0 left-1/2 -ml-12 w-24 h-24 flex items-center justify-center">
              <span className="text-xl font-bold text-sage-600">{uploadProgress}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Analyzing Your Profile</h2>
          
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-sage-500"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="space-y-4">
            {LOADING_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: i <= loadingStep ? 1 : 0.3,
                  x: 0,
                  color: i === loadingStep ? '#5d7c5d' : i < loadingStep ? '#94a3b8' : '#cbd5e1'
                }}
                className="flex items-center justify-center space-x-3 text-sm font-medium"
              >
                {i < loadingStep ? <CheckCircle2 size={16} /> : i === loadingStep ? <Zap size={16} className="animate-pulse" /> : <div className="w-4 h-4 rounded-full border border-slate-200" />}
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Upload your resume to get a comprehensive AI analysis of your career flow.</p>
        </div>

        <div 
          onClick={handleUpload}
          className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-sage-400 hover:bg-sage-50/30 transition-all duration-500"
        >
          <div className="w-20 h-20 bg-sage-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <FileUp size={32} className="text-sage-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Drop your resume here</h3>
          <p className="text-slate-500 mb-8">Supports PDF, DOCX up to 10MB</p>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg">
            Select File
          </button>
        </div>
      </div>
    );
  }

  const scoreData = [
    { subject: 'Fit', A: resumeData.scores?.fit || 0, fullMark: 100 },
    { subject: 'Authenticity', A: resumeData.scores?.authenticity || 0, fullMark: 100 },
    { subject: 'Clarity', A: resumeData.scores?.clarity || 0, fullMark: 100 },
    { subject: 'Impact', A: resumeData.scores?.impact || 0, fullMark: 100 },
    { subject: 'Relevance', A: resumeData.scores?.relevance || 0, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-slate-900">{resumeData.name}</h1>
            <span className="px-2 py-0.5 bg-sage-100 text-sage-700 text-[10px] font-bold uppercase tracking-wider rounded">Senior Level</span>
          </div>
          <p className="text-slate-500 flex items-center space-x-2">
            <span>{resumeData.email}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Career Analysis Report</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={16} />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={() => setResumeData(null)}
            className="px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium hover:bg-sage-700 transition-colors shadow-sm"
          >
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Score Card */}
        <div className="md:col-span-4 bento-card flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Overall Market Fit</h3>
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: resumeData.scores?.fit || 0 }, { value: 100 - (resumeData.scores?.fit || 0) }]}
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill="#5d7c5d" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-display font-bold text-slate-900">{resumeData.scores?.fit}%</span>
              <span className="text-xs font-bold text-sage-600 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +4% vs last month
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your profile shows exceptional alignment with current market demands in the fintech sector.
          </p>
        </div>

        {/* Radar Chart Card */}
        <div className="md:col-span-5 bento-card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Competency Matrix</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#5d7c5d"
                  fill="#5d7c5d"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-3 grid grid-rows-2 gap-6">
          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold text-blue-600">High</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Authenticity</h4>
              <p className="text-2xl font-display font-bold text-slate-900">{resumeData.scores?.authenticity}%</p>
            </div>
          </div>
          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertCircle size={20} />
              </div>
              <span className="text-xs font-bold text-amber-600">Moderate</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Impact Score</h4>
              <p className="text-2xl font-display font-bold text-slate-900">{resumeData.scores?.impact}%</p>
            </div>
          </div>
        </div>

        {/* Skills Bento */}
        <div className="md:col-span-8 bento-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Skill Clusters</h3>
            <Layers size={16} className="text-slate-300" />
          </div>
          <div className="flex flex-wrap gap-3">
            {resumeData.skills.map((skill, i) => (
              <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-2 group hover:border-sage-300 transition-colors">
                <span className="text-sm font-medium text-slate-700">{skill}</span>
                <span className="w-1.5 h-1.5 bg-sage-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <div className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-400 hover:border-sage-300 hover:text-sage-500 cursor-pointer transition-colors">
              + Add Skill
            </div>
          </div>
        </div>

        {/* Insights Bento */}
        <div className="md:col-span-4 bento-card bg-slate-900 text-white border-none">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">AI Insights</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-sage-500/20 text-sage-400 rounded">
                <Target size={14} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Strengthen your <span className="text-white font-medium">Impact Score</span> by quantifying achievements in your SaaS experience.
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-sage-500/20 text-sage-400 rounded">
                <Target size={14} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your <span className="text-white font-medium">System Design</span> skills are in the top 5% of candidates for Lead roles.
              </p>
            </li>
          </ul>
          <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2">
            <span>View Full Roadmap</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
