import React from 'react';
import { motion } from 'motion/react';
import { Target, Flag, Rocket, ShieldCheck } from 'lucide-react';

export const Aim = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-20 pb-20">
      <div className="text-center space-y-6">
        <label className="editorial-label">Philosophical Aim</label>
        <h1 className="editorial-heading text-5xl">Mission Protocol.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg max-w-xl mx-auto">Establishing the conceptual bridge between pure mathematics and applied engineering.</p>
      </div>

      <div className="grid gap-12">
        {[
          {
            icon: Target,
            title: 'Foundational Inquiry',
            desc: 'To establish a high-fidelity symbolic environment for the rigorous analysis of first-order ordinary differential systems.'
          },
          {
            icon: Rocket,
            title: 'Cognitive Velocity',
            desc: 'Accelerating the pedagogical transition from abstract notation to intuitive mastery through real-time feedback loops.'
          },
          {
            icon: ShieldCheck,
            title: 'Trust & Accuracy',
            desc: 'Ensuring the integrity of every derivation through a robust algorithmic core, providing a terminal source of truth for research.'
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="glass !p-12 border-slate-100 dark:border-white/5 relative group overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
              <div className="w-10 h-10 rounded-sm bg-brand/5 border border-brand/20 flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                 <item.icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-6">
                <h3 className="editorial-heading text-3xl text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-500 dark:text-gray-400 font-serif italic text-xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-slate-100 dark:text-white/[0.02] font-bold select-none uppercase tracking-widest scale-150">
              Objective 0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
