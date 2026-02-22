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
  Download,
  Send,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, PolarGrid, PolarAngleAxis, Radar, RadarChart } from 'recharts';
import { analyzeResume, matchJobWithResume } from '../services/geminiService';

const LOADING_STEPS = [
  "Initializing neural parser...",
  "Extracting semantic experience...",
  "AI is parsing your experience...",
  "Mapping skill clusters...",
  "Calculating market fit...",
  "Generating career trajectory..."
];

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "LinkedIn",
    location: "Sunnyvale, CA",
    type: "Remote",
    description: "We are looking for a Senior Frontend Engineer with expertise in React, TypeScript, and high-performance web applications. You will be responsible for building intuitive user interfaces for millions of users.",
    salary: "$160k - $220k",
    logo: "https://picsum.photos/seed/linkedin/100/100"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Hybrid",
    description: "Google is seeking a Full Stack Developer to join our Cloud team. Experience with Node.js, Go, and distributed systems is highly desirable. Help us build the next generation of cloud infrastructure.",
    salary: "$150k - $210k",
    logo: "https://picsum.photos/seed/google/100/100"
  },
  {
    id: 3,
    title: "AI Research Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "On-site",
    description: "Join OpenAI to work on cutting-edge generative models. We need engineers who can bridge the gap between research and production. Strong background in Python and PyTorch required.",
    salary: "$200k - $300k",
    logo: "https://picsum.photos/seed/openai/100/100"
  },
  {
    id: 4,
    title: "Backend Architect",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Remote",
    description: "Scale our streaming infrastructure to the next level. Expertise in Java, distributed systems, and cloud architecture is essential.",
    salary: "$180k - $250k",
    logo: "https://picsum.photos/seed/netflix/100/100"
  },
  {
    id: 5,
    title: "Product Designer",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Hybrid",
    description: "Design the future of travel. We are looking for a designer who can balance aesthetics with functionality and user empathy.",
    salary: "$140k - $190k",
    logo: "https://picsum.photos/seed/airbnb/100/100"
  }
];

