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
  const englishScrollRef = useRef<HTMLDivElement>(null);
  const tagalogScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [englishCanScrollLeft, setEnglishCanScrollLeft] = useState(false);
  const [englishCanScrollRight, setEnglishCanScrollRight] = useState(true);
  const [tagalogCanScrollLeft, setTagalogCanScrollLeft] = useState(false);
  const [tagalogCanScrollRight, setTagalogCanScrollRight] = useState(true);

  // Separate products by language (check for Tagalog Version in title)
  const englishProducts = products.filter(p => !p.title.includes('(Tagalog Version)'));
  const tagalogProducts = products.filter(p => p.title.includes('(Tagalog Version)'));

  // Robust observer-based scroll state detection for English row
  useEffect(() => {
    if (!isOpen || !englishScrollRef.current || englishProducts.length === 0) return;

    const container = englishScrollRef.current;
    
    // Initialize scroll states on mount
    const updateScrollStates = () => {
      setEnglishCanScrollLeft(container.scrollLeft > 5);
      setEnglishCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5);
    };
    
    updateScrollStates();
    
    // Observer for detecting first and last item visibility for button states
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const index = parseInt(target.dataset.index || '0');
          
          if (index === 0) {
            setEnglishCanScrollLeft(!entry.isIntersecting || entry.intersectionRatio < 0.9);
          }
          if (index === englishProducts.length - 1) {
            setEnglishCanScrollRight(!entry.isIntersecting || entry.intersectionRatio < 0.9);
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

    const cards = container.querySelectorAll('.product-card-item[data-row="english"]');
    cards.forEach(card => {
      navObserver.observe(card);
      activeObserver.observe(card);
    });
    
    // Add scroll event listener for immediate button state updates
    container.addEventListener('scroll', updateScrollStates, { passive: true });

    return () => {
      navObserver.disconnect();
      activeObserver.disconnect();
      container.removeEventListener('scroll', updateScrollStates);
    };
  }, [isOpen, englishProducts.length]);

  // Robust observer-based scroll state detection for Tagalog row
  useEffect(() => {
    if (!isOpen || !tagalogScrollRef.current || tagalogProducts.length === 0) return;

    const container = tagalogScrollRef.current;
    
    // Initialize scroll states on mount
    const updateScrollStates = () => {
      setTagalogCanScrollLeft(container.scrollLeft > 5);
      setTagalogCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5);
    };
    
    updateScrollStates();
    
    // Observer for detecting first and last item visibility for button states
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const index = parseInt(target.dataset.index || '0');
          
          if (index === 0) {
            setTagalogCanScrollLeft(!entry.isIntersecting || entry.intersectionRatio < 0.9);
          }
          if (index === tagalogProducts.length - 1) {
            setTagalogCanScrollRight(!entry.isIntersecting || entry.intersectionRatio < 0.9);
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

    const cards = container.querySelectorAll('.product-card-item[data-row="tagalog"]');
    cards.forEach(card => {
      navObserver.observe(card);
      activeObserver.observe(card);
    });
    
    // Add scroll event listener for immediate button state updates
    container.addEventListener('scroll', updateScrollStates, { passive: true });

    return () => {
      navObserver.disconnect();
      activeObserver.disconnect();
      container.removeEventListener('scroll', updateScrollStates);
    };
  }, [isOpen, tagalogProducts.length]);

  const scroll = (direction: 'left' | 'right', row: 'english' | 'tagalog') => {
    const container = row === 'english' ? englishScrollRef.current : tagalogScrollRef.current;
    if (!container) return;

    const clientWidth = container.clientWidth;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const jumpToCard = (index: number, row: 'english' | 'tagalog') => {
    const container = row === 'english' ? englishScrollRef.current : tagalogScrollRef.current;
    const target = cardRefs.current[index];
    if (target && container) {
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
      className="transition-all rounded-xl overflow-hidden bg-[#0B0B0C] border border-[#F9F9F7]/5 shadow-2xl mb-8 lg:mb-12 will-change-transform"
    >
      <div className="category-header px-6 lg:px-8 py-3 lg:py-5 laptop:py-6 bg-[#0B0B0C]/40 border-b border-[#F9F9F7]/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
          <button 
            onClick={onToggle}
            className="flex-grow flex items-center gap-4 text-left outline-none group/title"
            aria-expanded={isOpen}
          >
            <h2 className="f-heading font-normal text-[#F9F9F7] group-hover/title:text-[#6E0F1A] transition-colors uppercase tracking-tighter">
              {name}
            </h2>
            <div className={`text-[#6F6F6C] transition-transform duration-300 p-1 border border-transparent rounded-full ${isOpen ? 'rotate-180 text-[#6E0F1A] bg-[#6E0F1A]/5' : 'group-hover/title:text-[#F9F9F7]'}`}>
              <ChevronDown size={28} strokeWidth={2.5} />
            </div>
          </button>
          
          <div className="flex items-center justify-between sm:justify-end gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="f-small bg-[#0B0B0C]/60 text-[#6E0F1A] px-3 py-1.5 rounded-sm border border-[#F9F9F7]/5 font-extrabold whitespace-nowrap shadow-xl">
                {products.length} <span className="opacity-50">ITEMS</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-out will-change-[max-height,opacity] ${isOpen ? 'max-h-[2800px] opacity-100 p-4 lg:p-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {/* English Row */}
        {englishProducts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-extrabold text-[#F9F9F7] uppercase tracking-wider bg-[#6E0F1A]/10 px-3 py-1 rounded-sm border border-[#0B0B0C]" style={{ textShadow: '0 0 3px rgba(0,0,0,0.8), 0 0 1px #000' }}>English Version</span>
            </div>
            <div className="relative">
              <div 
                ref={englishScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-2 scroll-smooth max-lg:px-[calc(50vw-140px-24px)] sm:max-lg:px-[calc(50vw-160px-24px)] lg:px-2 will-change-transform"
              >
                {englishProducts.map((product, idx) => (
                  <div 
                    key={product.id} 
                    className="product-card-item flex-shrink-0 snap-center lg:snap-start" 
                    data-index={idx}
                    data-row="english"
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

            <div className="flex justify-center items-center gap-3 mt-3 laptop:mt-4">
              {englishProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jumpToCard(i, 'english')}
                  className={`transition-all duration-300 rounded-full h-1 ${
                    activeIndex === i 
                      ? 'bg-[#6E0F1A] w-10 shadow-[0_0_10px_rgba(155,28,28,0.5)]' 
                      : 'bg-[#F9F9F7]/10 w-2 hover:bg-[#F9F9F7]/30'
                  }`}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation buttons for English row */}
            <div className="flex justify-center items-center gap-2 mt-3">
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('left', 'english'); }}
                disabled={!englishCanScrollLeft}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#0B0B0C] border transition-all active:scale-90 ${
                  !englishCanScrollLeft 
                    ? 'opacity-10 border-[#6F6F6C] text-[#6F6F6C] cursor-not-allowed' 
                    : 'border-[#6F6F6C] text-[#6F6F6C] hover:text-[#6E0F1A] hover:border-[#6E0F1A] hover:bg-[#6E0F1A]/5'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('right', 'english'); }}
                disabled={!englishCanScrollRight}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#0B0B0C] border transition-all active:scale-90 ${
                  !englishCanScrollRight
                    ? 'opacity-10 border-[#6F6F6C] text-[#6F6F6C] cursor-not-allowed' 
                    : 'border-[#6F6F6C] text-[#6F6F6C] hover:text-[#6E0F1A] hover:border-[#6E0F1A] hover:bg-[#6E0F1A]/5'
                }`}
                aria-label="Next"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        {/* Tagalog Row */}
        {tagalogProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-extrabold text-[#F9F9F7] uppercase tracking-wider bg-[#6E0F1A]/10 px-3 py-1 rounded-sm border border-[#0B0B0C]" style={{ textShadow: '0 0 3px rgba(0,0,0,0.8), 0 0 1px #000' }}>Tagalog Version</span>
            </div>
            <div className="relative">
              <div 
                ref={tagalogScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-2 scroll-smooth max-lg:px-[calc(50vw-140px-24px)] sm:max-lg:px-[calc(50vw-160px-24px)] lg:px-2 will-change-transform"
              >
                {tagalogProducts.map((product, idx) => (
                  <div 
                    key={product.id} 
                    className="product-card-item flex-shrink-0 snap-center lg:snap-start" 
                    data-index={idx}
                    data-row="tagalog"
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

            <div className="flex justify-center items-center gap-3 mt-3 laptop:mt-4">
              {tagalogProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jumpToCard(i, 'tagalog')}
                  className={`transition-all duration-300 rounded-full h-1 ${
                    activeIndex === i 
                      ? 'bg-[#6E0F1A] w-10 shadow-[0_0_10px_rgba(155,28,28,0.5)]' 
                      : 'bg-[#F9F9F7]/10 w-2 hover:bg-[#F9F9F7]/30'
                  }`}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation buttons for Tagalog row */}
            <div className="flex justify-center items-center gap-2 mt-3">
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('left', 'tagalog'); }}
                disabled={!tagalogCanScrollLeft}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#0B0B0C] border transition-all active:scale-90 ${
                  !tagalogCanScrollLeft 
                    ? 'opacity-10 border-[#6F6F6C] text-[#6F6F6C] cursor-not-allowed' 
                    : 'border-[#6F6F6C] text-[#6F6F6C] hover:text-[#6E0F1A] hover:border-[#6E0F1A] hover:bg-[#6E0F1A]/5'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('right', 'tagalog'); }}
                disabled={!tagalogCanScrollRight}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#0B0B0C] border transition-all active:scale-90 ${
                  !tagalogCanScrollRight
                    ? 'opacity-10 border-[#6F6F6C] text-[#6F6F6C] cursor-not-allowed' 
                    : 'border-[#6F6F6C] text-[#6F6F6C] hover:text-[#6E0F1A] hover:border-[#6E0F1A] hover:bg-[#6E0F1A]/5'
                }`}
                aria-label="Next"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

CategorySection.displayName = 'CategorySection';
