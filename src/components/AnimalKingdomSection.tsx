import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ANIMAL_KINGDOM_DROPS, AnimalDrop } from '../data/productData';
import { Lock, ArrowRight, Sparkles, Maximize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

const EAGLE_GALLERY = [
  { id: 'front', label: 'Front View', image: '/textures/shirt_front_photo.jpg' },
  { id: 'back', label: 'Back Eagle Art', image: '/textures/shirt_back_photo.jpg' },
  { id: 'box', label: 'Packaging Set', image: '/textures/box_set_real.jpg' },
  { id: 'art', label: 'The Rise Mural', image: '/textures/story_the_rise.png' },
];

export const AnimalKingdomSection: React.FC = () => {
  const [selectedDrop, setSelectedDrop] = useState<AnimalDrop>(ANIMAL_KINGDOM_DROPS[0]);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [isMagnified, setIsMagnified] = useState<boolean>(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const isEagle = selectedDrop.id === '01';

  // Keyboard navigation & body scroll lock for zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;

    // Prevent background scrolling while zoom lightbox is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setIsMagnified(false);
      } else if (e.key === 'ArrowLeft') {
        sound.playClick();
        setActiveGalleryIdx((prev) => (prev > 0 ? prev - 1 : EAGLE_GALLERY.length - 1));
      } else if (e.key === 'ArrowRight') {
        sound.playClick();
        setActiveGalleryIdx((prev) => (prev < EAGLE_GALLERY.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnified) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMagnified) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleNextImage = () => {
    sound.playClick();
    setActiveGalleryIdx((prev) => (prev < EAGLE_GALLERY.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = () => {
    sound.playClick();
    setActiveGalleryIdx((prev) => (prev > 0 ? prev - 1 : EAGLE_GALLERY.length - 1));
  };

  return (
    <section className="animal-kingdom-container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px auto' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.35em', color: 'var(--accent-gold)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
          SIX SACRED ARCHETYPES
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: 16 }}>
          THE ANIMAL KINGDOM
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, opacity: 0.85 }}>
          Six animal totems represent six distinct mindset orbits. Drop 01 (Eagle) is now revealed. Select a drop to explore the archetype.
        </p>
      </div>

      {/* Main Split Layout: Left (Photos of Product Selected) | Right (Available Animal Drops 2x3 Grid) */}
      <div className="animal-split-wrapper">
        {/* LEFT COLUMN: Photos of Selected Product */}
        <div className="glass-panel-elevated product-preview-box">
          <div className="preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="pulse-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent-gold)' }}>
                DROP {selectedDrop.number} • {selectedDrop.status}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {selectedDrop.name} ARCHETYPE
            </span>
          </div>

          {/* Main Large Image Display */}
          <div className="preview-image-stage">
            {isEagle ? (
              <>
                <img
                  key={EAGLE_GALLERY[activeGalleryIdx].image}
                  src={EAGLE_GALLERY[activeGalleryIdx].image}
                  alt={EAGLE_GALLERY[activeGalleryIdx].label}
                  className="stage-main-img"
                  onClick={() => {
                    sound.playClick();
                    setIsZoomOpen(true);
                  }}
                  style={{ cursor: 'zoom-in' }}
                />

                {/* Only-Icon Zoom Button in Top Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setIsZoomOpen(true);
                  }}
                  className="stage-zoom-btn"
                  title="Zoom High-Resolution Photo"
                  aria-label="Zoom Photo"
                >
                  <Maximize2 style={{ width: 15, height: 15 }} />
                </button>
              </>
            ) : (
              <div className="locked-drop-stage">
                <div className="locked-icon-bubble">
                  <Lock style={{ width: 36, height: 36, color: 'var(--accent-gold)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: '#F5F3ED', marginTop: 20 }}>
                  {selectedDrop.name} — {selectedDrop.subtitle}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: 8 }}>
                  CELESTIAL DROP LOCKED • ORBIT IN CALIBRATION
                </p>
              </div>
            )}

            {/* Label overlay on active image */}
            {isEagle && (
              <div className="stage-overlay-tag">
                <span>{EAGLE_GALLERY[activeGalleryIdx].label}</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row for Eagle */}
          {isEagle ? (
            <div className="gallery-thumbs-row">
              {EAGLE_GALLERY.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveGalleryIdx(idx);
                  }}
                  className={`gallery-thumb-btn ${activeGalleryIdx === idx ? 'active' : ''}`}
                >
                  <img src={item.image} alt={item.label} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.4)', borderRadius: 14, textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{selectedDrop.philosophy}"
              </span>
            </div>
          )}

          {/* Philosophy and Traits Footer */}
          <div className="preview-footer-details">
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: '#F5F3ED', marginBottom: 4 }}>
                {selectedDrop.name} — {selectedDrop.subtitle}
              </h4>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{selectedDrop.philosophy}"
              </p>
            </div>

            {isEagle && (
              <button
                onClick={() => {
                  sound.playClick();
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="bag-btn"
                style={{ padding: '12px 24px', fontSize: 11, letterSpacing: '0.15em', flexShrink: 0 }}
              >
                <span>ACQUIRE DROP 01</span>
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Available Animal Drops (3x2 Grid of 6 cards) */}
        <div className="available-drops-pane">
          <div className="pane-title-row">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.25em', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
              AVAILABLE ANIMAL DROPS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
              06 ARCHETYPES
            </span>
          </div>

          <div className="drops-grid-3x2">
            {ANIMAL_KINGDOM_DROPS.map((drop) => {
              const isSelected = selectedDrop.id === drop.id;
              const isAvailable = drop.status === 'AVAILABLE';

              return (
                <div
                  key={drop.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedDrop(drop);
                  }}
                  data-cursor={isAvailable ? "ORBIT" : "LOCKED"}
                  className={`glass-panel drop-card-item ${isSelected ? 'selected' : ''}`}
                >
                  {/* Top Row: Number & Status Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--accent-gold)' : '#F5F3ED' }}>
                      {drop.number}
                    </span>
                    {isAvailable ? (
                      <span className="pulse-dot" />
                    ) : (
                      <Lock style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
                    )}
                  </div>

                  {/* Center Name & Status */}
                  <div style={{ margin: 'auto 0', padding: '12px 0' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', color: isSelected ? '#FFFFFF' : '#E8E5DF' }}>
                      {drop.name}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: isAvailable ? 'var(--accent-gold)' : 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                      {drop.status}
                    </span>
                  </div>

                  {/* Bottom Subtitle / Archetype */}
                  <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(212,208,197,0.6)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drop.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Archetype Lore Summary */}
          <div className="glass-panel" style={{ padding: '20px 24px', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles style={{ width: 14, height: 14, color: 'var(--accent-gold)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)' }}>
                {selectedDrop.mindset}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedDrop.traits.map((t, idx) => (
                <span
                  key={idx}
                  style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Lightbox Photo Zoom Popup */}
      {isZoomOpen &&
        createPortal(
          <div
            className="product-zoom-overlay"
            onClick={() => {
              setIsZoomOpen(false);
              setIsMagnified(false);
            }}
          >
            {/* Top Header Bar */}
            <div
              className="product-zoom-header"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', padding: 2, background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(229, 169, 60, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src="/brand/logo_black.png" alt="Drip Cosmos" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent-gold)', padding: '4px 10px', borderRadius: 999, background: 'rgba(229, 169, 60, 0.15)', border: '1px solid rgba(229, 169, 60, 0.3)' }}>
                  DROP 01 • HIGH-RES ARCHIVE
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#F5F3ED' }}>
                  {EAGLE_GALLERY[activeGalleryIdx].label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Toggle 2.2x Magnifier Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMagnified(!isMagnified);
                  }}
                  className="product-zoom-ctrl-btn"
                  title="Toggle Zoom Magnification"
                >
                  {isMagnified ? (
                    <>
                      <ZoomOut style={{ width: 14, height: 14, color: 'var(--accent-gold)' }} />
                      <span>1.0X VIEW</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn style={{ width: 14, height: 14, color: 'var(--accent-gold)' }} />
                      <span>2.2X ZOOM</span>
                    </>
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsZoomOpen(false);
                    setIsMagnified(false);
                  }}
                  className="product-zoom-ctrl-btn"
                  style={{ width: 36, height: 36, padding: 0, justifyContent: 'center', borderRadius: '50%' }}
                  title="Close Modal (Esc)"
                  aria-label="Close Modal"
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>

            {/* Center Image Canvas Viewport */}
            <div
              className="product-zoom-canvas-wrap"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsZoomOpen(false);
                  setIsMagnified(false);
                }
              }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Previous Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="product-zoom-nav-btn prev"
                title="Previous Photo (Left Arrow)"
                aria-label="Previous Photo"
              >
                <ChevronLeft style={{ width: 22, height: 22 }} />
              </button>

              {/* Image Stage Container */}
              <div
                className="product-zoom-img-container"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setIsMagnified(!isMagnified);
                }}
                style={{
                  cursor: isMagnified ? 'zoom-out' : 'zoom-in',
                }}
              >
                <img
                  key={EAGLE_GALLERY[activeGalleryIdx].image}
                  src={EAGLE_GALLERY[activeGalleryIdx].image}
                  alt={EAGLE_GALLERY[activeGalleryIdx].label}
                  className="product-zoom-image"
                  style={{
                    transform: isMagnified ? 'scale(2.2)' : 'scale(1)',
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transition: isMagnified ? 'transform 0.15s ease-out' : 'transform 0.3s ease',
                  }}
                />
              </div>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="product-zoom-nav-btn next"
                title="Next Photo (Right Arrow)"
                aria-label="Next Photo"
              >
                <ChevronRight style={{ width: 22, height: 22 }} />
              </button>
            </div>

            {/* Bottom Footer Thumbnail Bar & Helper */}
            <div
              className="product-zoom-footer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="product-zoom-thumbnails">
                {EAGLE_GALLERY.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveGalleryIdx(idx);
                    }}
                    className={`product-zoom-thumb-item ${activeGalleryIdx === idx ? 'active' : ''}`}
                    title={item.label}
                  >
                    <img src={item.image} alt={item.label} />
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                  {activeGalleryIdx + 1} OF {EAGLE_GALLERY.length} • {isMagnified ? 'DRAG / SWIPE TO PAN FABRIC • TAP TO RESET' : 'CLICK OR TAP PHOTO TO MAGNIFY 2.2X • ESC TO CLOSE'}
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
