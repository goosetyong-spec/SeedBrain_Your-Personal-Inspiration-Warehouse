import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  color: string;
  shapePath: string;
  size?: number;
  isWavy?: boolean;
  isInbox?: boolean;
}

export const BlobCreature: React.FC<Props> = ({ color, shapePath, size = 120, isWavy = false, isInbox = false }) => {
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [wavyPath, setWavyPath] = useState(shapePath);

  useEffect(() => {
    const moveEyes = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 2.5;
      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
      setTimeout(moveEyes, 1000 + Math.random() * 2000);
    };
    moveEyes();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isWavy) {
      // Faster interval for more "liquid" feel
      interval = setInterval(() => {
        setWavyPath(generateRandomBlob());
      }, 200);
    } else {
      setWavyPath(shapePath);
    }
    return () => clearInterval(interval);
  }, [isWavy, shapePath]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
        {/* The Blob Body */}
        <motion.path 
          animate={{ d: wavyPath }}
          transition={{ 
            duration: 0.4, // Longer duration for smoother transition between random shapes
            ease: "easeInOut" 
          }}
          d={shapePath} 
          fill={color} 
        />
        
        {/* The Sprout (苗) or Lightning (闪电) */}
        <g transform={`translate(${isInbox ? 40 : 50}, ${isInbox ? 24 : 15}) scale(${isInbox ? 0.64 : 0.8}) ${isInbox ? 'rotate(5)' : 'rotate(-5)'}`}>
          {isInbox ? (
            /* Lightning Bolt for Inbox - Pink and Energetic - Height reduced by 20% */
            <path 
              d="M 16.5 -40 L 5.5 -4 L 13.2 -4 L -16.5 40 L -5.5 4 L -13.2 4 Z" 
              fill="#FF007F"
              className="drop-shadow-[0_0_12px_rgba(255,0,127,0.5)]"
            />
          ) : (
            <>
              {/* The Stem - Longer and more vertical */}
              <path 
                d="M 0 15 Q -5 0 0 -25" 
                fill="none" 
                stroke={color} 
                strokeWidth="5" 
                strokeLinecap="round" 
                className="brightness-90"
              />
              {/* The Leaves */}
              <g transform="translate(0, -25)">
                <path 
                  d="M 0 0 Q 15 -15 25 -5 Q 10 10 0 0" 
                  fill={color} 
                  className="brightness-95"
                />
                <path 
                  d="M 0 0 Q -15 -15 -25 -5 Q -10 10 0 0" 
                  fill={color} 
                  className="brightness-110"
                />
              </g>
            </>
          )}
        </g>

        {/* The Eyes - Larger pupils and vertical ellipses */}
        <g transform="translate(68, 55)">
          {/* Left Eye */}
          <ellipse cx="-9" cy="0" rx="6.5" ry="9" fill="white" />
          <motion.circle 
            animate={{ x: -9 + eyePos.x, y: eyePos.y }}
            cx="0" cy="0" r="4.5" fill="black" 
          />
          
          {/* Right Eye */}
          <ellipse cx="9" cy="0" rx="6.5" ry="9" fill="white" />
          <motion.circle 
            animate={{ x: 9 + eyePos.x, y: eyePos.y }}
            cx="0" cy="0" r="4.5" fill="black" 
          />
        </g>
      </svg>
    </div>
  );
};

// Helper to generate a random blob path - Restored to the more pleasing "rounded" version
export const generateRandomBlob = () => {
  const points = 8;
  const angleStep = (Math.PI * 2) / points;
  const pathPoints = [];

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    // Restored radius variance to be more pleasingly rounded but still organic
    const radius = 35 + Math.random() * 12;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    pathPoints.push({ x, y });
  }

  // Create smooth cubic bezier path
  let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 0; i < points; i++) {
    const p0 = pathPoints[i];
    const p1 = pathPoints[(i + 1) % points];
    const p2 = pathPoints[(i + 2) % points];
    
    const cp1x = p0.x + (p1.x - pathPoints[(i - 1 + points) % points].x) * 0.2;
    const cp1y = p0.y + (p1.y - pathPoints[(i - 1 + points) % points].y) * 0.2;
    const cp2x = p1.x - (p2.x - p0.x) * 0.2;
    const cp2y = p1.y - (p2.y - p0.y) * 0.2;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return d + " Z";
};
