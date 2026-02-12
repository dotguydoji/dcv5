import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategorySection } from './components/CategorySection';
import { FAQSection } from './components/FAQSection';
import { NeuralNetwork } from './components/NeuralNetwork';
import { PRODUCTS, CATEGORIES, SITE_CONTENT } from "./constants"; 
import { Product } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    [CATEGORIES[0]]: true
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORIES[0]);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const catContainerRef = useRef<HTMLDivElement>(null);
  const catButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Performance optimized scroll spy
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
            ticking = false;
            return;
          }

          const offset = window.innerWidth >= 1024 ? 200 : 160;
          const scrollPosition = window.scrollY;

          if (scrollPosition < 50) {
            setActiveCategory(CATEGORIES[0]);
            ticking = false;
            return;
          }

          let currentActive = activeCategory;
          for (const catName of CATEGORIES) {
            const element = categoryRefs.current[catName];
            if (element && scrollPosition + offset >= element.offsetTop) {
              currentActive = catName;
            } else {
              break;
            }
          }

          if (currentActive !== activeCategory) {
            setActiveCategory(currentActive);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      const offset = window.innerWidth >= 1024 ? 180 : 144; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleCategory = (catName: string) => {
    const isMobile = window.innerWidth < 1024;
    const isOpening = !openCategories[catName];
    
    setOpenCategories(prev => {
      if (isMobile && isOpening) {
        return { [catName]: true };
      }
      return { ...prev, [catName]: isOpening };
    });

    if (isOpening) {
      setTimeout(() => scrollToCategory(catName), 100);
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
                  className={`f-small px-6 py-3 rounded-sm transition-all border font-black ${
                    activeCategory === cat 
                      ? 'bg-brand-yellow/15 border-brand-yellow text-brand-yellow' 
                      : 'bg-transparent border-white/10 text-brand-gray/50 hover:text-white hover:border-white/30'
                  }`}
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

          <div className="space-y-4 lg:space-y-8">
            {CATEGORIES.map(categoryName => (
              <CategorySection 
                key={categoryName}
                ref={el => { categoryRefs.current[categoryName] = el; }}
                name={categoryName}
                isOpen={!!openCategories[categoryName]}
                onToggle={() => toggleCategory(categoryName)}
                products={PRODUCTS.filter(p => p.category === categoryName)}
                highlightedProductId={highlightedProductId}
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
      </div>
    </div>
  );
};

export default App;