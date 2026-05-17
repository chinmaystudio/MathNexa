import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, BookOpen, Info, CheckCircle2 } from 'lucide-react';
import { MathRenderer } from '../components/math/MathRenderer';
import { cn } from '@/src/lib/utils';

interface TheorySection {
  id: string;
  title: string;
  content: React.ReactNode;
  equations?: string[];
}

const sections: TheorySection[] = [
  {
    id: 'intro',
    title: 'Differential Equations Introduction',
    content: (
      <div className="space-y-4">
        <p>A differential equation is an equation that relates one or more functions and their derivatives. In applications, the functions generally represent physical quantities, the derivatives represent their rates of change, and the equation defines a relationship between the two.</p>
        <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10 border-l-4 border-l-brand">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-brand" />
            General Form
          </h4>
          <p className="mb-4">A first-order ordinary differential equation can be written as:</p>
          <MathRenderer math="M(x,y)dx + N(x,y)dy = 0" block />
        </div>
      </div>
    )
  },
  {
    id: 'exact',
    title: 'Exact Differential Equations',
    content: (
      <div className="space-y-4">
        <p>A differential equation <MathRenderer math="M(x,y)dx + N(x,y)dy = 0" /> is called <strong>exact</strong> if there exists a function <MathRenderer math="f(x,y)" /> such that its differential is equal to the equation.</p>
        <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10 border-l-4 border-l-green-500">
           <h4 className="font-bold mb-2">Condition for Exactness</h4>
           <MathRenderer math="\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}" block />
        </div>
        <p>If this condition is met, the solution is given by <MathRenderer math="f(x,y) = C" />.</p>
      </div>
    )
  },
  {
    id: 'non-exact',
    title: 'Non-Exact Differential Equations',
    content: (
      <div className="space-y-4">
        <p>If the condition for exactness is not satisfied, i.e.,</p>
        <MathRenderer math="\frac{\partial M}{\partial y} \neq \frac{\partial N}{\partial x}" block />
        <p>Then the equation is non-exact. However, it can often be made exact by multiplying with an <strong>Integrating Factor (IF)</strong>.</p>
      </div>
    )
  },
  {
    id: 'integrating-factor',
    title: 'Integrating Factor (IF)',
    content: (
      <div className="space-y-4">
        <p>The choice of integrating factor depends on certain conditions:</p>
        <ul className="space-y-4 list-disc list-inside text-sm">
          <li>
            If <MathRenderer math="\frac{1}{N} (\frac{\partial M}{\partial y} - \frac{\partial N}{\partial x}) = f(x)" />, then:
            <MathRenderer math="\mu(x) = e^{\int f(x) dx}" block />
          </li>
          <li>
            If <MathRenderer math="\frac{1}{M} (\frac{\partial N}{\partial x} - \frac{\partial M}{\partial y}) = g(y)" />, then:
            <MathRenderer math="\mu(y) = e^{\int g(y) dy}" block />
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'linear',
    title: 'Linear Differential Equations',
    content: (
      <div className="space-y-4">
        <p>A first-order linear differential equation is of the form:</p>
        <MathRenderer math="\frac{dy}{dx} + P(x)y = Q(x)" block />
        <p>The solution is found using the integrating factor <MathRenderer math="\mu(x) = e^{\int P(x) dx}" />:</p>
        <MathRenderer math="y \cdot \mu(x) = \int Q(x) \mu(x) dx + C" block />
      </div>
    )
  }
];

export const Theory = ({ onNavigate }: { onNavigate: (page: any) => void }) => {
  const [openSection, setOpenSection] = useState<string | null>('intro');

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <div className="text-center space-y-4">
        <label className="editorial-label">Academic Foundations</label>
        <h1 className="editorial-heading text-5xl">The Theory of Flux.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg max-w-2xl mx-auto">
          An advanced treatise on the derivation and analysis of symbolic differential systems.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className="group"
          >
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className={cn(
                "w-full flex items-center justify-between p-8 rounded-xl text-left transition-all duration-500 border relative overflow-hidden",
                openSection === section.id 
                  ? "bg-white dark:bg-editor-card border-brand shadow-2xl shadow-brand/10" 
                  : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-brand/30"
              )}
            >
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-mono text-slate-300 dark:text-gray-600">SECTION 0{index + 1}</span>
                 <span className={cn(
                  "editorial-heading text-2xl transition-colors duration-300",
                  openSection === section.id ? "text-brand" : "text-slate-900 dark:text-white"
                )}>
                  {section.title}
                </span>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 transition-transform duration-500",
                openSection === section.id ? "rotate-180 text-brand" : "text-slate-300 group-hover:text-brand"
              )} />
            </button>
            <AnimatePresence>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-10 pb-12 text-slate-600 dark:text-gray-400 leading-relaxed font-serif text-lg bg-slate-50/50 dark:bg-white/[0.02] border-x border-b border-slate-100 dark:border-white/5 rounded-b-xl">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-brand rounded-[2.5rem] p-16 text-white overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">Assessment Module</label>
            <h3 className="editorial-heading text-4xl">Validate your mastery?</h3>
            <p className="opacity-70 leading-relaxed font-serif italic text-lg">
              Engage with our diagnostic evaluation to verify conceptual alignment with modern differential engineering.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6 text-sm font-bold">
            <button 
              onClick={() => onNavigate('pretest')}
              className="px-12 py-5 bg-white text-brand rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-colors shadow-2xl"
            >
              Initiate Pretest
            </button>
            <div className="flex gap-6 opacity-60">
               <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Exactness</span>
               <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Factors</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
      </div>
    </div>
  );
};
