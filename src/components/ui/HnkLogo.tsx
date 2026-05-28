import React from 'react';

interface HnkLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const HnkLogo: React.FC<HnkLogoProps> = ({
  width = 120,
  height = 110,
  className = '',
  style = {},
  color = '#003E93' // HNK Royal Blue
}) => {
  return (
    <svg
      viewBox="0 0 320 280"
      width={width}
      height={height}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Background Leaves / Petals (Rose-like background layers) */}
        {/* Top-most background layer */}
        <path d="M 120,65 C 100,25 150,15 160,25 C 170,15 220,25 200,65" strokeWidth="6" />
        <path d="M 160,25 Q 160,50 160,70" strokeWidth="4" />
        
        {/* Left background layer */}
        <path d="M 115,70 C 65,55 55,100 70,120 C 50,140 60,175 100,165" strokeWidth="6" />
        <path d="M 70,120 Q 95,115 115,115" strokeWidth="4" />

        {/* Right background layer */}
        <path d="M 205,70 C 255,55 265,100 250,120 C 270,140 260,175 220,165" strokeWidth="6" />
        <path d="M 250,120 Q 225,115 205,115" strokeWidth="4" />

        {/* Outer backing circle-ish folds */}
        <path d="M 98,165 C 100,205 140,215 160,205 C 180,215 220,205 222,165" strokeWidth="6" />
        
        {/* Foreground Petals (Lily-like 3-petal design in center) */}
        {/* Left Petal */}
        <path 
          d="M 160,135 C 145,105 110,95 95,115 C 90,130 115,160 145,150 Z" 
          fill="none" 
          strokeWidth="7" 
        />
        {/* Left Petal Center Vein */}
        <path d="M 103,121 C 115,123 130,130 142,139" strokeWidth="4" />

        {/* Right Petal */}
        <path 
          d="M 160,135 C 175,105 210,95 225,115 C 230,130 205,160 175,150 Z" 
          fill="none" 
          strokeWidth="7" 
        />
        {/* Right Petal Center Vein */}
        <path d="M 217,121 C 205,123 190,130 178,139" strokeWidth="4" />

        {/* Center Bottom Petal */}
        <path 
          d="M 160,135 C 145,145 140,175 160,185 C 180,175 175,145 160,135 Z" 
          fill="none" 
          strokeWidth="7" 
        />
        {/* Center Bottom Petal Vein */}
        <path d="M 160,145 L 160,175" strokeWidth="4" />

        {/* Center Pistils (3 small circles at the junction) */}
        <circle cx="152" cy="142" r="5" fill={color} />
        <circle cx="168" cy="142" r="5" fill={color} />
        <circle cx="160" cy="151" r="5" fill={color} />
      </g>

      {/* Typography: "HNK" */}
      <text
        x="160"
        y="262"
        textAnchor="middle"
        fontFamily="'Fredoka', 'Arial Black', sans-serif"
        fontWeight="800"
        fontSize="78"
        fill={color}
        letterSpacing="2"
      >
        HNK
      </text>
    </svg>
  );
};
export default HnkLogo;
