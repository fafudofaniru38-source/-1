
import React, { useState } from 'react';
import Experience from './components/Experience';
import { TreeState } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  const toggleState = () => {
    setTreeState(prev => prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS);
  };

  return (
    <div className="relative w-full h-screen bg-[#01120b] overflow-hidden">
      {/* 3D Experience */}
      <div className="absolute inset-0 z-0">
        <Experience treeState={treeState} />
      </div>

      {/* Luxury UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 sm:p-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-serif italic tracking-tighter" style={{ color: COLORS.GOLD_METALLIC }}>
              Grand Luxury
            </h1>
            <p className="text-sm sm:text-lg uppercase tracking-widest opacity-80" style={{ color: COLORS.GOLD_BRIGHT }}>
              Christmas Collection 2024
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: COLORS.GOLD_METALLIC }}>
              Status: {treeState}
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pointer-events-auto">
          <div className="max-w-md space-y-4">
            <p className="text-sm leading-relaxed opacity-70 italic" style={{ color: COLORS.WHITE_SOFT }}>
              Experience the convergence of digital craftsmanship and festive grandeur. 
              Toggle the state to witness the golden elements assemble into the ultimate tree of light.
            </p>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-12 bg-emerald-800" />
               <span className="text-xs uppercase tracking-tighter opacity-40">Precision Engineered Elegance</span>
            </div>
          </div>

          <button
            onClick={toggleState}
            className="group relative px-10 py-4 bg-emerald-950/40 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-700 overflow-hidden"
          >
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 w-1/2 h-full skew-x-[-30deg] bg-white/10 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10 text-lg sm:text-xl font-medium tracking-widest uppercase transition-colors" 
                  style={{ color: COLORS.GOLD_METALLIC }}>
              {treeState === TreeState.CHAOS ? 'Assemble Tree' : 'Scatter Elements'}
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Borders */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-[#D4AF37]/10 m-4" />
      <div className="absolute inset-0 pointer-events-none border-[1px] border-[#D4AF37]/5 m-6" />
      
      {/* Corner Ornaments */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/20 m-8" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/20 m-8" />
    </div>
  );
};

export default App;
