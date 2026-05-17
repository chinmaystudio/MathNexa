import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, GraduationCap } from 'lucide-react';

const contributors = [
  {
    name: 'Chinmay Joshi',
    role: 'Development Head',
    description: 'Lead architecture, implementation, debugging, and system testing.',
    github: '#',
    linkedin: '#',
    grad: 'FY BTech IT'
  },
  {
    name: 'Sakshi Walzade',
    role: 'Design',
    description: 'Conceptual design and core user interface architecture.',
    github: '#',
    linkedin: '#',
    grad: 'FY BTech IT'
  },
  {
    name: 'Amrita Kharasne',
    role: 'Research',
    description: 'In-depth analysis of differential theory and mathematical foundations.',
    github: '#',
    linkedin: '#',
    grad: 'FY BTech IT'
  },
  {
    name: 'Dhairyashil Patil',
    role: 'Mathematical Logic',
    description: 'Derivation of symbolic algorithms and computational proof logic.',
    github: '#',
    linkedin: '#',
    grad: 'FY BTech IT'
  }
];

export const Contributions = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-24 pb-20">
      <div className="text-center space-y-4">
        <label className="editorial-label">Research Faculty</label>
        <h1 className="editorial-heading text-5xl">Our Contributors.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg">The individuals responsible for the conceptual and technical architecture of this system.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {contributors.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group"
          >
            <div className="math-card !p-16 flex flex-col items-center text-center space-y-10 border border-slate-100 dark:border-white/5 relative overflow-hidden">
               <div className="space-y-3">
                 <h3 className="editorial-heading text-3xl text-slate-900 dark:text-white">{member.name}</h3>
                 <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand">{member.role}</p>
                 <div className="flex items-center justify-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-widest pt-2">
                    <GraduationCap className="w-3 h-3" />
                    {member.grad}
                 </div>
               </div>

               <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg leading-relaxed border-t border-slate-50 dark:border-white/5 pt-8">
                 {member.description}
               </p>

               <div className="flex items-center gap-8 pt-4">
                  <button className="text-slate-300 dark:text-gray-600 hover:text-brand transition-colors">
                    <Github className="w-5 h-5 focus:outline-none" />
                  </button>
                  <button className="text-slate-300 dark:text-gray-600 hover:text-brand transition-colors">
                    <Linkedin className="w-5 h-5 focus:outline-none" />
                  </button>
                  <button className="text-slate-300 dark:text-gray-600 hover:text-brand transition-colors">
                    <Twitter className="w-5 h-5 focus:outline-none" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
