import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Globe, Link as LinkIcon, FileText } from 'lucide-react';

const references = [
  {
    title: 'Elementary Differential Equations',
    authors: 'William E. Boyce, Richard C. DiPrima',
    type: 'Book',
    link: '#',
    desc: 'Special focus on applications and modeling differential equations.'
  },
  {
    title: 'Ordinary Differential Equations',
    authors: 'Morris Tenenbaum, Harry Pollard',
    type: 'Book',
    link: '#',
    desc: 'Comprehensive coverage of first-order equations and their solutions.'
  },
  {
    title: 'Differential Equations & Linear Algebra',
    authors: 'Gilbert Strang',
    type: 'Course Material',
    link: 'https://ocw.mit.edu',
    desc: 'MIT OpenCourseWare modules on exact and linear equations.'
  },
  {
    title: 'Khan Academy: Differential Equations',
    authors: 'Sal Khan',
    type: 'Online Course',
    link: 'https://www.khanacademy.org',
    desc: 'Excellent video tutorials on solving first order equations.'
  }
];

export const ReferencesList = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="text-center space-y-4">
        <label className="editorial-label">Scholarly Archives</label>
        <h1 className="editorial-heading text-5xl">References.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg">Curated materials and academic documentation utilized for platform development.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {references.map((ref, i) => (
          <motion.a
            key={i}
            href={ref.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="math-card !p-10 group flex flex-col h-full border-slate-100 dark:border-white/5 relative overflow-hidden"
          >
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-300 dark:text-gray-600">FOLIO_0{i + 1}</div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand">{ref.type}</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="editorial-heading text-2xl text-slate-900 dark:text-white group-hover:text-brand transition-colors">{ref.title}</h3>
                <p className="text-sm text-slate-400 font-serif italic underline underline-offset-4 decoration-slate-100 dark:decoration-white/5">Author(s): {ref.authors}</p>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed pt-2">
                  {ref.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-brand transition-all duration-300">
                Access Document <LinkIcon className="w-3 h-3 group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        ))}
      </div>
    </div>
  );
};
