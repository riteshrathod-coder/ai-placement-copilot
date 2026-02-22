import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-2xl text-sage-600 mb-6">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-6">Get in Touch</h1>
        <p className="text-xl text-slate-500 leading-relaxed">
          Have questions? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center text-sage-600 mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Email</h3>
          <p className="text-sm text-slate-500">support@aiplacement.com</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center text-sage-600 mx-auto mb-4">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Phone</h3>
          <p className="text-sm text-slate-500">+1 (555) 123-4567</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center text-sage-600 mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Chat</h3>
          <p className="text-sm text-slate-500">Available 24/7</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"></textarea>
          </div>
          <button type="button" className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-100">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
