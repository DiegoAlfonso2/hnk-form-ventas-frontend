import React from 'react';
import hnkLogoUrl from './HNK-logo.svg';

interface HnkLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string; // Kept for compatibility, though SVG asset now has HNK Blue built-in
}

export const HnkLogo: React.FC<HnkLogoProps> = ({
  width = 120,
  height,
  className = '',
  style = {}
}) => {
  // Proportional height based on new logo: 1022 / 1120 = ~0.9125
  const numericWidth = typeof width === 'number' ? width : parseFloat(String(width)) || 120;
  const propHeight = height || Math.round(numericWidth * 1022 / 1120);

  return (
    <img
      src={hnkLogoUrl}
      width={width}
      height={propHeight}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, objectFit: 'contain', ...style }}
      alt="HNK Logo"
    />
  );
};

export default HnkLogo;
