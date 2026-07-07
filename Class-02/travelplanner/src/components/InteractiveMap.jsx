import React, { useEffect, useState } from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export default function InteractiveMap({ destination, currentDayIndex, routeStops, transportModes }) {
  const [carPos, setCarPos] = useState({ x: 50, y: 150 });
  const [isMoving, setIsMoving] = useState(false);

  // Stop coordinates based on destination type for our visual SVG map (size 500x300)
  const mapCoordinates = {
    coastal: [
      { name: 'Sunset Harbor', x: 60, y: 220 },
      { name: 'Surf Bay', x: 150, y: 120 },
      { name: 'Ocean Cliffs', x: 260, y: 200 },
      { name: 'Lighthouse Point', x: 380, y: 80 },
      { name: 'Sandy Shores', x: 440, y: 240 }
    ],
    highland: [
      { name: 'Valley Station', x: 50, y: 240 },
      { name: 'Pine Crest Hikes', x: 140, y: 180 },
      { name: 'Glacier Ridge', x: 230, y: 110 },
      { name: 'Lake Mirror', x: 350, y: 160 },
      { name: 'Peak Summit', x: 450, y: 80 }
    ],
    heritage: [
      { name: 'Old Town Square', x: 70, y: 100 },
      { name: 'Castle Ruins', x: 170, y: 220 },
      { name: 'Cathedral City', x: 280, y: 100 },
      { name: 'Stone Bridge', x: 360, y: 200 },
      { name: 'Royal Palace', x: 430, y: 130 }
    ]
  };

  const activeCoords = mapCoordinates[destination] || mapCoordinates.coastal;
  const activeStop = activeCoords[currentDayIndex] || activeCoords[0];

  useEffect(() => {
    setIsMoving(true);
    const timer = setTimeout(() => {
      setCarPos({ x: activeStop.x, y: activeStop.y });
      setIsMoving(false);
    }, 800); // Animation duration
    return () => clearTimeout(timer);
  }, [currentDayIndex, destination]);

  // Generate SVG path string connecting all nodes
  const pathString = activeCoords.reduce((acc, coord, idx) => {
    return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
  }, '');

  return (
    <div style={styles.container} className="glass">
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Compass size={18} color="#00f2fe" />
          <h4 style={styles.title}>Real-Time Route Map</h4>
        </div>
        <span style={styles.badge}>
          {destination.toUpperCase()} ROUTE
        </span>
      </div>

      <div style={styles.mapArea}>
        <svg viewBox="0 0 500 300" style={styles.svg}>
          {/* Gradients */}
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#f857a6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Dotted Connection Path */}
          <path 
            d={pathString} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeWidth="3" 
            strokeDasharray="6,4"
          />

          {/* Active Highlighted Animated Path */}
          <path 
            d={pathString} 
            fill="none" 
            stroke="url(#routeGrad)" 
            strokeWidth="3.5" 
            style={styles.animatedPath}
            filter="url(#glow)"
          />

          {/* Connections Line Drawing */}
          {activeCoords.map((coord, idx) => {
            if (idx === activeCoords.length - 1) return null;
            const nextCoord = activeCoords[idx + 1];
            return (
              <g key={`leg-${idx}`}>
                {/* Visual Label showing Mode */}
                <text
                  x={(coord.x + nextCoord.x) / 2}
                  y={(coord.y + nextCoord.y) / 2 - 10}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8"
                  textAnchor="middle"
                  style={styles.modeLabel}
                >
                  {transportModes[idx] === 'coach' ? '🚌 Coach' : '🚗 SUV'}
                </text>
              </g>
            );
          })}

          {/* Destination Nodes */}
          {activeCoords.map((coord, idx) => {
            const isActive = idx === currentDayIndex;
            const isCompleted = idx < currentDayIndex;
            return (
              <g key={idx} style={{ cursor: 'pointer' }}>
                {/* Node Ring */}
                <circle 
                  cx={coord.x} 
                  cy={coord.y} 
                  r={isActive ? 12 : 8} 
                  fill={isActive ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.8)'}
                  stroke={isActive ? '#00f2fe' : isCompleted ? '#ff8c00' : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={isActive ? styles.pulsingNode : {}}
                />
                
                {/* Node Center Dot */}
                <circle 
                  cx={coord.x} 
                  cy={coord.y} 
                  r={4} 
                  fill={isActive ? '#00f2fe' : isCompleted ? '#ff8c00' : 'rgba(255, 255, 255, 0.4)'} 
                />

                {/* Node Label */}
                <text 
                  x={coord.x} 
                  y={coord.y - 18} 
                  fill={isActive ? '#ffffff' : 'var(--text-secondary)'}
                  fontSize="9.5"
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                  style={styles.nodeText}
                >
                  {coord.name}
                </text>

                {/* Day Marker */}
                <text
                  x={coord.x}
                  y={coord.y + 16}
                  fill="var(--text-muted)"
                  fontSize="8"
                  textAnchor="middle"
                >
                  Day {idx + 1}
                </text>
              </g>
            );
          })}

          {/* Animated Transit vehicle representing movement */}
          <g 
            transform={`translate(${carPos.x - 8}, ${carPos.y - 8})`}
            style={{
              transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              opacity: isMoving ? 0.9 : 1
            }}
          >
            {/* Pulsing Aura for active transit */}
            <circle cx="8" cy="8" r="10" fill="rgba(0, 242, 254, 0.3)" filter="url(#glow)"/>
            {/* The icon */}
            <rect x="3" y="3" width="10" height="10" rx="2" fill={transportModes[currentDayIndex] === 'coach' ? '#00f2fe' : '#ff8c00'} stroke="#ffffff" strokeWidth="1" />
            <circle cx="5" cy="11" r="1.5" fill="#000000" />
            <circle cx="11" cy="11" r="1.5" fill="#000000" />
          </g>
        </svg>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerRow}>
          <ShieldCheck size={14} color="#22c55e" />
          <span style={styles.footerText}>All transits are backed by our 24/7 support & vehicle tracker.</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.1rem',
    color: '#ffffff',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#f857a6',
    letterSpacing: '0.05em',
  },
  mapArea: {
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    overflow: 'hidden',
    padding: '0.5rem',
  },
  svg: {
    width: '100%',
    height: 'auto',
  },
  animatedPath: {
    strokeDasharray: '500',
    strokeDashoffset: '500',
    animation: 'dash 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },
  pulsingNode: {
    animation: 'pulse-cyan 2s infinite ease-in-out',
  },
  nodeText: {
    pointerEvents: 'none',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
  },
  modeLabel: {
    pointerEvents: 'none',
    fontFamily: 'var(--font-body)',
  },
  footer: {
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '0.75rem',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  footerText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: '1.3',
  },
};
