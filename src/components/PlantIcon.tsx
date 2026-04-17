import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

export const PlantIcon: React.FC<Props> = ({ size = 24, className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Ground Mound - Flat base with a distinctive raised curve */}
    <path d="M2 21h20" />
    <path d="M5 21c0-3 3-5 7-5s7 2 7 5" />
    
    {/* Short thick stem */}
    <path d="M12 16v-2" />
    
    {/* Large upper leaves with sharp tips */}
    {/* Right Leaf */}
    <path d="M12 14c0-4 3-9 10-9c0 7-5 9-10 9z" />
    {/* Left Leaf */}
    <path d="M12 14c0-4-3-9-10-9c0 7 5 9 10 9z" />
  </svg>
);
