import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      <div className="text-center space-y-6">
        <label className="editorial-label">Communications Hub</label>
        <h1 className="editorial-heading text-5xl">Direct Inquiry.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg text-balance max-w-2xl mx-auto">
          For technical alignment, academic partnerships, or system feedback, please utilize the formal protocol below.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="math-card !p-12 space-y-12 border border-slate-100 dark:border-white/5">
            <div className="flex items-start gap-8">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="editorial-heading text-xl">Academic Center</h4>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-serif italic">123 Mathematical Way, Sci-City,<br />Innovation District, State 45678</p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="editorial-heading text-xl">Direct Line</h4>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-serif italic">+1 (555) MATH-CORE</p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="editorial-heading text-xl">Digital Intake</h4>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-serif italic">support@desolver.systems</p>
              </div>
            </div>
          </div>

          <div className="bg-brand text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">Partnerships</label>
                <h3 className="editorial-heading text-3xl">System Integration.</h3>
                <p className="text-white/70 text-lg font-serif italic leading-relaxed">
                  Protocols for institutional deployment and large-scale academic research are available upon request.
                </p>
                <button className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white/40 pb-1 hover:border-white transition-colors">
                  Protocol Request
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <motion.div 
            className="math-card !p-12 h-full relative border border-slate-100 dark:border-white/5"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-16 space-y-8"
                >
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="editorial-heading text-3xl">Transmitted.</h3>
                    <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg leading-relaxed">System acknowledgment received. A Response will be formulated shortly.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="editorial-label">Subject Identity</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Authorized Representative"
                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl focus:border-brand outline-none transition-all font-serif italic"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="editorial-label">Digital Coordinate</label>
                      <input 
                        required
                        type="email" 
                        placeholder="researcher@domain.edu"
                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl focus:border-brand outline-none transition-all font-serif italic"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="editorial-label">Query Classification</label>
                    <select className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl outline-none focus:border-brand transition-all appearance-none cursor-pointer font-serif italic">
                      <option>Academic Inquiry</option>
                      <option>Technical Deviation</option>
                      <option>Symbolic Engine Report</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="editorial-label">Manuscript / Message</label>
                    <textarea 
                      required
                      placeholder="Detail your inquiry for the system..."
                      rows={6}
                      className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl focus:border-brand outline-none transition-all resize-none font-serif italic"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-sm font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    Transmit Inquiry
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
