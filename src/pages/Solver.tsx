import React from 'react';
import { InteractiveSolver } from '../components/solver/InteractiveSolver';

export const Solver = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <label className="editorial-label">Computational Laboratory</label>
          <h1 className="editorial-heading text-5xl">Interactive Solver.</h1>
          <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg max-w-2xl mx-auto">
            A symbolic execution environment for the step-by-step resolution of first-order ordinary differential equations.
          </p>
        </div>

        <InteractiveSolver />
      </div>
    </div>
  );
};
