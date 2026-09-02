import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor]');
      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="cursor-star hidden md:flex items-center justify-center pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {cursorText ? (
        <div className="bg-[#F5F3ED] text-[#080808] font-mono text-[10px] tracking-widest font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200">
          <span>{cursorText}</span>
        </div>
      ) : isHovered ? (
        <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 bg-[#D4AF37]/10">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
        </div>
      ) : (
        <div className="relative w-4 h-4 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
          {/* Subtle 4-point star crosshair */}
          <div className="w-1.5 h-1.5 bg-[#F5F3ED] rounded-full opacity-80" />
          <div className="absolute w-3.5 h-[1px] bg-[#F5F3ED]/40" />
          <div className="absolute h-3.5 w-[1px] bg-[#F5F3ED]/40" />
        </div>
      )}
    </div>
  );
};
