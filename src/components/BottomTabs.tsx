import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Zap } from 'lucide-react';
import { PlantIcon } from './PlantIcon';
import { TabType } from '../types';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'garden' as TabType, label: '花园', icon: LayoutGrid },
    { id: 'pulse' as TabType, label: '发芽', icon: PlantIcon },
    { id: 'capture' as TabType, label: '闪念', icon: Zap },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-[100]">
      <div className="max-w-[400px] mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-between pointer-events-auto shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center py-3 gap-1 transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-3xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon 
                size={20} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-neon-pink' : 'text-white/40'}`} 
              />
              <span className={`relative z-10 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/20'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
