import React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Lightbulb, 
  Layers, 
  Activity, 
  LineChart, 
  LayoutDashboard,
  ArrowRight,
  Play
} from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';
import { MathRenderer } from '../components/math/MathRenderer';
import { DynamicBackground } from '../components/layout/DynamicBackground';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="space-y-32 pb-20">
      {/* Editorial Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        <DynamicBackground />
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand/10 rounded-full blur-[100px]" />
        
        <div className="w-full max-w-full mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-blue-100 dark:bg-white/10" />
                <span className="editorial-label !mb-0 text-brand">Symbolic Logic Platform</span>
                <div className="h-px w-12 bg-blue-100 dark:bg-white/10" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
                The Mathematics of <br />
                <span className="text-brand">Change.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-serif italic">
                A professional-grade environment for engineering students to explore, derive, and master differential equations with symbolic precision.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <motion.button
                onClick={() => onNavigate('solver')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-brand text-white rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-brand/20 hover:bg-brand-dark transition-all"
              >
                Launch Solver 
              </motion.button>
              <motion.button
                onClick={() => onNavigate('theory')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border border-blue-100 dark:border-white/10 text-slate-900 dark:text-white rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-brand hover:text-white transition-all"
              >
                Read Monographs
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Decorative Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Scroll to Explore</span>
          <div className="w-px h-12 bg-blue-100/50 dark:bg-white/20" />
        </div>
      </section>

      {/* Editorial Features Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
          {[
            { tag: "Computation", title: 'Symbolic Processing', desc: 'Hardware-accelerated engine designed for real-time symbolic derivation of M(x,y) complexes.' },
            { tag: "Pedagogy", title: 'Step-by-Step Logic', desc: 'Narrative-driven step sequences that explain the logic of integration factors and exactness.' },
            { tag: "Visuals", title: 'Dynamic Plotting', desc: 'High-fidelity field visualizations and solution curves rendered with vector precision.' },
            { tag: "Identity", title: 'Exactness Verification', desc: 'Instant partial derivative analysis to determine the fundamental properties of equations.' },
            { tag: "Curation", title: 'Expert Monographs', desc: 'A curated library of theory covering homogeneous, linear, and Bernoulli equation structures.' },
            { tag: "Assessment", title: 'Phase Evaluations', desc: 'Diagnostic tools designed to identify conceptual gaps in calculus and differential logic.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ perspective: 1000 }}
                className="group space-y-6 cursor-default"
              >
                <motion.div
                  whileHover={{ rotateX: 5, rotateY: 5, z: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="space-y-6 p-6 rounded-2xl transition-colors glass border border-blue-200 dark:border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-300 dark:text-gray-600">0{i + 1}</span>
                    <div className="h-px flex-1 bg-blue-100/20 dark:bg-white/5 group-hover:bg-brand/30 transition-colors" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand opacity-0 group-hover:opacity-100 transition-opacity">{feature.tag}</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="editorial-heading text-2xl group-hover:text-brand transition-colors">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-gray-400 font-serif italic text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
  
        {/* Exhibit Section */}
        <section className="w-full max-w-[1600px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto glass rounded-3xl p-16 md:p-24 border border-blue-200 dark:border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
               <DynamicBackground />
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <label className="editorial-label">Selected Exhibit</label>
                <h2 className="editorial-heading text-4xl md:text-5xl leading-tight">Solving Non-Exact Systems.</h2>
                <p className="text-slate-500 dark:text-gray-400 font-serif italic leading-relaxed">
                  Experience the transition from a non-exact state to an exact differential through the application of integrating factors—a cornerstone of differential engineering.
                </p>
                <button 
                   onClick={() => onNavigate('solver')}
                   className="editorial-btn border-b-2 border-brand text-brand hover:bg-brand hover:text-white"
                >
                  Examine in Solver
                </button>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02, rotateY: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass p-12 rounded-[2rem] shadow-3xl transform rotate-2 border border-blue-200 dark:border-white/5"
              >
                 <div className="text-center space-y-8">
                   <MathRenderer math="y^2 dx + (x^2 - xy - y^2) dy = 0" block />
                   <div className="h-px w-12 bg-blue-200 dark:bg-white/10 mx-auto" />
                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Case Study 12-B</p>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
    </div>
  );
};
