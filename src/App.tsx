import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategorySection } from './components/CategorySection';
import { FAQSection } from './components/FAQSection';
import { NeuralNetwork } from './components/NeuralNetwork';
import { CartModal } from './components/CartModal';
import { PRODUCTS, CATEGORIES, SITE_CONTENT } from "./constants";  
import { Product } from './types';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const App: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    [CATEGORIES[0]]: true
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORIES[0]);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const catContainerRef = useRef<HTMLDivElement>(null);
  const catButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [isScrolling, setIsScrolling] = useState(false);

  const handleToggleSelect = (product: Product, event?: React.MouseEvent) => {
    // Create flying animation if event is provided
    if (event && cartButtonRef.current) {
      const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
      const cartRect = cartButtonRef.current.getBoundingClientRect();
      
      const flyingItem: FlyingItem = {
        id: Date.now(),
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
        imageSrc: product.thumbnail
      };
      
      setFlyingItems(prev => [...prev, flyingItem]);
      
      // Remove the flying item after animation completes
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== flyingItem.id));
      }, 600);
    }
    
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Performance optimized scroll spy using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-180px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryName = entry.target.getAttribute('data-category');
          if (categoryName && categoryName !== activeCategory) {
            setActiveCategory(categoryName);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    CATEGORIES.forEach((catName) => {
      const element = categoryRefs.current[catName];
      if (element) {
        element.setAttribute('data-category', catName);
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory && catContainerRef.current) {
      const activeBtn = catButtonRefs.current[activeCategory];
      const container = catContainerRef.current;
      
      if (activeBtn) {
        const targetScroll = activeBtn.offsetLeft - 24;
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory]);

  const scrollCatBar = (direction: 'left' | 'right') => {
    if (catContainerRef.current) {
      const scrollAmount = 300;
      catContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToCategory = (catName: string) => {
    const element = categoryRefs.current[catName];
    if (element) {
      setIsScrolling(true);
      // Get the header element within the category section
      const headerElement = element.querySelector('.category-header');
      const targetElement = headerElement || element;
      
      const offset = window.innerWidth >= 1024 ? 180 : 144; 
      const elementRect = targetElement.getBoundingClientRect();
      const elementPosition = elementRect.top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => setIsScrolling(false), 800);
    }
  };

  const toggleCategory = (catName: string) => {
    const isOpening = !openCategories[catName];
    
    setOpenCategories(prev => {
      if (isOpening) {
        // Close all other categories and open only the selected one
        return { [catName]: true };
      }
      // If closing, just remove this category
      const newState = { ...prev };
      delete newState[catName];
      return newState;
    });

    if (isOpening) {
      // Scroll after the expansion animation completes (500ms + small buffer)
      setTimeout(() => scrollToCategory(catName), 600);
    }
  };

  const jumpToCategory = (catName: string) => {
    if (openCategories[catName]) {
      scrollToCategory(catName);
      return;
    }

    setOpenCategories(prev => ({ ...prev, [catName]: true }));
    setTimeout(() => scrollToCategory(catName), 50);
  };

  const handleSearchSelect = (product: Product) => {
    setHighlightedProductId(product.id);
    jumpToCategory(product.category);
    setTimeout(() => setHighlightedProductId(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-sans selection:bg-brand-yellow selection:text-black relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] ambient-glow opacity-40"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] ambient-glow opacity-30 rotate-180"></div>
      </div>

      <div className="relative z-10">
        <Navbar onSearchSelect={handleSearchSelect} />
        
        <div className="sticky top-20 lg:top-24 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
          <div className="max-w-[1580px] mx-auto px-6 lg:px-10 flex items-center">
            <div 
              ref={catContainerRef}
              className="flex-grow flex gap-6 whitespace-nowrap overflow-x-auto no-scrollbar py-4 lg:py-5 relative"
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  ref={el => { catButtonRefs.current[cat] = el; }}
                  onClick={() => jumpToCategory(cat)}
                  className={`px-6 py-3 rounded-sm transition-all border font-poppins ${
                    activeCategory === cat 
                      ? 'bg-brand-yellow/15 border-brand-yellow text-brand-yellow' 
                      : 'bg-transparent border-white/10 text-brand-gray/50 hover:text-white hover:border-white/30'
                  } text-xs md:text-sm`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-6 ml-6 border-l border-white/5">
              <button 
                onClick={() => scrollCatBar('left')}
                className="flex items-center justify-center w-10 h-10 rounded-sm bg-black border border-white/10 text-brand-gray hover:text-brand-yellow hover:border-brand-yellow transition-all active:scale-90"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={() => scrollCatBar('right')}
                className="flex items-center justify-center w-10 h-10 rounded-sm bg-black border border-white/10 text-brand-gray hover:text-brand-yellow hover:border-brand-yellow transition-all active:scale-90"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
        
        <main className="max-w-[1580px] mx-auto px-6 lg:px-10 pb-40">
          <header className="relative py-8 md:py-12 lg:py-16 laptop:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="relative z-20 border-l-4 lg:border-l-8 border-brand-yellow pl-8 lg:pl-12 py-2 lg:py-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl laptop:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tighter italic drop-shadow-2xl">
                {SITE_CONTENT.hero.mainTitle}
              </h1>
              <p className="f-small text-brand-gray mt-6 lg:mt-10 font-black tracking-[0.4em] opacity-40">
                {SITE_CONTENT.hero.subTitle}
              </p>
            </div>
            
            <div className="absolute inset-0 z-10 opacity-70 lg:relative lg:inset-auto lg:z-auto lg:opacity-100 pointer-events-none h-full min-h-[250px] lg:h-[350px] xl:h-[450px]">
              <NeuralNetwork />
            </div>
          </header>

          <div className="relative">
            {CATEGORIES.map(categoryName => (
              <CategorySection 
                key={categoryName}
                ref={el => { categoryRefs.current[categoryName] = el; }}
                name={categoryName}
                isOpen={!!openCategories[categoryName]}
                onToggle={() => toggleCategory(categoryName)}
                products={PRODUCTS.filter(p => p.category === categoryName)}
                highlightedProductId={highlightedProductId}
                selectedProducts={selectedProducts}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          <FAQSection />
        </main>

        <footer className="border-t border-white/5 bg-[#1A1A1A] py-24 md:py-40 px-6 lg:px-10 relative z-10">
          <div className="max-w-[1580px] mx-auto flex flex-col items-center md:items-start text-center md:text-left gap-16 md:grid md:grid-cols-2 md:gap-32">
            <div className="space-y-8 flex flex-col items-center md:items-start w-full">
              <div className="text-xl font-black text-white uppercase tracking-[0.4em] border-b-2 border-brand-yellow w-fit pb-2">
                {SITE_CONTENT.brandName}
              </div>
              <p className="f-body text-brand-gray/70 leading-relaxed max-w-md font-medium">
                {SITE_CONTENT.footer.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-8 md:gap-12 w-full">
              <span className="f-small text-white font-black tracking-[0.5em]">COLLECTIONS</span>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-12 gap-y-6">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => jumpToCategory(cat)}
                    className="f-small text-brand-gray hover:text-brand-yellow transition-colors font-black"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="max-w-[1580px] mx-auto mt-24 md:mt-40 pt-12 border-t border-white/5 flex flex-col items-center gap-10 text-center md:flex-row md:justify-between">
            <p className="f-small text-brand-gray/60 font-black">{SITE_CONTENT.footer.copyright}</p>
          </div>
        </footer>

        {/* Floating Cart Button */}
        <button
          ref={cartButtonRef}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-[99] bg-white text-black p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-all duration-300 active:scale-95 group"
          aria-label="Open cart"
        >
          <ShoppingCart size={28} strokeWidth={2.5} />
          {selectedProducts.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold border-2 border-[#0D0D0D]">
              {selectedProducts.length}
            </span>
          )}
        </button>
      </div>

      {/* Flying Items Animation */}
      {flyingItems.map(item => (
        <div
          key={item.id}
          className="fixed z-[100] pointer-events-none animate-fly-to-cart"
          style={{
            left: 0,
            top: 0,
            '--start-x': `${item.startX}px`,
            '--start-y': `${item.startY}px`,
            '--end-x': `${item.endX}px`,
            '--end-y': `${item.endY}px`,
          } as React.CSSProperties}
        >
          <img 
            src={item.imageSrc} 
            alt="" 
            className="w-12 h-12 object-cover rounded-sm shadow-lg"
          />
        </div>
      ))}

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        selectedProducts={selectedProducts}
        onToggleSelect={handleToggleSelect}
      />
    </div>
  );
};

export default App;