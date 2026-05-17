import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Target, 
  BookOpen, 
  Calculator, 
  FileCheck, 
  FileText, 
  Library, 
  Users, 
  Mail,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export type PageId = 'home' | 'aim' | 'theory' | 'solver' | 'pretest' | 'posttest' | 'references' | 'contributions' | 'contact';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'aim', label: 'Aim', icon: Target },
  { id: 'theory', label: 'Theory', icon: BookOpen },
  { id: 'solver', label: 'Solver', icon: Calculator },
  { id: 'pretest', label: 'Pretest', icon: FileCheck },
  { id: 'posttest', label: 'Posttest', icon: FileText },
  { id: 'references', label: 'References', icon: Library },
  { id: 'contributions', label: 'Contributions', icon: Users },
  { id: 'contact', label: 'Contact Us', icon: Mail },
];

export const Sidebar = ({ currentPage, onPageChange, isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-editor-nav border-r border-slate-200 dark:border-editor-border flex flex-col pt-20 lg:pt-8 overflow-y-auto transition-colors duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-8 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-sm flex items-center justify-center shadow-lg shadow-brand/20">
              <span className="font-serif italic text-2xl font-bold text-white">d∫</span>
            </div>
            <span className="text-lg font-bold tracking-tight uppercase text-slate-900 dark:text-slate-100 italic">MathNexa</span>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-300 group text-sm font-medium",
                currentPage === item.id
                  ? "bg-slate-100 dark:bg-white/5 text-brand dark:text-white border-l-2 border-brand"
                  : "text-slate-500 dark:text-slate-400 hover:text-brand dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <span className={cn(
                "text-[10px] font-mono opacity-50",
                currentPage === item.id ? "text-brand dark:text-white underline" : "text-slate-400"
              )}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
              {currentPage === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-200 dark:border-editor-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-bold">Engine Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Active</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-gray-600 uppercase tracking-widest font-bold leading-relaxed">
            &copy; 2024 EDU-MATH SYSTEMS
          </p>
        </div>
      </motion.aside>
    </>
  );
};
