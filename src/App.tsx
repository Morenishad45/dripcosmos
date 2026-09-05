import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { Experience3D } from './scenes/Experience3D';
import { Navigation } from './components/Navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { StorySection } from './components/StorySection';
import { AnimalKingdomSection } from './components/AnimalKingdomSection';
import { ProductPurchaseSection } from './components/ProductPurchaseSection';
import { sound } from './utils/audio';
import { Rotate3D, ChevronDown, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dragRotationY, setDragRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ size: string; quantity: number }>>([]);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isTouchDragging = useRef(false);
  const currentDragY = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const lenis = new Lenis({
      duration: isMobileDevice ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    const onScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
      setScrollProgress(progress);
    };

    lenis.on('scroll', onScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle Drag to Rotate 360° with Touch-Safe Distinction
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('.glass-panel-elevated') ||
      target.closest('.story-interactive-card') ||
      target.closest('.product-preview-box') ||
      target.closest('.available-drops-pane')
    ) return;

    // Only activate 3D interaction in the unboxing zone
    if (scrollProgress > 0.85) return;

    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    currentDragY.current = dragRotationY;
    isTouchDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;

    // If on touch device, distinguish horizontal rotate vs vertical scroll intent
    if (e.pointerType === 'touch') {
      if (!isTouchDragging.current) {
        if (Math.abs(deltaY) > Math.abs(deltaX) + 4) {
          // Intent is vertical page scrolling; cancel 3D drag so scroll flows freely
          setIsDragging(false);
          return;
        }
        if (Math.abs(deltaX) > 8) {
          isTouchDragging.current = true;
        }
      }
    }

    const sensitivity = 0.008;
    setDragRotationY(currentDragY.current + deltaX * sensitivity);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    isTouchDragging.current = false;
  };

  // Add To Cart Handler
  const handleAddToCart = (size: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Unboxing Step Stage Info
  const getStageInfo = useCallback(() => {
    if (scrollProgress < 0.18) {
      return {
        tag: 'STAGE 01 / 04',
        title: 'THE SACRED CARRIER',
        sub: 'Closed Matte Presentation Box • Scroll down to begin unboxing',
      };
    } else if (scrollProgress < 0.45) {
      return {
        tag: 'STAGE 02 / 04',
        title: 'BREAKING THE SEAL',
        sub: 'Lid Pivots Back • "YOU DON\'T FOLLOW TRENDS. YOU SET YOUR ORBIT."',
      };
    } else if (scrollProgress < 0.70) {
      return {
        tag: 'STAGE 03 / 04',
        title: 'TRANSLUCENT VEIL',
        sub: 'DC Monogram Patterned Tissue Paper Unfolds',
      };
    } else {
      return {
        tag: 'STAGE 04 / 04',
        title: 'THE ANIMAL KINGDOM',
        sub: 'Drop 01 (Eagle) Revealed • Explore the Sacred Archetypes Below',
      };
    }
  }, [scrollProgress]);

  const currentStage = getStageInfo();

  return (
    <main
      style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#080808', color: '#F5F3ED', userSelect: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <CustomCursor />
      <div className="grain-overlay" />

      {/* Cinematic Initial Loader */}
      {!hasEntered && (
        <LoadingScreen
          onEnter={() => {
            setHasEntered(true);
            if (isMuted) {
              handleToggleMute();
            }
          }}
        />
      )}

      {/* Luxury Navigation Header */}
      <Navigation
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3D Fixed Canvas Background Scene */}
      <Experience3D
        scrollProgress={scrollProgress}
        dragRotationY={dragRotationY}
        isUserInteracting={isDragging}
      />

      {/* Dynamic Black Gradient Transition Backdrop (in front of 3D canvas, behind UI components) */}
      <div
        className="black-gradient-backdrop"
        style={{
          opacity: Math.min(1, Math.max(0, (scrollProgress - 0.26) / 0.22)),
        }}
      />

      {/* FLOATING UNBOXING HUD OVERLAY (Smoothly fades out during catalog transition) */}
      <div
        className="hud-stage-card glass-panel"
        style={{
          opacity: Math.max(0, Math.min(1, (0.76 - scrollProgress) / 0.08)),
          pointerEvents: scrollProgress > 0.72 ? 'none' : undefined,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="pulse-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            {currentStage.tag}
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 700, color: '#F5F3ED', letterSpacing: '0.08em', marginBottom: 4 }}>
          {currentStage.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {currentStage.sub}
        </p>
      </div>

      {/* Right Progress Meter HUD (Smoothly fades out during catalog transition) */}
      <div
        className="hud-progress-meter"
        style={{
          opacity: Math.max(0, Math.min(1, (0.76 - scrollProgress) / 0.08)),
          pointerEvents: scrollProgress > 0.72 ? 'none' : undefined,
          transition: 'opacity 0.25s ease',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
          {Math.round(scrollProgress * 100)}%
        </span>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-muted)', writingMode: 'vertical-lr' }}>
          UNBOXING
        </span>
      </div>

      {/* 360 Drag Prompt when near hero */}
      {scrollProgress > 0.82 && (
        <div className="drag-rotate-prompt">
          <Rotate3D style={{ width: 16, height: 16, color: 'var(--accent-gold)' }} />
          <span>DRAG TO ROTATE 360°</span>
        </div>
      )}

      {/* SCROLLABLE VIRTUAL CONTAINER */}
      <div className="scroll-flow-container">
        {/* Section 1: Hero / Closed Box */}
        <section className="hero-scroll-section">
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em', color: 'var(--accent-gold)', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
              COLLECTOR'S EDITION • DROP 01
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 7vw, 84px)', fontWeight: 700, letterSpacing: '0.2em', color: '#F5F3ED', marginBottom: 16 }}>
              DRIP COSMOS
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px, 2vw, 16px)', color: 'rgba(212, 208, 197, 0.75)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300 }}>
              "MANIFESTED NOT MANUFACTURED."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: '#8A8882', textTransform: 'uppercase' }}>
              SCROLL DOWN TO UNBOX
            </span>
            <ChevronDown style={{ width: 18, height: 18, color: 'var(--accent-gold)' }} />
          </div>
        </section>

        {/* Section 2: Box Lid Opening Scroll Pacing */}
        <section className="unboxing-step-section" aria-hidden="true" />

        {/* Section 3: Tissue Paper Reveal Scroll Pacing */}
        <section className="unboxing-step-section" aria-hidden="true" />

        {/* Editorial Lore, Animal Kingdom Constellation & Commerce Checkout */}
        <div className="editorial-sections-wrapper">
          <StorySection />
          <AnimalKingdomSection />
          <ProductPurchaseSection
            onAddToCart={handleAddToCart}
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
            cartItems={cartItems}
          />
        </div>

        {/* Minimal Footer */}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <div className="site-footer-logo">
                <img src="/brand/logo_black.png" alt="Drip Cosmos Official Logo" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="footer-brand-title">
                  DRIP COSMOS
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8A8882' }}>/</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8A8882', letterSpacing: '0.15em' }}>ANIMAL KINGDOM</span>
              </div>
            </div>

            <p className="site-footer-copyright">
              © {new Date().getFullYear()} DRIP COSMOS. ALL RIGHTS RESERVED. MANIFESTED NOT MANUFACTURED.
            </p>

            <div className="site-footer-links">
              <span>TERMS</span>
              <span>AUTHENTICITY</span>
              <span>ORBIT SUPPORT</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default App;
