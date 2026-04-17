import React from 'react';
import { motion } from 'motion/react';
import { SeedCard as SeedCardType } from '../types';
import { SproutLogo } from './SproutLogo';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  card: SeedCardType;
  onClick: () => void;
  layoutId?: string;
  isSelectionMode?: boolean;
  isSelected?: boolean;
}

export const SeedGridItem: React.FC<Props> = ({ card, onClick, layoutId, isSelectionMode, isSelected }) => {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 0.95 : 1,
        filter: isSelectionMode && !isSelected ? 'grayscale(0.5) opacity(0.5)' : 'none'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative aspect-[3/4] rounded-3xl overflow-visible cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-neon-pink ring-offset-4 ring-offset-midnight' : ''}`}
      style={{ backgroundColor: card.color }}
    >
      {/* Selection Indicator */}
      {isSelectionMode && (
        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full z-20 flex items-center justify-center transition-all ${
          isSelected ? 'bg-neon-pink text-white scale-110' : 'bg-white/20 border border-white/40'
        }`}>
          {isSelected && <CheckCircle2 size={14} />}
        </div>
      )}
      {/* Abstract String - Extending beyond card */}
      <svg className="absolute -top-4 -left-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none opacity-40 overflow-visible" viewBox="0 0 200 260">
        <motion.path
          d="M 100 36 Q 140 70 80 130 T 120 230"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <circle cx="100" cy="36" r="4" fill="white" />
      </svg>

      {/* Sprouting Watermark Overlay */}
      {card.isSprouting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <SproutLogo 
            className="w-48 h-48 opacity-[0.5] -rotate-12 translate-x-8 translate-y-8" 
            color="#FFFFFF" 
          />
        </div>
      )}

      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex justify-end items-start">
          {/* Button Decoration */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/40 rounded-full" />
          </div>

          <div className="text-black/30">
            <span className="font-black text-[7px] uppercase tracking-widest">
              {new Date(card.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-black text-lg font-black leading-tight tracking-tight line-clamp-3">
            {card.title}
          </h3>
          <div className="w-8 h-0.5 bg-black/10 mt-2 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};
