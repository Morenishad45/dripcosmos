import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCT_DATA } from '../data/productData';
import { Eye, X } from 'lucide-react';
import { sound } from '../utils/audio';

export const StorySection: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  useEffect(() => {
    if (selectedChapter === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedChapter(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedChapter]);

  return (
    <section className="story-section-container">
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px auto' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.35em', color: 'var(--accent-gold)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
          NARRATIVE ARCHIVE • 04 CHAPTERS
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: 16 }}>
          THE VISION OF THE EAGLE
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, opacity: 0.85, fontStyle: 'italic' }}>
          "The Eagle does not seek permission, nor does it fear the unknown. Every beat of its wings is a declaration of courage, freedom, and relentless ambition."
        </p>
      </div>

      {/* 4-Card Editorial Grid */}
      <div className="story-grid-layout">
        {PRODUCT_DATA.storyChapters.map((chapter, idx) => (
          <div
            key={chapter.number}
            onClick={() => {
              sound.playClick();
              setSelectedChapter(idx);
            }}
            data-cursor="INSPECT"
            className="story-interactive-card"
          >
            {/* Story Artwork Image */}
            <div className="story-card-image-wrap">
              <img
                src={chapter.image}
                alt={chapter.title}
              />
              
              {/* Badge */}
              <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', color: 'var(--accent-gold)' }}>
                CHAPTER {chapter.number}
              </div>

              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye style={{ width: 14, height: 14, color: '#F5F3ED' }} />
              </div>
            </div>

            {/* Card Content Footer */}
            <div className="story-card-body">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                {chapter.subtitle}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: 8 }}>
                {chapter.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'rgba(212, 208, 197, 0.75)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {chapter.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Story Detail Modal */}
      {selectedChapter !== null &&
        createPortal(
          <div
            className="modal-backdrop"
            onClick={() => setSelectedChapter(null)}
          >
            <div
              className="glass-panel-elevated modal-dialog story-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedChapter(null)}
                className="story-modal-close-btn"
                aria-label="Close Story Chapter"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>

              {/* Modal Image */}
              <div className="story-modal-image-col">
                <img
                  src={PRODUCT_DATA.storyChapters[selectedChapter].image}
                  alt={PRODUCT_DATA.storyChapters[selectedChapter].title}
                  className="story-modal-img"
                />
              </div>

              {/* Modal Narrative Content */}
              <div className="story-modal-content-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--accent-gold)' }}>
                    CHAPTER {PRODUCT_DATA.storyChapters[selectedChapter].number} OF 04
                  </span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
                    {PRODUCT_DATA.storyChapters[selectedChapter].subtitle}
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: 16 }}>
                  {PRODUCT_DATA.storyChapters[selectedChapter].title}
                </h2>

                <div style={{ width: 48, height: 2, background: 'var(--accent-gold)', marginBottom: 20 }} />

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
                  {PRODUCT_DATA.storyChapters[selectedChapter].text}
                </p>

                <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                  <span>ANIMAL KINGDOM ARCHIVE</span>
                  <span style={{ color: 'var(--accent-gold)' }}>DRIP COSMOS</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
