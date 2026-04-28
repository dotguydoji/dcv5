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
  selectedProducts: Product[];
  onToggleSelect: (product: Product) => void;
}

export const CategorySection = React.forwardRef<HTMLElement, CategorySectionProps>(({ name, products, isOpen, onToggle, highlightedProductId, selectedProducts, onToggleSelect }, ref) => {
  const englishScrollRef = useRef<HTMLDivElement>(null);
  const tagalogScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [englishActiveIndex, setEnglishActiveIndex] = useState(0);
  const [tagalogActiveIndex, setTagalogActiveIndex] = useState(0);
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
    
    // Force immediate scroll state calculation after DOM render
    const calculateScrollState = () => {
      const hasScroll = container.scrollWidth > container.clientWidth;
      const canScrollLeft = container.scrollLeft > 5;
      const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 5;
      
      setEnglishCanScrollLeft(canScrollLeft);
      setEnglishCanScrollRight(hasScroll && canScrollRight);
    };
    
    // Calculate immediately and after a micro-task to ensure DOM is ready
    calculateScrollState();
    setTimeout(calculateScrollState, 0);
    requestAnimationFrame(calculateScrollState);
    
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
    let lastActiveIndex = -1;
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const activeObserver = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const mostVisibleEntry = entries.reduce((max, entry) => {
          return entry.intersectionRatio > (max?.intersectionRatio || 0) ? entry : max;
        }, entries.find(e => e.isIntersecting) || null);
        
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.7) {
          const newIndex = parseInt((mostVisibleEntry.target as HTMLElement).dataset.index || '0');
          
          // Debounce to prevent rapid switching
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          
          debounceTimer = setTimeout(() => {
            if (newIndex !== lastActiveIndex) {
              lastActiveIndex = newIndex;
              setEnglishActiveIndex(newIndex);
            }
          }, 50);
        }
      },
      { 
        root: container,
        threshold: [0.5, 0.7, 0.9]
      }
    );

    const cards = container.querySelectorAll('.product-card-item[data-row="english"]');
    cards.forEach(card => {
      navObserver.observe(card);
      activeObserver.observe(card);
    });
    
    // Add scroll event listener for immediate button state updates
    container.addEventListener('scroll', calculateScrollState, { passive: true });

    return () => {
      navObserver.disconnect();
      activeObserver.disconnect();
      container.removeEventListener('scroll', calculateScrollState);
    };
  }, [isOpen, englishProducts.length]);

  // Robust observer-based scroll state detection for Tagalog row
  useEffect(() => {
    if (!isOpen || !tagalogScrollRef.current || tagalogProducts.length === 0) return;

    const container = tagalogScrollRef.current;
    
    // Force immediate scroll state calculation after DOM render
    const calculateScrollState = () => {
      const hasScroll = container.scrollWidth > container.clientWidth;
      const canScrollLeft = container.scrollLeft > 5;
      const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 5;
      
      setTagalogCanScrollLeft(canScrollLeft);
      setTagalogCanScrollRight(hasScroll && canScrollRight);
    };
    
    // Calculate immediately and after a micro-task to ensure DOM is ready
    calculateScrollState();
    setTimeout(calculateScrollState, 0);
    requestAnimationFrame(calculateScrollState);
    
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
    let tagalogLastActiveIndex = -1;
    let tagalogDebounceTimer: NodeJS.Timeout | null = null;
    
    const activeObserver = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const mostVisibleEntry = entries.reduce((max, entry) => {
          return entry.intersectionRatio > (max?.intersectionRatio || 0) ? entry : max;
        }, entries.find(e => e.isIntersecting) || null);
        
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.7) {
          const newIndex = parseInt((mostVisibleEntry.target as HTMLElement).dataset.index || '0');
          
          // Debounce to prevent rapid switching
          if (tagalogDebounceTimer) {
            clearTimeout(tagalogDebounceTimer);
          }
          
          tagalogDebounceTimer = setTimeout(() => {
            if (newIndex !== tagalogLastActiveIndex) {
              tagalogLastActiveIndex = newIndex;
              setTagalogActiveIndex(newIndex);
            }
          }, 50);
        }
      },
      { 
        root: container,
        threshold: [0.5, 0.7, 0.9]
      }
    );

    const cards = container.querySelectorAll('.product-card-item[data-row="tagalog"]');
    cards.forEach(card => {
      navObserver.observe(card);
      activeObserver.observe(card);
    });
    
    // Add scroll event listener for immediate button state updates
    container.addEventListener('scroll', calculateScrollState, { passive: true });

    return () => {
      navObserver.disconnect();
      activeObserver.disconnect();
      container.removeEventListener('scroll', calculateScrollState);
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
      className="transition-all rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl mb-12 lg:mb-20 will-change-transform"
    >
      <div className="px-6 lg:px-8 py-3 lg:py-5 laptop:py-6 bg-[#2a2a2a]/60 border-b border-[#2a2a2a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
          <button 
            onClick={onToggle}
            className="flex-grow flex items-center gap-4 text-left outline-none group/title"
            aria-expanded={isOpen}
          >
            <h2 className="f-heading font-extrabold text-[#ffffff] group-hover/title:text-[#fbbf24] transition-colors uppercase italic tracking-tighter">
              {name}
            </h2>
            <div className={`text-[#9ca3af] transition-transform duration-300 p-1 border border-transparent rounded-full ${isOpen ? 'rotate-180 text-[#fbbf24] bg-[#fbbf24]/5' : 'group-hover/title:text-[#ffffff]'}`}>
              <ChevronDown size={28} strokeWidth={2.5} />
            </div>
          </button>
          
          <div className="flex items-center justify-between sm:justify-end gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="f-small bg-[#2a2a2a] text-[#fbbf24] px-3 py-1.5 rounded-sm border border-[#2a2a2a] font-extrabold whitespace-nowrap shadow-xl">
                {products.length} <span className="opacity-50">ITEMS</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-out will-change-[max-height,opacity] ${isOpen ? 'max-h-[2800px] opacity-100 p-4 lg:p-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {/* English Row */}
        {englishProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-extrabold text-[#fbbf24] uppercase tracking-wider bg-[#fbbf24]/10 px-3 py-1 rounded-sm border border-[#fbbf24]/20">English Version</span>
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
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggleSelect={onToggleSelect}
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
                      ? 'bg-[#fbbf24] w-10 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                      : 'bg-[#2a2a2a] w-2 hover:bg-[#9ca3af]'
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
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#2a2a2a] border transition-all active:scale-90 ${
                  !englishCanScrollLeft 
                    ? 'opacity-10 border-[#2a2a2a] text-[#9ca3af] cursor-not-allowed' 
                    : 'border-[#2a2a2a] text-[#9ca3af] hover:text-[#fbbf24] hover:border-brand-gold hover:bg-[#fbbf24]/5'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('right', 'english'); }}
                disabled={!englishCanScrollRight}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#2a2a2a] border transition-all active:scale-90 ${
                  !englishCanScrollRight
                    ? 'opacity-10 border-[#2a2a2a] text-[#9ca3af] cursor-not-allowed' 
                    : 'border-[#2a2a2a] text-[#9ca3af] hover:text-[#fbbf24] hover:border-brand-gold hover:bg-[#fbbf24]/5'
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
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-extrabold text-[#fbbf24] uppercase tracking-wider bg-[#fbbf24]/10 px-3 py-1 rounded-sm border border-[#fbbf24]/20">Tagalog Version</span>
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
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggleSelect={onToggleSelect}
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
                      ? 'bg-[#fbbf24] w-10 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                      : 'bg-[#2a2a2a] w-2 hover:bg-[#9ca3af]'
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
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#2a2a2a] border transition-all active:scale-90 ${
                  !tagalogCanScrollLeft 
                    ? 'opacity-10 border-[#2a2a2a] text-[#9ca3af] cursor-not-allowed' 
                    : 'border-[#2a2a2a] text-[#9ca3af] hover:text-[#fbbf24] hover:border-brand-gold hover:bg-[#fbbf24]/5'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scroll('right', 'tagalog'); }}
                disabled={!tagalogCanScrollRight}
                className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-sm bg-[#2a2a2a] border transition-all active:scale-90 ${
                  !tagalogCanScrollRight
                    ? 'opacity-10 border-[#2a2a2a] text-[#9ca3af] cursor-not-allowed' 
                    : 'border-[#2a2a2a] text-[#9ca3af] hover:text-[#fbbf24] hover:border-brand-gold hover:bg-[#fbbf24]/5'
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
