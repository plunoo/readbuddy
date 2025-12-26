import React, { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  show: boolean;
  onComplete?: () => void;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: ['🎉', '✨', '⭐', '🌟', '🎊', '💫'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-4xl animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '1.5s',
            transform: `translate(-50%, -50%)`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      {/* Success message */}
      {show && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-green-500 text-white text-3xl font-black px-8 py-4 rounded-full shadow-2xl animate-pulse">
            🎉 AMAZING! 🎉
          </div>
        </div>
      )}
      
      {/* Glowing overlay */}
      {show && (
        <div className="absolute inset-0 bg-yellow-200/20 animate-ping" style={{ animationDuration: '0.8s' }} />
      )}
    </div>
  );
};

export default CelebrationEffect;