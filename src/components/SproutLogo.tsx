import React from 'react';
import { motion } from 'motion/react';

interface Props {
  className?: string;
  color?: string;
  animate?: boolean;
  size?: number;
  stage?: 'sprout' | 'flower' | 'fruit';
}

export const SproutLogo: React.FC<Props> = ({ 
  className = "", 
  color = "#FF0080", 
  animate = false, 
  size = 40,
  stage = 'sprout'
}) => {
  return (
    <svg 
      viewBox="0 0 40 40" 
      width={size} 
      height={size} 
      className={className}
    >
      <motion.g 
        initial={{ x: 20, y: 20, rotate: 0, scale: 0.95 }}
        animate={animate ? {
          rotate: [0, -5, 5, 0],
          scale: [0.95, 1, 0.9, 0.95]
        } : { x: 20, y: 20, rotate: 0, scale: 0.95 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Stage-specific vertical offset to center the "individual" at (20,20) */}
        <g transform={
          stage === 'fruit' 
            ? "translate(0, 0)" 
            : stage === 'flower' 
              ? "translate(0, 15)" 
              : "translate(0, 13)"
        }>
          {/* Stem - Only for sprout and flower */}
          {stage !== 'fruit' && (
            <path d="M 0 0 Q -3 -7 0 -16" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
          )}
          
          {/* Head based on stage */}
          <g transform={stage === 'fruit' ? "translate(0, 0)" : "translate(0, -16)"}>
            {stage === 'sprout' && (
              <>
                <path d="M 0 0 Q 10 -10 18 -3 Q 7 7 0 0" fill={color} />
                <path d="M 0 0 Q -10 -10 -18 -3 Q -7 7 0 0" fill={color} className="brightness-110" />
              </>
            )}
            
            {stage === 'flower' && (
              <g>
                {/* Petals */}
                {[0, 72, 144, 216, 288].map((angle) => (
                  <path 
                    key={angle}
                    d="M 0 0 Q 7 -10 14 0 Q 7 10 0 0" 
                    fill={color} 
                    transform={`rotate(${angle})`}
                    className="opacity-80"
                  />
                ))}
                {/* Center */}
                <circle cx="0" cy="0" r="4" fill={color} className="brightness-125" />
              </g>
            )}
            
            {stage === 'fruit' && (
              <g>
                {/* Gold Peach Body */}
                <path 
                  d="M 0 10 
                     C 14 8 18 -2 10 -9
                     C 7 -13 0 -11 0 -11
                     C 0 -11 -7 -13 -10 -9
                     C -18 -2 -14 8 0 10" 
                  fill="#FFD700" 
                />
                {/* Shine */}
                <circle cx="5" cy="-4" r="3" fill="white" className="opacity-40" />
                {/* Suture line */}
                <path d="M 0 -11 L 0 -3" fill="none" stroke="black" strokeWidth="0.5" className="opacity-20" />
                
                {/* Top Leaves - Peach Style */}
                <g transform="translate(0, -11)">
                  <path d="M 0 0 Q 8 -10 12 -2 Q 4 4 0 0" fill="#70FF00" transform="rotate(-15)" />
                  <path d="M 0 0 Q -8 -10 -12 -2 Q -4 4 0 0" fill="#70FF00" transform="rotate(15)" className="brightness-110" />
                </g>
              </g>
            )}
          </g>
        </g>
      </motion.g>
    </svg>
  );
};
