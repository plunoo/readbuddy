
import React from 'react';

interface RobotAvatarProps {
  expression: 'happy' | 'thinking' | 'talking' | 'idle' | 'excited' | 'confused' | 'celebrating' | 'listening';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ expression, size = 'md', className = '', animated = true }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Body */}
        <rect x="40" y="60" width="120" height="110" rx="30" fill={
          expression === 'celebrating' ? '#10B981' :
          expression === 'excited' ? '#F59E0B' :
          expression === 'confused' ? '#EF4444' :
          expression === 'happy' ? '#8B5CF6' :
          '#3B82F6'
        } stroke="#1E40AF" strokeWidth="4" className="transition-all duration-500" />
        <rect x="60" y="80" width="80" height="70" rx="15" fill={
          expression === 'celebrating' ? '#D1FAE5' :
          expression === 'excited' ? '#FEF3C7' :
          expression === 'confused' ? '#FEE2E2' :
          expression === 'happy' ? '#EDE9FE' :
          '#DBEAFE'
        } className="transition-all duration-500" />
        
        {/* Head */}
        <g className={`
          ${animated && expression === 'idle' ? 'animate-bounce' : ''} 
          ${expression === 'celebrating' ? 'animate-spin' : ''} 
          ${expression === 'excited' ? 'animate-bounce' : ''}
          ${expression === 'happy' ? 'animate-pulse' : ''}
        `} style={{ 
          animationDuration: expression === 'celebrating' ? '0.5s' : expression === 'excited' ? '0.6s' : '3s', 
          transformOrigin: '100px 50px' 
        }}>
          <rect x="50" y="10" width="100" height="80" rx="20" fill="#60A5FA" stroke="#1E40AF" strokeWidth="4" />
          
          {/* Eyes */}
          <circle cx="80" cy="45" r="10" fill="white" />
          <circle cx="120" cy="45" r="10" fill="white" />
          
          {/* Eye pupils with expressions */}
          {expression === 'confused' ? (
            <>
              <circle cx="75" cy="42" r="4" fill="#1E40AF" />
              <circle cx="125" cy="48" r="4" fill="#1E40AF" />
            </>
          ) : expression === 'excited' ? (
            <>
              <polygon points="80,40 75,50 85,50" fill="#1E40AF" className="animate-bounce" />
              <polygon points="120,40 115,50 125,50" fill="#1E40AF" className="animate-bounce" />
            </>
          ) : expression === 'listening' ? (
            <>
              <circle cx="80" cy="45" r="6" fill="#1E40AF" className="animate-pulse" />
              <circle cx="120" cy="45" r="6" fill="#1E40AF" className="animate-pulse" />
            </>
          ) : (
            <>
              <circle cx="80" cy="45" r="4" fill="#1E40AF" className={expression === 'happy' || expression === 'celebrating' ? 'animate-ping' : ''} />
              <circle cx="120" cy="45" r="4" fill="#1E40AF" className={expression === 'happy' || expression === 'celebrating' ? 'animate-ping' : ''} />
            </>
          )}
          
          {/* Mouth expressions */}
          {expression === 'talking' ? (
            <ellipse cx="100" cy="70" rx="15" ry="10" fill="#1E40AF" className="animate-pulse" />
          ) : expression === 'happy' || expression === 'celebrating' ? (
            <path d="M 80 70 Q 100 85 120 70" stroke="#1E40AF" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : expression === 'excited' ? (
            <circle cx="100" cy="72" r="8" fill="#1E40AF" />
          ) : expression === 'confused' ? (
            <path d="M 85 70 Q 100 75 115 70" stroke="#1E40AF" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : expression === 'thinking' ? (
            <ellipse cx="100" cy="70" rx="10" ry="3" fill="#1E40AF" />
          ) : expression === 'listening' ? (
            <ellipse cx="100" cy="70" rx="12" ry="6" fill="none" stroke="#1E40AF" strokeWidth="3" className="animate-pulse" />
          ) : (
            <line x1="85" y1="70" x2="115" y2="70" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" />
          )}
          
          {/* Thinking bubbles */}
          {expression === 'thinking' && (
            <g className="animate-bounce" style={{ animationDelay: '0.5s' }}>
              <circle cx="130" cy="25" r="3" fill="#93C5FD" opacity="0.7" />
              <circle cx="140" cy="15" r="5" fill="#93C5FD" opacity="0.5" />
              <circle cx="155" cy="10" r="7" fill="#93C5FD" opacity="0.3" />
            </g>
          )}
          
          {/* Confusion marks */}
          {expression === 'confused' && (
            <g className="animate-pulse">
              <text x="130" y="35" fontSize="20" fill="#F87171">?</text>
              <text x="140" y="25" fontSize="16" fill="#F87171" opacity="0.7">?</text>
            </g>
          )}
        </g>
        
        {/* Antennas */}
        <line x1="100" y1="10" x2="100" y2="0" stroke="#1E40AF" strokeWidth="4" />
        <circle cx="100" cy="0" r="5" fill={expression === 'listening' ? '#10B981' : expression === 'excited' || expression === 'celebrating' ? '#F59E0B' : '#F87171'} className={expression === 'listening' || expression === 'excited' ? 'animate-ping' : 'animate-pulse'} />
        
        {/* Celebration effects */}
        {expression === 'celebrating' && (
          <g>
            <text x="70" y="35" fontSize="20" className="animate-bounce">🎉</text>
            <text x="130" y="25" fontSize="20" className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</text>
            <text x="60" y="60" fontSize="16" className="animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</text>
            <text x="140" y="70" fontSize="16" className="animate-bounce" style={{ animationDelay: '0.6s' }}>🌟</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default RobotAvatar;
