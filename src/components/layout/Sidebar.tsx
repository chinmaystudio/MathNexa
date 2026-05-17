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
import { SidebarGlyph } from './SidebarGlyph';

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass shadow-lg border border-blue-300 dark:border-white/10"
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
            className="lg:hidden fixed inset-0 z-40 bg-blue-900/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen z-50 w-64 glass border-r border-blue-300 dark:border-white/5 flex flex-col transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="pt-20 lg:pt-8 flex flex-col h-full">
          <div className="px-8 mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarGlyph />
              <span className="text-lg font-bold tracking-tight uppercase text-slate-900 dark:text-slate-100 italic">MathNexa</span>
            </div>
            <ThemeToggle />
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onPageChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-300 group text-sm font-medium relative",
                currentPage === item.id
                  ? "bg-blue-200/50 dark:bg-brand/20 text-brand dark:text-white border-brand shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:text-brand dark:hover:text-white hover:bg-blue-100 dark:hover:bg-brand/10"
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
            </motion.button>
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
        </div>
      </motion.aside>
    </>
  );
};
