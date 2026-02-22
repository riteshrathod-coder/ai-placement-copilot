import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-500/10 rounded-2xl text-sage-400 mb-6 border border-sage-500/20">
          <Info size={32} />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-6">About AI Placement Copilot</h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          We are dedicated to bridging the gap between talent and opportunity using cutting-edge artificial intelligence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            To empower candidates with data-driven insights into their professional narrative and provide HR professionals with the tools to identify the perfect fit with precision.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-slate-400 leading-relaxed">
            A world where career progression is transparent, meritocratic, and powered by intelligent alignment between skills and market needs.
          </p>
        </div>
      </div>
    </div>
  );
}
