import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  name: string;
  products: Product[];
  isOpen: boolean;
  onToggle: () => void;
  highlightedProductId?: string | null;
}

export const CategorySection = React.forwardRef<HTMLElement, CategorySectionProps>(({ name, products, isOpen, onToggle, highlightedProductId }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Robust observer-based scroll state detection
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;

    const container = scrollRef.current;
    
    // Observer for detecting first and last item visibility for button states
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const index = parseInt(target.dataset.index || '0');
          
          if (index === 0) {
            setCanScrollLeft(!entry.isIntersecting || entry.intersectionRatio < 0.9);
          }
          if (index === products.length - 1) {
            setCanScrollRight(!entry.isIntersecting || entry.intersectionRatio < 0.9);
          }
        });
      },
      { 
        root: container,
        threshold: [0.1, 0.9, 1.0],
        rootMargin: '0px -5px 0px -5px'
      }
    );

    // Observer for tracking active dot (which item is most visible)
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(e => e.isIntersecting);
        if (visibleEntry) {
          const index = parseInt((visibleEntry.target as HTMLElement).dataset.index || '0');
          setActiveIndex(index);
        }
      },
      { 
        root: container,
        threshold: 0.6 
      }
    );

    const cards = container.querySelectorAll('.product-card-item');
    cards.forEach(card => {
      navObserver.observe(card);
      activeObserver.observe(card);
    });

    return () => {
      navObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [isOpen, products.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const clientWidth = container.clientWidth;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const jumpToCard = (index: number) => {
    const target = cardRefs.current[index];
    if (target && scrollRef.current) {
      const container = scrollRef.current;
      const containerStyle = window.getComputedStyle(container);
      const paddingLeft = parseInt(containerStyle.paddingLeft) || 0;
      
      container.scrollTo({
        left: target.offsetLeft - paddingLeft,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section 
      ref={ref} 
      className="transition-all rounded-xl overflow-hidden bg-[#333333] border border-white/5 shadow-2xl mb-12 lg:mb-20 will-change-transform"
    >
      <div className="px-6 lg:px-8 py-3 lg:py-5 laptop:py-6 bg-black/40 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
          <button 
            onClick={onToggle}
            className="flex-grow flex items-center gap-4 text-left outline-none group/title"
            aria-expanded={isOpen}
          >
            <h2 className="f-heading font-black text-white group-hover/title:text-brand-yellow transition-colors uppercase italic tracking-tighter">
              {name}
            </h2>
            <div className={`text-brand-gray transition-transform duration-300 p-1 border border-transparent rounded-full ${isOpen ? 'rotate-180 text-brand-yellow bg-brand-yellow/5' : 'group-hover/title:text-white'}`}>
              <ChevronDown size={28} strokeWidth={2.5} />
            </div>
          </button>
          
          <div className="flex items-center justify-between sm:justify-end gap-6">
            {isOpen && (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); scroll('left'); }}
                  disabled={!canScrollLeft}
                  className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-black border transition-all active:scale-90 ${
                    !canScrollLeft 
                      ? 'opacity-10 border-gray-900 text-gray-800 cursor-not-allowed' 
                      : 'border-gray-800 text-brand-gray hover:text-brand-yellow hover:border-brand-yellow hover:bg-brand-yellow/5'
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); scroll('right'); }}
                  disabled={!canScrollRight}
                  className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-black border transition-all active:scale-90 ${
                    !canScrollRight
                      ? 'opacity-10 border-gray-900 text-gray-800 cursor-not-allowed' 
                      : 'border-gray-800 text-brand-gray hover:text-brand-yellow hover:border-brand-yellow hover:bg-brand-yellow/5'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>
            )}
            
            <div className="hidden sm:flex flex-col items-end">
              <span className="f-small bg-black/60 text-brand-yellow px-3 py-1.5 rounded-sm border border-white/5 font-black whitespace-nowrap shadow-xl">
                {products.length} <span className="opacity-50">ITEMS</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-out will-change-[max-height,opacity] ${isOpen ? 'max-h-[1400px] opacity-100 p-6 lg:p-8' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-2 scroll-smooth max-lg:px-[calc(50vw-140px-24px)] sm:max-lg:px-[calc(50vw-160px-24px)] lg:px-2 will-change-transform"
          >
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className="product-card-item flex-shrink-0 snap-center lg:snap-start" 
                data-index={idx}
                ref={el => { cardRefs.current[idx] = el; }}
              >
                <ProductCard 
                  product={product} 
                  isHighlighted={product.id === highlightedProductId}
                />
              </div>
            ))}
            <div className="flex-shrink-0 w-1 lg:hidden"></div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mt-4 laptop:mt-6">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToCard(i)}
              className={`transition-all duration-300 rounded-full h-1 ${
                activeIndex === i 
                  ? 'bg-brand-yellow w-10 shadow-[0_0_10px_rgba(255,107,0,0.5)]' 
                  : 'bg-white/10 w-2 hover:bg-white/30'
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

CategorySection.displayName = 'CategorySection';