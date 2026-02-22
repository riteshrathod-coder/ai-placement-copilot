import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronDown, 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

const CANDIDATES = [
  { id: 1, name: "Alex Rivera", role: "Senior Software Engineer", score: 88, status: "Interviewing", branch: "Engineering", skills: ["React", "TypeScript", "Node.js"] },
  { id: 2, name: "Sarah Chen", role: "Product Designer", score: 94, status: "New", branch: "Design", skills: ["Figma", "UX Research", "Prototyping"] },
  { id: 3, name: "Marcus Johnson", role: "DevOps Engineer", score: 76, status: "Rejected", branch: "Engineering", skills: ["AWS", "Docker", "Kubernetes"] },
  { id: 4, name: "Elena Rodriguez", role: "Marketing Manager", score: 82, status: "Shortlisted", branch: "Marketing", skills: ["SEO", "Content Strategy", "Analytics"] },
  { id: 5, name: "David Kim", role: "Data Scientist", score: 91, status: "New", branch: "Data", skills: ["Python", "PyTorch", "SQL"] },
  { id: 6, name: "Jessica Taylor", role: "Frontend Developer", score: 85, status: "Interviewing", branch: "Engineering", skills: ["Vue", "Tailwind", "JavaScript"] },
];

export default function HRDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATES[0] | null>(null);

  const filteredCandidates = CANDIDATES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || c.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const branches = ['All', 'Engineering', 'Design', 'Marketing', 'Data'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Candidate Pipeline</h1>
          <p className="text-sm text-slate-500">Manage and analyze your active talent pool.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {branches.map(branch => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedBranch === branch 
                ? 'bg-sage-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-sage-300'
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Branch</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">AI Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-sage-600 transition-colors">{candidate.name}</div>
                        <div className="text-xs text-slate-500">{candidate.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded-md">
                      {candidate.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${candidate.score > 85 ? 'bg-sage-500' : candidate.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${candidate.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{candidate.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        candidate.status === 'New' ? 'bg-blue-500' :
                        candidate.status === 'Interviewing' ? 'bg-sage-500' :
                        candidate.status === 'Shortlisted' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      <span className="text-xs font-medium text-slate-600">{candidate.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sage-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-900">{selectedCandidate.name}</h2>
                    <p className="text-sm text-slate-500">{selectedCandidate.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Schedule Interview
                  </button>
                  <button className="px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium hover:bg-sage-700 transition-colors shadow-sm">
                    Move to Next Stage
                  </button>
                  <button 
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Split Pane Content */}
              <div className="flex-grow flex overflow-hidden">
                {/* Left Pane: Resume View */}
                <div className="w-1/2 border-r border-slate-100 bg-slate-50 overflow-y-auto p-8">
                  <div className="bg-white shadow-sm border border-slate-200 rounded-xl min-h-[1000px] p-12 relative">
                    <div className="absolute top-8 right-8 text-slate-300">
                      <FileText size={48} />
                    </div>
                    <div className="mb-12">
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedCandidate.name}</h1>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1"><Mail size={14} /> <span>alex.r@example.com</span></span>
                        <span className="flex items-center space-x-1"><MapPin size={14} /> <span>San Francisco, CA</span></span>
                        <span className="flex items-center space-x-1"><ExternalLink size={14} /> <span>portfolio.dev</span></span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Professional Summary</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Results-oriented Senior Software Engineer with over 6 years of experience in building scalable web applications. 
                          Expertise in React, Node.js, and cloud architecture. Proven track record of leading cross-functional teams 
                          to deliver high-impact products in the fintech space.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Experience</h3>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold text-slate-800">Senior Software Engineer</h4>
                              <span className="text-xs font-medium text-slate-400">2021 — Present</span>
                            </div>
                            <div className="text-xs font-bold text-sage-600 mb-2">FinTech Solutions Inc.</div>
                            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                              <li>Architected and implemented a real-time payment processing system handling $2M+ daily transactions.</li>
                              <li>Led a team of 5 developers to migrate legacy monolith to a microservices architecture.</li>
                              <li>Reduced system latency by 40% through optimized database queries and caching strategies.</li>
                            </ul>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                {/* Right Pane: AI Insights */}
                <div className="w-1/2 overflow-y-auto p-8 bg-white">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center space-x-2 mb-6">
                        <BrainCircuit className="text-sage-500" size={24} />
                        <h3 className="text-lg font-display font-bold text-slate-900">AI Analysis Report</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-sage-50 rounded-2xl border border-sage-100">
                          <div className="text-xs font-bold text-sage-600 uppercase tracking-wider mb-1">Market Fit</div>
                          <div className="text-3xl font-display font-bold text-slate-900">{selectedCandidate.score}%</div>
                          <div className="text-[10px] text-sage-500 mt-1 font-medium">Top 5% of candidates</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Authenticity</div>
                          <div className="text-3xl font-display font-bold text-slate-900">94%</div>
                          <div className="text-[10px] text-slate-400 mt-1 font-medium">Verified experience</div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                            <CheckCircle size={16} className="text-sage-500" />
                            <span>Key Strengths</span>
                          </h4>
                          <ul className="space-y-3">
                            {[
                              "Strong technical leadership in complex migrations.",
                              "Quantifiable impact on business metrics (latency, transaction volume).",
                              "Deep expertise in modern frontend and backend stacks."
                            ].map((s, i) => (
                              <li key={i} className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                            <Clock size={16} className="text-amber-500" />
                            <span>Potential Gaps</span>
                          </h4>
                          <ul className="space-y-3">
                            <li className="text-sm text-slate-600 bg-amber-50/30 p-3 rounded-xl border border-amber-100">
                              Limited public contribution to open-source projects.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                            <MessageSquare size={16} className="text-blue-500" />
                            <span>Interview Questions</span>
                          </h4>
                          <div className="space-y-3">
                            {[
                              "Can you elaborate on the specific challenges faced during the microservices migration?",
                              "How do you approach mentoring junior developers in a high-pressure environment?",
                              "Describe a time when you had to make a difficult trade-off between performance and speed of delivery."
                            ].map((q, i) => (
                              <div key={i} className="text-sm italic text-slate-600 border-l-2 border-slate-200 pl-4 py-1">
                                "{q}"
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
