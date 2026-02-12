import React, { useEffect, useRef, memo, useCallback } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isHighlighted?: boolean;
}

export const ProductCard = memo(({ product, isHighlighted }: ProductCardProps) => {
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

  const buttonStyles = "flex items-center justify-center gap-2 bg-brand-yellow text-black border border-brand-yellow py-2 rounded-sm transition-all duration-300 hover:bg-transparent hover:text-brand-yellow active:scale-90 shadow-lg shadow-brand-yellow/10 will-change-transform";

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.willChange = 'auto';
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group flex-shrink-0 w-[320px] sm:w-[360px] laptop:w-[290px] xl:w-[320px] bg-[#222222] border rounded-lg overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.98] shadow-2xl shadow-black/80 will-change-transform ${
        isHighlighted 
          ? 'animate-highlight border-brand-yellow z-10 scale-[1.02]' 
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
      </div>
      
      <div className="p-5 laptop:p-5 flex flex-col flex-grow">
        <h3 className="f-body font-bold text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors duration-300 truncate">
          {product.title}
        </h3>
        <p className="f-small normal-case text-brand-gray/80 mb-4 flex-grow tracking-normal leading-relaxed line-clamp-2 opacity-80">
          {product.description}
        </p>
        
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex justify-between items-center mb-3">
            <span className="f-small text-brand-gray font-bold tracking-[0.2em] opacity-50">PRICE</span>
            <span className="f-price text-brand-yellow drop-shadow-[0_0_10px_rgba(255,107,0,0.2)] text-xl lg:text-2xl">
              ₱{product.price.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a 
                href={product.mobileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles}
              >
                <Smartphone size={13} strokeWidth={3} />
                <span className="f-small font-black text-[10px]">Mobile</span>
              </a>
              <a 
                href={product.desktopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles}
              >
                <Monitor size={13} strokeWidth={3} />
                <span className="f-small font-black text-[10px]">Desktop</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isHighlighted === nextProps.isHighlighted
  );
});

ProductCard.displayName = 'ProductCard';