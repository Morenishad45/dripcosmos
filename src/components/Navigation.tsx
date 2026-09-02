import React from 'react';
import { Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavigationProps {
  isMuted: boolean;
  onToggleMute: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isMuted,
  onToggleMute,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="site-header">
      {/* Brand Monogram & Title */}
      <button
        className="brand-monogram-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="dc-badge-circle">
          <img src="/brand/logo_black.png" alt="Drip Cosmos Logo" />
        </div>
        <div>
          <span className="brand-title">DRIP COSMOS</span>
          <span className="brand-subtitle">DROP 01 / EAGLE</span>
        </div>
      </button>

      {/* Center Status Pill */}
      <div className="header-status-pill">
        <span className="pulse-dot" />
        <span className="status-text">ANIMAL KINGDOM • UNBOXING ACTIVE</span>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        {/* Audio Toggle Button */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="sound-toggle-btn"
          title={isMuted ? "Enable Ambient Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <>
              <VolumeX style={{ width: 14, height: 14, color: '#8A8882' }} />
              <span className="btn-label-text">SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 style={{ width: 14, height: 14, color: '#E5A93C' }} />
              <span className="btn-label-text" style={{ color: '#E5A93C' }}>SOUND ON</span>
            </>
          )}
        </button>

        {/* Shopping Bag Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCart();
          }}
          className="bag-btn"
        >
          <ShoppingBag style={{ width: 14, height: 14 }} />
          <span className="btn-label-text">BAG</span>
          {cartCount > 0 && (
            <span className="bag-count-pill">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};
