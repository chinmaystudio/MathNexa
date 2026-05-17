import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Timer, 
  Trophy, 
  RotateCcw,
  Layout
} from 'lucide-react';
import { MathRenderer } from '../components/math/MathRenderer';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  text: string;
  math?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following is the condition for an equation M(x,y)dx + N(x,y)dy = 0 to be exact?",
    math: "",
    options: [
      "∂M/∂x = ∂N/∂y",
      "∂M/∂y = ∂N/∂x",
      "∂M/∂y = -∂N/∂x",
      "∂M/∂x = -∂N/∂y"
    ],
    correctAnswer: 1,
    explanation: "An equation is exact if and only if the partial derivative of M with respect to y is equal to the partial derivative of N with respect to x."
  },
  {
    id: 2,
    text: "What is the integrating factor for the linear differential equation:",
    math: "\\frac{dy}{dx} + P(x)y = Q(x)",
    options: [
      "e^∫Q(x)dx",
      "e^∫P(x)dx",
      "∫P(x)dx",
      "1/P(x)"
    ],
    correctAnswer: 1,
    explanation: "The integrating factor for a linear first-order differential equation is always e raised to the power of the integral of P(x)."
  },
  {
    id: 3,
    text: "Test the exactness of the following equation:",
    math: "(x+y)dx + (x-y)dy = 0",
    options: [
      "Exact",
      "Non-Exact",
      "Homogeneous but not exact",
      "Linear"
    ],
    correctAnswer: 0,
    explanation: "M = x+y, N = x-y. ∂M/∂y = 1, ∂N/∂x = 1. Since they are equal, the equation is exact."
  }
];

export const Quiz = ({ type }: { type: 'pretest' | 'posttest' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  useEffect(() => {
    if (isFinished || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === mockQuestions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(120);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="math-card text-center p-16 space-y-10 border border-slate-100 dark:border-white/5"
        >
          <div className="space-y-4">
             <label className="editorial-label">Evaluation Complete</label>
             <h2 className="editorial-heading text-5xl">Analysis Log.</h2>
             <p className="text-slate-500 underline underline-offset-4 font-serif italic">Performance summary for the {type} phase.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 py-10 border-y border-slate-100 dark:border-white/5">
            <div className="space-y-2">
              <div className="text-5xl font-serif italic text-brand">{Math.round((score / mockQuestions.length) * 100)}%</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Precision Index</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-serif italic text-brand">{score}/{mockQuestions.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Validations</div>
            </div>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Re-Initialize System
          </button>
        </motion.div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <label className="editorial-label !mb-1">Assessment Phase</label>
          <h1 className="editorial-heading text-4xl capitalize">{type} 101</h1>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-sm border",
          timeLeft < 30 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 dark:text-gray-400"
        )}>
          <Timer className="w-4 h-4" />
          Time Remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="px-4">
        <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand transition-all duration-1000 ease-out"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12 space-y-8">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="math-card !p-12 space-y-10 border border-slate-100 dark:border-white/5"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em]">Query {String(currentQuestion + 1).padStart(2, '0')}</span>
              <h2 className="editorial-heading text-3xl leading-tight text-slate-900 dark:text-white">{question.text}</h2>
              {question.math && (
                <div className="p-10 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-white/5 flex justify-center">
                  <MathRenderer math={question.math} block />
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleOptionSelect(i)}
                  className={cn(
                    "w-full p-8 text-left rounded-xl border transition-all duration-300 font-serif italic text-lg flex items-center justify-between group",
                    selectedOption === i 
                      ? (i === question.correctAnswer ? "bg-green-500/5 border-green-500/30 text-green-700 dark:text-green-400" : "bg-red-500/5 border-red-500/30 text-red-700 dark:text-red-400")
                      : (showResult && i === question.correctAnswer ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400" : "border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-brand/40 group")
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-6 h-6 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold border",
                      selectedOption === i 
                        ? (i === question.correctAnswer ? "bg-green-500 border-green-500 text-white" : "bg-red-500 border-red-500 text-white")
                        : (showResult && i === question.correctAnswer ? "bg-green-500 border-green-500 text-white" : "bg-slate-50 dark:bg-white/10 dark:border-white/5 text-slate-400 group-hover:border-brand/50 group-hover:text-brand")
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {option}
                  </div>
                  {showResult && i === question.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-10 border-t border-slate-100 dark:border-white/5"
                >
                  <div className={cn(
                    "p-8 rounded-xl font-serif italic text-lg leading-relaxed relative overflow-hidden",
                    selectedOption === question.correctAnswer ? "bg-green-500/5 text-green-700 dark:text-green-400" : "bg-red-500/5 text-red-700 dark:text-red-400"
                  )}>
                    <div className="font-bold text-xs uppercase tracking-widest mb-4 opacity-70">
                      Rationale — {selectedOption === question.correctAnswer ? "Analytical Success" : "Logical Deviation"}
                    </div>
                    {question.explanation}
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl"
                  >
                    {currentQuestion === mockQuestions.length - 1 ? "Complete Examination" : "Next Inquiry"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
