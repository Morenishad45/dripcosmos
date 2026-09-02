import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCT_DATA } from '../data/productData';
import { Check, ShieldCheck, Sparkles, Box, Scissors, Truck, ShoppingBag, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProductPurchaseSectionProps {
  onAddToCart: (size: string) => void;
  isCartOpen: boolean;
  onCloseCart: () => void;
  cartItems: Array<{ size: string; quantity: number }>;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductPurchaseSection: React.FC<ProductPurchaseSectionProps> = ({
  onAddToCart,
  isCartOpen,
  onCloseCart,
  cartItems,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseCart();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, onCloseCart]);

  const handleAdd = () => {
    sound.playClick();
    onAddToCart(selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = totalQuantity * parseInt(PRODUCT_DATA.price);

  return (
    <section className="purchase-section-container">
      <div className="purchase-grid-layout">
        {/* Left Column: Garment Narrative & Technical Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(229, 169, 60, 0.15)', border: '1px solid rgba(229, 169, 60, 0.3)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--accent-gold)' }}>
                LIMITED EDITION • 001 / 500
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                AUTHENTIC ARCHIVE RELEASE
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '0.1em', color: '#F5F3ED', marginBottom: 16 }}>
              {PRODUCT_DATA.productName}
            </h2>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, opacity: 0.9 }}>
              Crafted from 280 GSM luxury combed organic cotton with custom drop-shoulder geometry. Each piece is delivered in a rigid magnetic presentation box with custom DC monogram tissue and 4 collector art story cards.
            </p>
          </div>

          {/* Garment Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Box style={{ width: 16, height: 16, color: 'var(--accent-gold)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#F5F3ED' }}>
                  COLLECTOR PACKAGING
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Includes matte black debossed collector box, patterned tissue paper & 4 narrative art prints.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Scissors style={{ width: 16, height: 16, color: 'var(--accent-gold)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#F5F3ED' }}>
                  BOXY OVERSIZED FIT
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Reinforced high-density rib collar, dropped shoulder seams, and authentic hand-numbered hem tag.
              </p>
            </div>
          </div>

          {/* Detailed Features List */}
          <div className="glass-panel-elevated" style={{ padding: 28 }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: 16 }}>
              PRODUCT SPECIFICATIONS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRODUCT_DATA.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <Check style={{ width: 16, height: 16, color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Checkout & Size Selection Card */}
        <div>
          <div className="glass-panel-elevated" style={{ padding: '36px 40px', position: 'sticky', top: 120 }}>
            {/* Price & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  PRICE (GLOBAL SHIPPING INCLUDED)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: '#F5F3ED' }}>
                  ${PRODUCT_DATA.price} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{PRODUCT_DATA.currency}</span>
                </span>
              </div>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                  IN STOCK
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: '#F5F3ED' }}>
                  SELECT SIZE (OVERSIZED FIT)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-gold)', textDecoration: 'underline', cursor: 'pointer' }}>
                  SIZE GUIDE
                </span>
              </div>

              <div className="size-selector-grid">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSize(size);
                      }}
                      className={`size-option-btn ${isSelected ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag CTA Button */}
            <button
              onClick={handleAdd}
              data-cursor="ADD"
              className="primary-add-to-bag-btn"
              style={{ marginBottom: 20 }}
            >
              {isAdded ? (
                <>
                  <Check style={{ width: 18, height: 18 }} />
                  <span>ADDED TO UNIVERSE BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag style={{ width: 18, height: 18 }} />
                  <span>ADD TO BAG — ${PRODUCT_DATA.price}</span>
                </>
              )}
            </button>

            {/* Reassurance Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck style={{ width: 14, height: 14, color: 'var(--text-secondary)' }} />
                <span>Complimentary Express Insured Worldwide Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck style={{ width: 14, height: 14, color: 'var(--text-secondary)' }} />
                <span>Verified Hand-Numbered Authenticity Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Bag Slide-Over Drawer */}
      {isCartOpen &&
        createPortal(
          <div
            className="modal-backdrop"
            style={{ justifyContent: 'flex-end', padding: 0 }}
            onClick={onCloseCart}
          >
            <div
              style={{ width: '100%', maxWidth: 440, height: '100%', background: '#0e0e0e', borderLeft: '1px solid rgba(255,255,255,0.15)', padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '-20px 0 50px rgba(0,0,0,0.8)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', padding: 2, background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(229, 169, 60, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src="/brand/logo_black.png" alt="Drip Cosmos" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 700, color: '#F5F3ED', letterSpacing: '0.1em', display: 'block' }}>
                        YOUR UNIVERSE BAG
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-gold)', letterSpacing: '0.15em' }}>
                        DRIP COSMOS OFFICIAL
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onCloseCart}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8882', cursor: 'pointer' }}
                  >
                    <X style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                {/* Items List */}
                {cartItems.length === 0 ? (
                  <div style={{ padding: '80px 0', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8A8882', letterSpacing: '0.2em' }}>
                      YOUR BAG IS CURRENTLY EMPTY
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(0,0,0,0.6)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                          <img src="/textures/shirt_front.png" alt="Shirt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 700, color: '#F5F3ED' }}>
                            DROP 01: EAGLE TEE
                          </h4>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8A8882' }}>
                            SIZE: {item.size} • QTY: {item.quantity}
                          </span>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-gold)', fontWeight: 700, marginTop: 4 }}>
                            ${parseInt(PRODUCT_DATA.price) * item.quantity} USD
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8A8882' }}>
                    <span>SUBTOTAL</span>
                    <span style={{ color: '#F5F3ED', fontWeight: 700 }}>${totalPrice} USD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8A8882' }}>
                    <span>SHIPPING</span>
                    <span style={{ color: '#34d399' }}>FREE WORLDWIDE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 15, color: '#F5F3ED', fontWeight: 700, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>TOTAL</span>
                    <span style={{ color: 'var(--accent-gold)' }}>${totalPrice} USD</span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      alert("Order reservation complete! Live checkout will connect to your merchant gateway.");
                    }}
                    className="primary-add-to-bag-btn"
                    style={{ marginTop: 8 }}
                  >
                    <Sparkles style={{ width: 16, height: 16 }} />
                    <span>SECURE CHECKOUT</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
