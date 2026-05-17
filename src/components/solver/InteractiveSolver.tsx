import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ChevronRight, 
  RefreshCcw,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';
import { getPyodide } from '../../services/pyodide';
import { MathRenderer } from '../math/MathRenderer';
import { GraphView } from './GraphView';
import { cn } from '@/src/lib/utils';

interface Step {
  id: number;
  title: string;
}

export const InteractiveSolver = () => {
  const [mInput, setMInput] = useState('3*x^2 + 4*x*y');
  const [nInput, setNInput] = useState('2*x^2 + 2*y');
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(0); // 0: input, 1-7: interactive steps
  const [stepsData, setStepsData] = useState<any>(null);
  const [userData, setUserData] = useState<any>({
    dMdy: '',
    dNdx: '',
    isExact: '',
    mu: '',
    intM: '',
    phiPrime: '',
    phi: '',
    solution: ''
  });
  const [verification, setVerification] = useState<any>({});
  const [showHint, setShowHint] = useState(false);
  const [isExact, setIsExact] = useState<boolean | null>(null);
  const [muInfo, setMuInfo] = useState<any>(null);

  useEffect(() => {
    getPyodide().then(() => setIsEngineReady(true));
  }, []);

  const handleStart = async () => {
    if (!mInput || !nInput) return;
    setIsProcessing(true);
    try {
      const pyodide = await getPyodide();
      
      // Step 1 data: Partials
      const mEscaped = mInput.replace(/"/g, '\\"');
      const nEscaped = nInput.replace(/"/g, '\\"');
      const partialsJson = await pyodide.runPythonAsync(`compute_partials("${mEscaped}", "${nEscaped}")`);
      const partials = JSON.parse(partialsJson);
      
      if (partials.error) {
        alert("Error: " + partials.error);
        setIsProcessing(false);
        return;
      }

      setStepsData({ partials });
      setCurrentStep(1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyAtStep = async (field: string, userInput: string, correctStr: string) => {
    if (!userInput) return;
    try {
      const pyodide = await getPyodide();
      const isEqual = await pyodide.runPythonAsync(`verify_expr("${userInput.replace(/"/g, '\\"')}", "${correctStr.replace(/"/g, '\\"')}")`);
      setVerification({ ...verification, [field]: isEqual ? 'correct' : 'wrong' });
      return isEqual;
    } catch (e) {
      console.error(e);
      setVerification({ ...verification, [field]: 'wrong' });
      return false;
    }
  };

  const checkExactness = async (userAns: string) => {
    const pyodide = await getPyodide();
    const correctExact = await pyodide.runPythonAsync(`check_exactness("${stepsData.partials.dM_dy_str}", "${stepsData.partials.dN_dx_str}")`);
    
    const isCorrect = (userAns.toLowerCase() === 'yes' && correctExact) || (userAns.toLowerCase() === 'no' && !correctExact);
    setVerification({ ...verification, isExact: isCorrect ? 'correct' : 'wrong' });
    setIsExact(correctExact);
    
    if (isCorrect) {
      if (!correctExact) {
        // Need integrating factor
        const mEscaped = mInput.replace(/"/g, '\\"');
        const nEscaped = nInput.replace(/"/g, '\\"');
        const muJson = await pyodide.runPythonAsync(`find_integrating_factor("${mEscaped}", "${nEscaped}")`);
        setMuInfo(JSON.parse(muJson));
      } else {
        // Exact, compute solution steps
        const mEscaped = mInput.replace(/"/g, '\\"');
        const nEscaped = nInput.replace(/"/g, '\\"');
        const solJson = await pyodide.runPythonAsync(`solve_exact_equation("${mEscaped}", "${nEscaped}")`);
        setStepsData({ ...stepsData, solution: JSON.parse(solJson) });
      }
    }
    return isCorrect;
  };

  const handleNext = async () => {
    const pyodide = await getPyodide();
    if (currentStep === 1) {
      if (verification.dMdy === 'correct' && verification.dNdx === 'correct') {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (verification.isExact === 'correct') {
        if (isExact) setCurrentStep(4); // Skip mu step
        else setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (verification.mu === 'correct') {
        const mEscaped = mInput.replace(/"/g, '\\"');
        const nEscaped = nInput.replace(/"/g, '\\"');
        const solJson = await pyodide.runPythonAsync(`solve_with_integrating_factor("${mEscaped}", "${nEscaped}", "${muInfo.mu_str}")`);
        setStepsData({ ...stepsData, solution: JSON.parse(solJson) });
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      if (verification.intM === 'correct') setCurrentStep(5);
    } else if (currentStep === 5) {
      if (verification.phiPrime === 'correct') setCurrentStep(6);
    } else if (currentStep === 6) {
      if (verification.phi === 'correct') setCurrentStep(7);
    } else if (currentStep === 7) {
      if (verification.solution === 'correct') setCurrentStep(8); // Finished
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setUserData({
      dMdy: '',
      dNdx: '',
      isExact: '',
      mu: '',
      intM: '',
      phiPrime: '',
      phi: '',
      solution: ''
    });
    setVerification({});
    setShowHint(false);
    setIsExact(null);
    setMuInfo(null);
  };

  const applyHint = () => {
    if (!stepsData) return;
    
    switch (currentStep) {
      case 1:
        setUserData({ ...userData, dMdy: stepsData.partials.dM_dy_str, dNdx: stepsData.partials.dN_dx_str });
        break;
      case 2:
        setUserData({ ...userData, isExact: isExact ? 'yes' : 'no' });
        break;
      case 3:
        if (muInfo) setUserData({ ...userData, mu: muInfo.mu_str });
        break;
      case 4:
        if (stepsData.solution) setUserData({ ...userData, intM: stepsData.solution.intM_str });
        break;
      case 5:
        if (stepsData.solution) setUserData({ ...userData, phiPrime: stepsData.solution.phi_prime_str });
        break;
      case 6:
        if (stepsData.solution) setUserData({ ...userData, phi: stepsData.solution.phi_str });
        break;
      case 7:
        if (stepsData.solution) setUserData({ ...userData, solution: stepsData.solution.solution_u_str });
        break;
    }
    setShowHint(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="math-card space-y-8 p-10">
            <div className="space-y-4">
               <label className="editorial-label">System Input Components</label>
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <span className="text-[10px] font-mono opacity-50 uppercase">M(x, y)</span>
                   <input 
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 rounded-lg font-mono text-xl outline-none focus:border-brand"
                      value={mInput} 
                      onChange={(e) => setMInput(e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <span className="text-[10px] font-mono opacity-50 uppercase">N(x, y)</span>
                   <input 
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 rounded-lg font-mono text-xl outline-none focus:border-brand"
                      value={nInput} 
                      onChange={(e) => setNInput(e.target.value)}
                   />
                 </div>
               </div>
            </div>
            <button 
              onClick={handleStart}
              disabled={!isEngineReady || isProcessing}
              className="w-full py-5 bg-brand text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Initializing Engine...' : 'Begin Symbolic Derivation'}
            </button>
            {!isEngineReady && (
              <p className="text-[10px] text-slate-400 text-center font-mono animate-pulse">Loading Python Runtime (Pyodide + SymPy)...</p>
            )}
          </div>
        );

      case 1:
        return (
          <StepContainer 
            title="Partial Differentiation" 
            description="Differentiate M with respect to y, and N with respect to x. This is the first verification step."
            hint="For M, treat x as a constant. For N, treat y as a constant."
            onHint={applyHint}
          >
            <div className="space-y-6">
              <div className="p-4 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex justify-center">
                 <MathRenderer math={`M = ${stepsData.partials.M_latex}, \\quad N = ${stepsData.partials.N_latex}`} block />
              </div>
              
              <InputField 
                label="∂M / ∂y" 
                value={userData.dMdy} 
                onChange={(v) => setUserData({...userData, dMdy: v})}
                onCheck={() => verifyAtStep('dMdy', userData.dMdy, stepsData.partials.dM_dy_str)}
                status={verification.dMdy}
              />
              <InputField 
                label="∂N / ∂x" 
                value={userData.dNdx} 
                onChange={(v) => setUserData({...userData, dNdx: v})}
                onCheck={() => verifyAtStep('dNdx', userData.dNdx, stepsData.partials.dN_dx_str)}
                status={verification.dNdx}
              />

              {verification.dMdy === 'correct' && verification.dNdx === 'correct' && (
                <NextButton onClick={handleNext} />
              )}
            </div>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer 
            title="Exactness Verification" 
            description="Compare your computed partial derivatives. If they are identical, the differential form is exact."
            onHint={applyHint}
            hint={isExact ? "The partial derivatives are equal, so it's exact (yes)." : "The partial derivatives are different, so it's not exact (no)."}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100/50 dark:bg-white/5 rounded-xl border-l-2 border-brand text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">∂M / ∂y</div>
                  <MathRenderer math={stepsData.partials.dM_dy} block />
                </div>
                <div className="p-4 bg-slate-100/50 dark:bg-white/5 rounded-xl border-l-2 border-brand text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">∂N / ∂x</div>
                  <MathRenderer math={stepsData.partials.dN_dx} block />
                </div>
              </div>

              <div className="space-y-3">
                <label className="editorial-label">Is the equation exact? (yes/no)</label>
                <div className="flex gap-4">
                  <input 
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 rounded-lg font-mono text-lg outline-none focus:border-brand"
                    value={userData.isExact}
                    onChange={(e) => setUserData({...userData, isExact: e.target.value})}
                  />
                  <button 
                    onClick={() => checkExactness(userData.isExact)}
                    className="px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest"
                  >
                    Verify
                  </button>
                </div>
                {verification.isExact === 'correct' && (
                  <p className="text-sm text-green-500 font-bold italic">Verification Success: Proceeding to {isExact ? 'Integration' : 'Integrating Factor'}.</p>
                )}
                {verification.isExact === 'wrong' && (
                   <p className="text-sm text-red-500 font-bold italic text-center">Logic Deviation detected. Re-examine the partials.</p>
                )}
              </div>

              {verification.isExact === 'correct' && <NextButton onClick={handleNext} />}
            </div>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer 
            title="Integrating Factor (μ)" 
            description="The equation is non-exact. We must compute an integrating factor to force exactness."
            onHint={applyHint}
            hint="Integrating factor is computed as exp(∫ f(x) dx) or exp(∫ f(y) dy)."
          >
             <div className="space-y-6">
               <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 space-y-4">
                  <p className="text-sm font-serif italic text-slate-500">
                    Condition: The expression <MathRenderer math={`\\frac{M_y - N_x}{N}`} /> depends only on {muInfo.type}.
                  </p>
                  <div className="flex justify-center">
                    <MathRenderer math={`\\frac{M_y - N_x}{N} = ${muInfo.expr}`} block />
                  </div>
               </div>

               <InputField 
                label="μ = exp(∫ expression)" 
                value={userData.mu} 
                onChange={(v) => setUserData({...userData, mu: v})}
                onCheck={() => verifyAtStep('mu', userData.mu, muInfo.mu_str)}
                status={verification.mu}
              />

              {verification.mu === 'correct' && <NextButton onClick={handleNext} />}
             </div>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer 
            title="Primary Integration" 
            description="Integrate M (or the new μM) with respect to x. Treat y as an invariant constant."
            onHint={applyHint}
            hint="Solve the integral with respect to x, adding phi(y) as the constant of integration."
          >
            <div className="space-y-6">
              <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex justify-center">
                <MathRenderer math={`\\int ${stepsData.solution.intM_str.includes('*') ? '(' + stepsData.solution.M_new + ')' : stepsData.solution.intM_str} dx`} block />
              </div>

              <InputField 
                label="∫ M dx" 
                value={userData.intM} 
                onChange={(v) => setUserData({...userData, intM: v})}
                onCheck={() => verifyAtStep('intM', userData.intM, stepsData.solution.intM_str)}
                status={verification.intM}
                suffix="+ φ(y)"
              />

              {verification.intM === 'correct' && <NextButton onClick={handleNext} />}
            </div>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer 
            title="Determining φ'(y)" 
            description="Differentiate your result with respect to y, then set it equal to N (or μN) to find the missing component."
            onHint={applyHint}
            hint="The difference between N and the partial derivative of ∫Mdx gives phi'(y)."
          >
            <div className="space-y-6">
              <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Current Partial Gradient</p>
                <div className="flex justify-center">
                   <MathRenderer math={`\\frac{\\partial}{\\partial y} \\left( ${stepsData.solution.intM} \\right) = ${stepsData.solution.d_intM_dy || '...'}`} block />
                </div>
              </div>

              <InputField 
                label="φ'(y) = N - ∂/∂y(∫Mdx)" 
                value={userData.phiPrime} 
                onChange={(v) => setUserData({...userData, phiPrime: v})}
                onCheck={() => verifyAtStep('phiPrime', userData.phiPrime, stepsData.solution.phi_prime_str)}
                status={verification.phiPrime}
              />

              {verification.phiPrime === 'correct' && <NextButton onClick={handleNext} />}
            </div>
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer 
            title="Final Integration" 
            description="Integrate φ'(y) with respect to y to recover the full potential function."
            onHint={applyHint}
            hint="Recover phi(y) by integrating its derivative with respect to y."
          >
            <div className="space-y-6">
              <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex justify-center">
                <MathRenderer math={`\\int (${stepsData.solution.phi_prime}) dy`} block />
              </div>

              <InputField 
                label="φ(y) = " 
                value={userData.phi} 
                onChange={(v) => setUserData({...userData, phi: v})}
                onCheck={() => verifyAtStep('phi', userData.phi, stepsData.solution.phi_str)}
                status={verification.phi}
              />

              {verification.phi === 'correct' && <NextButton onClick={handleNext} />}
            </div>
          </StepContainer>
        );

      case 7:
        return (
          <StepContainer 
            title="General Solution" 
            description="Combine all derived components into the final potential function u(x,y) = C."
            onHint={applyHint}
            hint="State the final potential function equated to constant C."
          >
            <div className="space-y-6">
               <div className="p-10 bg-brand text-white rounded-2xl text-center space-y-4">
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Potential Function Construct</span>
                  <div className="text-2xl font-serif italic">
                    <MathRenderer math={`${stepsData.solution.intM} + ${stepsData.solution.phi}`} />
                  </div>
               </div>

               <InputField 
                label="u(x,y) = C" 
                value={userData.solution} 
                onChange={(v) => setUserData({...userData, solution: v})}
                onCheck={() => verifyAtStep('solution', userData.solution, stepsData.solution.solution_u_str)}
                status={verification.solution}
                suffix="= C"
              />

              {verification.solution === 'correct' && (
                <div className="pt-6">
                   <button 
                     onClick={handleNext}
                     className="w-full py-5 bg-green-600 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-green-500/20"
                   >
                     Finalize Protocol
                   </button>
                </div>
              )}
            </div>
          </StepContainer>
        );

      case 8:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="math-card !p-16 text-center space-y-10"
          >
             <div className="space-y-4">
                <label className="editorial-label">System Success</label>
                <h2 className="editorial-heading text-6xl">Derivation <br />Complete.</h2>
                <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg max-w-md mx-auto">
                  You have successfully navigated the symbolic complexities of this system.
                </p>
             </div>

             <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                <label className="editorial-label !mb-6">Final General Solution</label>
                <div className="text-3xl font-serif italic text-brand dark:text-white">
                  <MathRenderer math={stepsData.solution.solution} />
                </div>
             </div>

             <GraphView equation={stepsData.solution.solution_u_str} />

             <button 
              onClick={reset}
              className="px-10 py-5 border border-slate-200 dark:border-white/10 rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
             >
               Start New Session
             </button>
          </motion.div>
        )

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(0)}
              className="p-2 text-slate-400 hover:text-brand transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          )}
          <h2 className="editorial-heading text-3xl">Symbolic Engine</h2>
        </div>
        {currentStep > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phase</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(s => (
                <div 
                  key={s} 
                  className={cn(
                    "w-6 h-1 rounded-full transition-colors",
                    currentStep === s ? "bg-brand" : s < currentStep ? "bg-brand/30" : "bg-slate-200 dark:bg-white/5"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep}
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const StepContainer = ({ children, title, description, hint, onHint }: any) => {
  const [showHint, setShowHint] = useState(false);
  
  const handleHintToggle = () => {
    setShowHint(!showHint);
    if (onHint) onHint();
  };

  return (
    <div className="math-card !p-12 space-y-10 relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="editorial-label !mb-0">Analytical Phase</label>
          {hint && (
            <button 
              onClick={handleHintToggle}
              className="text-[10px] uppercase tracking-widest font-bold text-brand hover:underline"
            >
              {showHint ? 'Hide Methodology' : 'Methodology Hint'}
            </button>
          )}
        </div>
        <h3 className="editorial-heading text-4xl">{title}</h3>
        <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 bg-brand/5 border-l-2 border-brand rounded-r-xl"
          >
            <p className="text-sm font-serif italic text-brand dark:text-indigo-300">
              {hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        {children}
      </div>
      
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-brand/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};

const InputField = ({ label, value, onChange, onCheck, status, suffix }: any) => {
  return (
    <div className="space-y-3">
      <label className="editorial-label text-slate-400">{label}</label>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input 
            className={cn(
              "w-full bg-white dark:bg-slate-950 border p-5 rounded-xl font-mono text-xl outline-none transition-all",
              status === 'correct' ? "border-green-500 bg-green-500/5" : status === 'wrong' ? "border-red-500 bg-red-500/5" : "border-slate-200 dark:border-white/10 focus:border-brand"
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={status === 'correct'}
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-slate-400 italic">
              {suffix}
            </div>
          )}
        </div>
        <button 
          onClick={onCheck}
          disabled={status === 'correct'}
          className={cn(
            "px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
            status === 'correct' ? "bg-green-500 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          )}
        >
          {status === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : 'Check'}
        </button>
      </div>
      {status === 'wrong' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-2"
        >
          * Computational Error Detected. Verify Notation.
        </motion.p>
      )}
    </div>
  );
};

const NextButton = ({ onClick }: any) => (
  <motion.button 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className="w-full py-5 bg-brand text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-3"
  >
    Advance Phase
    <ChevronRight className="w-4 h-4" />
  </motion.button>
);