export default function StudentDashboard() {
  const { user, resumeData, setResumeData } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'jobs'>('analysis');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');

  const locations = ['All', ...Array.from(new Set(MOCK_JOBS.map(j => j.location)))];
  const jobTypes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setLoadingStep(0);
    setError(null);

    // Start progress simulation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 1 : prev));
    }, 100);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      let analysisInput: string | { data: string, mimeType: string };

      if (uploadedFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(uploadedFile);
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
        });
        analysisInput = { data: base64, mimeType: uploadedFile.type };
      } else {
        analysisInput = resumeText;
      }

      const result = await analyzeResume(analysisInput);
      
      setUploadProgress(100);
      setLoadingStep(LOADING_STEPS.length - 1);
      
      setTimeout(() => {
        setResumeData({
          name: user?.displayName || user?.email?.split('@')[0] || "Candidate",
          email: user?.email || "candidate@example.com",
          skills: result.skills,
          experience: "Analyzed via AI Placement Copilot",
          summary: result.summary,
          scores: result.scores,
          authenticityFeedback: result.authenticityFeedback,
          suggestedRoles: result.suggestedRoles,
          learningResources: result.learningResources,
          rawText: result.extractedText || (typeof analysisInput === 'string' ? analysisInput : "")
        });
        setIsUploading(false);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze resume. Please try again.");
      setIsUploading(false);
    } finally {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setUploadedFile(file);
      setResumeText(''); // Clear text if file is uploaded
    }
  };

  const handleMatchJob = async (job: any) => {
    if (!resumeData?.rawText) return;
    
    setSelectedJob(job);
    setIsMatching(true);
    setMatchResult(null);
    
    try {
      const result = await matchJobWithResume(resumeData.rawText, job.description);
      setMatchResult(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to match job. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesKeyword = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || job.location === locationFilter;
    const matchesCompany = job.company.toLowerCase().includes(companyQuery.toLowerCase());
    const matchesType = jobTypeFilter === 'All' || job.type === jobTypeFilter;
    return matchesKeyword && matchesLocation && matchesCompany && matchesType;
  });

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
          <p className="text-slate-500">Upload your resume file or paste your resume text below to get a comprehensive AI analysis of your career flow.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 text-sm font-medium">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-600 mb-6">
              <FileUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Resume</h3>
            <p className="text-slate-500 text-sm mb-8">Support PDF, DOCX, or TXT files up to 5MB.</p>
            
            <label className="w-full cursor-pointer">
              <div className={`w-full py-12 border-2 border-dashed rounded-2xl transition-all ${uploadedFile ? 'border-sage-500 bg-sage-50' : 'border-slate-200 hover:border-sage-300 hover:bg-slate-50'}`}>
                {uploadedFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-sage-500 mb-2" size={24} />
                    <span className="text-sm font-medium text-slate-900">{uploadedFile.name}</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); setUploadedFile(null); }}
                      className="mt-2 text-xs text-rose-500 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-slate-600">Click to select or drag and drop</span>
                    <span className="text-xs text-slate-400 mt-1">Max file size 5MB</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="space-y-4 h-full flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Or Paste Resume Text</label>
              <textarea
                className="flex-grow w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all resize-none font-mono"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => { setResumeText(e.target.value); setUploadedFile(null); }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleAnalyze}
            disabled={(!resumeText.trim() && !uploadedFile) || isUploading}
            className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap size={18} />
            <span>Analyze with AI</span>
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-slate-900">{resumeData.name}</h1>
            <span className="px-2 py-0.5 bg-sage-100 text-sage-700 text-[10px] font-bold uppercase tracking-wider rounded">Candidate</span>
          </div>
          <p className="text-slate-500 flex items-center space-x-2">
            <span>{resumeData.email}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>AI Career Analysis</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setResumeData(null)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Reset Analysis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'analysis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Analysis
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Job Market
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analysis' ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Section 1: Executive Summary & Fit */}
            <div className="md:col-span-12 mt-4 mb-2">
              <h2 className="text-xl font-display font-bold text-slate-800 flex items-center space-x-2">
                <Target className="text-sage-600" size={20} />
                <span>Executive Summary & Fit</span>
              </h2>
            </div>

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
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your profile shows strong alignment with current market demands.
              </p>
            </div>

            {/* Radar Chart Card */}
            <div className="md:col-span-4 bento-card">
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

            {/* Insights Bento */}
            <div className="md:col-span-4 bento-card bg-slate-900 text-white border-none">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">AI Summary</h3>
              <div className="mb-6">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{resumeData.summary}"
                </p>
              </div>
              <button className="w-full mt-auto py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <span>View Full Roadmap</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Section 2: Professional Profile */}
            <div className="md:col-span-12 mt-8 mb-2">
              <h2 className="text-xl font-display font-bold text-slate-800 flex items-center space-x-2">
                <Briefcase className="text-sage-600" size={20} />
                <span>Professional Profile</span>
              </h2>
            </div>

            {/* Suggested Roles */}
            {resumeData.suggestedRoles && (
              <div className="md:col-span-8 bento-card">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Suggested Roles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resumeData.suggestedRoles.map((role, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 bg-sage-500 rounded-full" />
                      <span className="text-sm font-medium text-slate-700">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bento-card flex flex-col justify-between group relative">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs font-bold text-blue-600">
                    {resumeData.scores?.authenticity && resumeData.scores.authenticity > 80 ? 'High' : 'Check'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Authenticity</h4>
                  <p className="text-2xl font-display font-bold text-slate-900">{resumeData.scores?.authenticity}%</p>
                </div>
                {resumeData.authenticityFeedback && (
                  <div className="absolute inset-0 bg-slate-900/95 text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center text-center leading-relaxed">
                    {resumeData.authenticityFeedback}
                  </div>
                )}
              </div>
              <div className="bento-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <AlertCircle size={20} />
                  </div>
                  <span className="text-xs font-bold text-amber-600">Impact</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Impact Score</h4>
                  <p className="text-2xl font-display font-bold text-slate-900">{resumeData.scores?.impact}%</p>
                </div>
              </div>
            </div>

            {/* Section 3: Skills & Growth */}
            <div className="md:col-span-12 mt-8 mb-2">
              <h2 className="text-xl font-display font-bold text-slate-800 flex items-center space-x-2">
                <Zap className="text-sage-600" size={20} />
                <span>Skills & Growth</span>
              </h2>
            </div>

            {/* Skills Bento */}
            <div className="md:col-span-12 bento-card">
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
              </div>
            </div>

            {/* Learning Resources */}
            {resumeData.learningResources && (
              <div className="md:col-span-12 bento-card">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Learning Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {resumeData.learningResources.map((resource, i) => (
                    <a 
                      key={i} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-sage-300 hover:shadow-md transition-all flex items-start justify-between group"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-sage-600 transition-colors">{resource.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{resource.platform}</p>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-sage-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Keywords (e.g. React, AI)"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all appearance-none"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all appearance-none"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type === 'All' ? 'All Job Types' : type}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                  <div 
                    key={job.id}
                    className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer ${
                      selectedJob?.id === job.id ? 'border-sage-500 ring-4 ring-sage-500/5' : 'border-slate-100 hover:border-sage-200'
                    }`}
                    onClick={() => handleMatchJob(job)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900">{job.title}</h4>
                          <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-sage-600">{job.salary}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {job.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">Full Time</span>
                        <span className="px-2 py-1 bg-sage-50 rounded text-[10px] font-bold text-sage-600 uppercase">{job.type}</span>
                      </div>
                      <button className="text-sm font-bold text-sage-600 hover:text-sage-700 flex items-center space-x-1">
                        <span>Analyze Match</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                  <p className="text-slate-500">No jobs found matching your criteria.</p>
                </div>
              )}
              </div>

              <div className="md:col-span-1">
                <div className="sticky top-24 bento-card min-h-[400px]">
                  {isMatching ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-12 h-12 border-4 border-sage-100 border-t-sage-500 rounded-full animate-spin mb-4" />
                      <p className="text-slate-500 font-medium">AI is calculating your match probability...</p>
                    </div>
                  ) : matchResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fit Score</h3>
                        <div className="text-5xl font-display font-bold text-sage-600 mb-2">{matchResult.matchProbability}%</div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                          <motion.div 
                            className="h-full bg-sage-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${matchResult.matchProbability}%` }}
                          />
                        </div>

                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Placement Probability</h3>
                        <div className="text-3xl font-display font-bold text-blue-600 mb-2">{matchResult.placementProbability}%</div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${matchResult.placementProbability}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800">AI Analysis</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {matchResult.explanation}
                        </p>
                      </div>

                      {matchResult.missingSkills?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-800">Skills to Acquire</h4>
                          <div className="flex flex-wrap gap-2">
                            {matchResult.missingSkills.map((skill: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded uppercase">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => {
                          alert(`Application submitted successfully for ${selectedJob.title} at ${selectedJob.company}!`);
                        }}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg mt-4"
                      >
                        Apply Now
                      </button>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Target size={32} />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2">Select a Job</h4>
                      <p className="text-sm text-slate-500">
                        Click on a job to see how well your profile matches the requirements.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
