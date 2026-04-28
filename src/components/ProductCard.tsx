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
      className={`group flex-shrink-0 w-[320px] sm:w-[360px] laptop:w-[290px] xl:w-[320px] bg-[#F5F5DC] border rounded-lg overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.98] shadow-2xl shadow-black/20 will-change-transform ${
        isHighlighted 
          ? 'animate-highlight border-yellow-600 z-10 scale-[1.02]' 
          : isSelected
            ? 'border-yellow-600 ring-2 ring-yellow-600/30'
            : 'border-black/5 hover:border-yellow-600/40'
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5DC] to-transparent opacity-40"></div>
      </div>
      
      <div className="p-5 laptop:p-5 flex flex-col flex-grow">
        <h3 className="f-body font-poppins font-medium text-black mb-1 leading-tight group-hover:text-yellow-600 transition-colors duration-300 truncate">
          {product.title}
        </h3>
        <p className="f-small normal-case text-gray-600/80 mb-4 flex-grow tracking-normal leading-relaxed line-clamp-2 opacity-80">
          {product.description}
        </p>
        
        <div className="mt-auto pt-3 border-t border-black/10">
          <div className="flex justify-between items-center mb-3">
            <span className="f-price text-green-600 drop-shadow-none text-xl lg:text-2xl flex-grow text-right">
              ₱{product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Add to Cart Section - Entire container is clickable */}
          <div 
            className="bg-black rounded-lg p-3 cursor-pointer hover:bg-black/90 transition-colors"
            onClick={() => onToggleSelect(product)}
          >
            <label className="flex justify-between items-center">
              <span className={`font-bold text-sm ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                {isSelected ? 'Added to cart' : 'Add to cart'}
              </span>
              <div
                className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-green-400 border-green-400' 
                    : 'bg-transparent border-black/40'
                }`}
              >
                {isSelected && <Check size={14} strokeWidth={3} className="text-black" />}
              </div>
            </label>
          </div>
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