import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend,
  ZAxis
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { getPyodide } from '../../services/pyodide';

interface GraphViewProps {
  equation: string;
  className?: string;
}

export const GraphView = ({ equation, className }: GraphViewProps) => {
  const [plotData, setPlotData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cValues] = useState<number[]>([-4, -2, 0, 2, 4]);

  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  useEffect(() => {
    if (!equation) return;
    
    const fetchPlotData = async () => {
      setIsLoading(true);
      try {
        const pyodide = await getPyodide();
        const xMin = -8;
        const xMax = 8;
        const points = 150;
        
        const equationEscaped = equation.replace(/"/g, '\\"');
        const resultJson = await pyodide.runPythonAsync(`get_plot_data("${equationEscaped}", ${JSON.stringify(cValues)}, ${xMin}, ${xMax}, ${points})`);
        const result = JSON.parse(resultJson);
        
        if (result.error) {
          console.error(result.error);
          return;
        }

        setPlotData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlotData();
  }, [equation, cValues]);

  return (
    <div className={cn("math-card !p-8 space-y-6 relative overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="editorial-label !mb-0">Solution Manifold</label>
          <div className="text-[10px] uppercase font-mono text-slate-400">
            {isLoading ? 'Computing Vectors...' : 'Dynamic Phase Trajectories'}
          </div>
        </div>
        <div className={cn("w-3 h-3 rounded-full", isLoading ? "bg-brand/20 animate-pulse" : "bg-green-500/20")} />
      </div>

      <div className="h-96 w-full bg-slate-50/50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-white/5 p-4 relative group">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="currentColor" className="text-slate-200 dark:text-white/5" />
            <XAxis 
              dataKey="x" 
              type="number"
              name="x"
              domain={[-8, 8]}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              label={{ value: 'x', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis 
              dataKey="y" 
              type="number"
              name="y"
              domain={[-8, 8]}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              label={{ value: 'y', position: 'left', angle: -90, offset: 0, fontSize: 10, fill: '#94a3b8' }}
            />
            <ZAxis range={[1, 1]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl text-[10px] font-mono">
                      <div className="text-brand font-bold mb-1 uppercase tracking-tighter">Phase Coordinate</div>
                      <div className="flex gap-4">
                        <div>X: {Number(payload[0].value).toFixed(2)}</div>
                        <div>Y: {Number(payload[1].value).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {plotData && Object.entries(plotData).map(([c, branches]: [string, any], cIdx) => (
              branches.map((branch: any, bIdx: number) => (
                <Scatter 
                  key={`${c}-${bIdx}`}
                  name={`C = ${c}`}
                  data={branch.x.map((x: number, i: number) => ({ x, y: branch.y[i] }))}
                  fill={colors[cIdx % colors.length]}
                  line={{ stroke: colors[cIdx % colors.length], strokeWidth: 2 }}
                  shape={() => null}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              ))
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3">
        {cValues.map((c, i) => (
           <div key={c} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">C={c}</span>
           </div>
        ))}
      </div>

      <div className="text-[9px] font-serif italic text-slate-400 dark:text-gray-500 pt-2 border-t border-slate-50 dark:border-white/5">
        * Isoclines and trajectories represent the steady-state evolution of the differential system under varying initial conditions.
      </div>
    </div>
  );
};
