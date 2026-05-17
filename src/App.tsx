import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Aim } from './pages/Aim';
import { Theory } from './pages/Theory';
import { Solver } from './pages/Solver';
import { Quiz } from './pages/Quiz';
import { ReferencesList } from './pages/References';
import { Contributions } from './pages/Contributions';
import { Contact } from './pages/Contact';
import { ModernCanvas } from './components/layout/ModernCanvas';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'aim': return <Aim />;
      case 'theory': return <Theory onNavigate={navigate} />;
      case 'solver': return <Solver />;
      case 'pretest': return <Quiz type="pretest" />;
      case 'posttest': return <Quiz type="posttest" />;
      case 'references': return <ReferencesList />;
      case 'contributions': return <Contributions />;
      case 'contact': return <Contact />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      <ModernCanvas />
      <div className="flex relative max-w-[1800px] mx-auto min-h-screen">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={navigate} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 min-h-screen flex flex-col min-w-0">
          <div className="w-full max-w-[1400px] mx-auto flex-1 px-4 py-8 lg:px-16 lg:py-24">
            {renderPage()}
          </div>

          {/* Editorial Footer */}
          <footer className="w-full glass border-t border-slate-200 dark:border-white/5 py-24 relative z-10">
            <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
              <div className="grid md:grid-cols-12 gap-16">
                <div className="md:col-span-6 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand rounded-sm flex items-center justify-center shadow-2xl shadow-brand/20">
                      <span className="font-serif italic text-2xl font-bold text-white">d∫</span>
                    </div>
                    <span className="editorial-heading text-3xl">MathNexa</span>
                  </div>
                  <p className="text-slate-500 dark:text-gray-400 font-serif italic text-lg max-w-md leading-relaxed">
                    Advancing the pedagogical standards of symbolic calculus through high-fidelity digital systems.
                  </p>
                </div>
                <div className="md:col-span-3 space-y-6">
                  <label className="editorial-label">System Index</label>
                  <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                    <li><button onClick={() => navigate('home')} className="hover:text-brand transition-colors">Intro</button></li>
                    <li><button onClick={() => navigate('solver')} className="hover:text-brand transition-colors">Solver</button></li>
                    <li><button onClick={() => navigate('theory')} className="hover:text-brand transition-colors">Theory</button></li>
                    <li><button onClick={() => navigate('pretest')} className="hover:text-brand transition-colors">Diagnostic</button></li>
                  </ul>
                </div>
                <div className="md:col-span-3 space-y-6">
                  <label className="editorial-label">Resources</label>
                  <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                    <li><button onClick={() => navigate('references')} className="hover:text-brand transition-colors">Archives</button></li>
                    <li><button onClick={() => navigate('contributions')} className="hover:text-brand transition-colors">Faculty</button></li>
                    <li><button onClick={() => navigate('contact')} className="hover:text-brand transition-colors">Inquiry</button></li>
                  </ul>
                </div>
              </div>
              <div className="pt-20 mt-20 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-300 dark:text-gray-600">
                  &copy; 2024 INTERNATIONAL MATHEMATICAL SYSTEMS
                </div>
                <div className="flex gap-12 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <span>Terms of Research</span>
                  <span>Privacy Protocol</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

