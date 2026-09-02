import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface LoadingScreenProps {
  onEnter: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 10;
        return Math.min(100, prev + increment);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    sound.playClick();
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  return (
    <div className={`loading-screen ${isExiting ? 'exiting' : ''}`}>
      {/* Top Meta Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: '#8A8882' }}>
          DRIP COSMOS ARCHIVE
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: '#8A8882' }}>
          LIMITED 500 UNITS
        </span>
      </div>

      {/* Center Cinematic Entry */}
      <div className="loading-content">
        {/* Official Brand Logo Emblem */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', padding: 4, background: 'rgba(18, 18, 18, 0.85)', border: '1px solid rgba(229, 169, 60, 0.4)', boxShadow: '0 0 30px rgba(229, 169, 60, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/brand/logo_black.png" alt="Drip Cosmos Official Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 13, letterSpacing: '0.35em', color: '#8A8882', marginBottom: 12, textTransform: 'uppercase' }}>
          ANIMAL KINGDOM — DROP 01
        </h2>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '0.2em', color: '#F5F3ED', marginBottom: 20 }}>
          THE EAGLE
        </h1>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'rgba(212, 208, 197, 0.8)', letterSpacing: '0.05em', maxWidth: 460, marginBottom: 40, fontStyle: 'italic', lineHeight: 1.6 }}>
          "YOU DON'T FOLLOW TRENDS. YOU SET YOUR ORBIT."
        </p>

        {isLoaded ? (
          <button
            onClick={handleStart}
            data-cursor="ENTER"
            className="enter-universe-btn"
          >
            ENTER THE UNIVERSE
          </button>
        ) : (
          <div className="progress-bar-container">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: '#8A8882' }}>
              <span>CALIBRATING 3D ENVIRONMENT</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: '#8A8882' }}>
        <span>01 / 06 REVEALED</span>
        <span>MANIFESTED NOT MANUFACTURED</span>
      </div>
    </div>
  );
};
