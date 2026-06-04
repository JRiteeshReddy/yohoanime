import React from 'react';

export const SkullIcon = ({ className, glow = false }: { className?: string; glow?: boolean }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    width="32" 
    height="32" 
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Afro base back shadows */}
    <circle cx="50" cy="50" r="30" fill="#141414" />
    
    {/* Afro circles */}
    <circle cx="50" cy="50" r="26" fill="#1a1a1a" />
    <circle cx="34" cy="42" r="15" fill="#1a1a1a" />
    <circle cx="66" cy="42" r="15" fill="#1a1a1a" />
    <circle cx="37" cy="62" r="13" fill="#1a1a1a" />
    <circle cx="63" cy="62" r="13" fill="#1a1a1a" />
    <circle cx="50" cy="30" r="16" fill="#1a1a1a" />
    
    {/* Skull Base */}
    <rect x="39" y="47" width="22" height="20" rx="5" fill="#FFFFFF" />
    <circle cx="50" cy="49" r="15" fill="#FFFFFF" />
    
    {/* Eyes */}
    <circle cx="43" cy="49" r="4" fill={glow ? "#FFA500" : "#0B0B0B"} className={glow ? "glow-eye" : ""} />
    <circle cx="57" cy="49" r="4" fill={glow ? "#FFA500" : "#0B0B0B"} className={glow ? "glow-eye" : ""} />
    
    {/* Nose (Upside-down heart / triangle) */}
    <path d="M50,53 L47,56.5 L53,56.5 Z" fill="#0B0B0B" />
    
    {/* Teeth */}
    <rect x="45" y="60" width="2" height="5" rx="1" fill="#0B0B0B" />
    <rect x="49" y="60" width="2" height="5" rx="1" fill="#0B0B0B" />
    <rect x="53" y="60" width="2" height="5" rx="1" fill="#0B0B0B" />
    
    {/* Top Hat */}
    {/* Hat brim */}
    <ellipse cx="50" cy="30" rx="20" ry="3" fill="#FFFFFF" />
    {/* Hat crown */}
    <path d="M41,30 L42,12 L58,12 L59,30 Z" fill="#FFFFFF" />
    {/* Hat Ribbon (Accent orange color) */}
    <path d="M41.4,28 L42,23 L58,23 L58.6,28 Z" fill="#FFA500" />
  </svg>
);
