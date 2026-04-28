import React, { useEffect } from 'react';
import { ShoppingCart, Copy, Smartphone, Monitor, X, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onToggleSelect: (product: Product, event?: React.MouseEvent) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onToggleSelect,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (selectedProducts.length === 0) return;

    const orderList = selectedProducts
      .map((p, index) => `${index + 1}. ${p.title} - ₱${p.price.toLocaleString()}`)
      .join('\n');

    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const fullText = `My Order:\n${orderList}\n\nTotal: ₱${total.toLocaleString()}`;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error('Clipboard API failed:', err);
        // Fallback to execCommand
        fallbackCopy(fullText);
      });
    } else {
      // Fallback for older browsers
      fallbackCopy(fullText);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('execCommand copy failed');
      }
    } catch (err) {
      console.error('execCommand copy error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleBuyNow = (platform: 'mobile' | 'desktop') => {
    if (selectedProducts.length === 0) return;

    const orderList = selectedProducts
      .map((p) => `${p.title} - ₱${p.price.toLocaleString()}`)
      .join(', ');

    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const message = encodeURIComponent(
      `Hi! I would like to purchase the following items:\n\n${orderList}\n\nTotal: ₱${total.toLocaleString()}`
    );

    const url = platform === 'mobile' 
      ? 'https://m.me/103186496068437' 
      : 'https://www.facebook.com/share/p/18DmuzbFKk/';

    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#222222] border border-white/10 rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-brand-yellow" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            {selectedProducts.length > 0 && (
              <span className="bg-brand-yellow/15 text-brand-yellow px-2 py-0.5 rounded-sm text-xs font-black">
                {selectedProducts.length} ITEMS
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} className="text-brand-gray hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-brand-gray/30 mb-4" />
              <p className="text-brand-gray/60 font-medium">Your cart is empty</p>
              <p className="text-brand-gray/40 text-sm mt-2">Select items to add them to your cart</p>
            </div>
          ) : (
            <>
              {/* Order List */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Selected Items</h3>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="flex items-start gap-3 bg-[#1A1A1A] border border-white/5 rounded-sm p-3"
                    >
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-16 h-10 object-cover rounded-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{product.title}</p>
                        <p className="text-brand-yellow text-sm font-bold">₱{product.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelect(product, e); }}
                        className="p-1 hover:bg-white/5 rounded transition-colors"
                      >
                        <X size={14} className="text-brand-gray/50 hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-brand-gray font-bold tracking-wider">TOTAL</span>
                  <span className="text-2xl font-bold text-brand-yellow">₱{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-sm p-4 mb-6">
                <h4 className="text-sm font-bold text-brand-yellow uppercase tracking-wider mb-2">How to Purchase</h4>
                <p className="text-brand-gray/80 text-sm leading-relaxed">
                  Click the copy button to copy your order. Then, send it to our Facebook page. 
                  You can click the button below if you're using mobile or desktop.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Copy Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopyOrder(e);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-sm font-bold transition-all touch-manipulation active:scale-[0.98] ${
                    copied 
                      ? 'bg-green-600 text-white cursor-default' 
                      : 'bg-white text-black hover:bg-white/90 cursor-pointer'
                  }`}
                  style={{ minHeight: '48px' }}
                  type="button"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={18} strokeWidth={2.5} />
                      COPY ORDER LIST
                    </>
                  )}
                </button>

                {/* Buy Buttons - Always show both, hide icons on mobile */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBuyNow('mobile')}
                    className="flex items-center justify-center gap-2 bg-brand-yellow text-black border border-brand-yellow py-3 rounded-sm transition-all duration-300 hover:bg-transparent hover:text-brand-yellow active:scale-95 font-bold"
                  >
                    <Smartphone size={16} strokeWidth={2.5} className="hidden sm:block" />
                    <span className="text-sm">BUY WITH MOBILE</span>
                  </button>
                  <button
                    onClick={() => handleBuyNow('desktop')}
                    className="flex items-center justify-center gap-2 bg-brand-yellow text-black border border-brand-yellow py-3 rounded-sm transition-all duration-300 hover:bg-transparent hover:text-brand-yellow active:scale-95 font-bold"
                  >
                    <Monitor size={16} strokeWidth={2.5} className="hidden sm:block" />
                    <span className="text-sm">BUY WITH DESKTOP</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
