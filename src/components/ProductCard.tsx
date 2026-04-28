import React, { useEffect, useRef, memo, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isHighlighted?: boolean;
  isSelected: boolean;
  onToggleSelect: (product: Product) => void;
}

export const ProductCard = memo(({ product, isHighlighted, isSelected, onToggleSelect }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 300);
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isHighlighted]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.willChange = 'auto';
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group flex-shrink-0 w-[320px] sm:w-[360px] laptop:w-[290px] xl:w-[320px] bg-[#222222] border rounded-lg overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.98] shadow-2xl shadow-black/80 will-change-transform ${
        isHighlighted 
          ? 'animate-highlight border-brand-yellow z-10 scale-[1.02]' 
          : isSelected
            ? 'border-brand-yellow ring-2 ring-brand-yellow/30'
            : 'border-white/5 hover:border-brand-yellow/40'
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-950/50">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 will-change-transform"
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#222222] to-transparent opacity-40"></div>
        
        {/* Selection Checkbox Overlay */}
        <button
          onClick={() => onToggleSelect(product)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected 
              ? 'bg-brand-yellow border-brand-yellow' 
              : 'bg-black/60 border-white/40 hover:border-white'
          }`}
        >
          {isSelected && <Check size={18} strokeWidth={3} className="text-black" />}
        </button>
      </div>
      
      <div className="p-5 laptop:p-5 flex flex-col flex-grow">
        <h3 className="f-body font-bold text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors duration-300 truncate">
          {product.title}
        </h3>
        <p className="f-small normal-case text-brand-gray/80 mb-4 flex-grow tracking-normal leading-relaxed line-clamp-2 opacity-80">
          {product.description}
        </p>
        
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="f-small text-brand-gray font-bold tracking-[0.2em] opacity-50">PRICE</span>
            <span className="f-price text-brand-yellow drop-shadow-[0_0_10px_rgba(255,107,0,0.2)] text-xl lg:text-2xl">
              ₱{product.price.toLocaleString()}
            </span>
          </div>
          
          {isSelected && (
            <p className="text-brand-yellow text-xs font-bold mt-2 flex items-center gap-1">
              <Check size={12} strokeWidth={3} />
              SELECTED
            </p>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.isSelected === nextProps.isSelected
  );
});

ProductCard.displayName = 'ProductCard';