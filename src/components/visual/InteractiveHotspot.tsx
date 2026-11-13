import React from 'react';
import './InteractiveHotspot.css';

type Props = {
  x: number; // 0 to 1 relative position
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  label?: string;
};

const InteractiveHotspot: React.FC<Props> = ({ x, y, width, height, onClick, label }) => {
  const style = {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  } as React.CSSProperties;

  return (
    <button
      className="hotspot"
      style={style}
      onClick={onClick}
      aria-label={label ?? 'hotspot'}
    >
      {/* visually hidden label */}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default InteractiveHotspot;

