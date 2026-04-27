import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { PRODUCTS, SITE_CONTENT } from "../constants";
import { Product } from "../types";

interface NavbarProps {
  onSearchSelect: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- SECURITY: INPUT SANITIZATION ---
  const sanitizeInput = (val: string) => {
    // Remove HTML tags, script tags, and suspicious characters
    return val
      .replace(/<[^>]*>?/gm, '') // Strip HTML
      .replace(/[<>]/g, '')     // Strip brackets
      .replace(/javascript:/gi, '') // Prevent javascript protocol
      .substring(0, 100);       // Max length validation
  };

  const filteredProducts = searchQuery.trim() === '' 
    ? [] 
    : PRODUCTS.filter(p => {
        const query = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(query) || 
               p.description.toLowerCase().includes(query);
      }).slice(0, 5);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery, isSearchVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        if (searchQuery.trim() === '') {
          setIsSearchVisible(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleSelect = (product: Product) => {
    onSearchSelect(product);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsSearchVisible(false);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredProducts.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredProducts.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelect(filteredProducts[selectedIndex]);
      } else if (filteredProducts.length > 0) {
        handleSelect(filteredProducts[0]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchVisible(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setSearchQuery('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = sanitizeInput(e.target.value);
    setSearchQuery(cleanValue);
  };

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a] shadow-2xl h-20 laptop:h-22 xl:h-24 transition-all">
        <div className="max-w-[1580px] mx-auto px-6 lg:px-10 laptop:px-8 h-full flex items-center justify-between gap-6 laptop:gap-8">
          
          <div className="flex items-center gap-4 laptop:gap-5 shrink-0 cursor-default">
            {/* ONLY IMAGE LOGO */}
            <img 
              src="favicon.svg" 
              alt="DC Notes Logo" 
              className="w-10 h-10 laptop:w-12 laptop:h-12 object-contain"
            />
            <span className="text-sm md:text-lg laptop:text-lg xl:text-xl font-extrabold text-[#ffffff] uppercase tracking-[0.3em]">
              Doji's <span className="text-[#fbbf24]">Library</span>
            </span>
          </div>


          <div className="hidden sm:flex items-center justify-end flex-grow gap-4 h-full">
            <div ref={searchRef} className="relative w-full max-w-md laptop:max-w-lg">
              <div 
                className={`flex items-center bg-[#1a1a1a] border rounded-sm transition-all duration-300 ${
                  isSearchFocused 
                    ? 'border-[#fbbf24]/80 ring-2 ring-[#fbbf24]/10' 
                    : 'border-[#2a2a2a] hover:border-[#9ca3af]'
                }`}
              >
                <div className="flex items-center justify-center w-10 laptop:w-12 shrink-0 text-[#9ca3af]/60 border-r border-[#2a2a2a]">
                  <Search size={18} className="laptop:hidden" />
                  <Search size={20} className="hidden laptop:block" />
                </div>
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Search technical notes..."
                  className="w-full bg-transparent border-none py-2.5 laptop:py-3 px-4 text-[#ffffff] f-body focus:ring-0 placeholder:text-[#9ca3af]/40 appearance-none"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
              </div>

              {isSearchFocused && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-3 duration-300">
                  {filteredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      className={`w-full px-5 py-4 laptop:px-6 laptop:py-5 text-left border-b border-[#2a2a2a] last:border-0 transition-all flex items-center gap-4 laptop:gap-5 group ${
                        index === selectedIndex ? 'bg-[#fbbf24]/10' : 'hover:bg-[#fbbf24]/5'
                      }`}
                      onClick={() => handleSelect(product)}
                    >
                      <div className="w-12 h-12 laptop:w-14 laptop:h-14 rounded-sm bg-[#1a1a1a] overflow-hidden shrink-0 border border-[#2a2a2a] group-hover:border-[#fbbf24]/40 transition-colors">
                        <img src={product.thumbnail} alt="" className={`w-full h-full object-cover transition-all duration-700 ${index === selectedIndex ? 'scale-110 opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
                      </div>
                      <div className="overflow-hidden">
                        <div className={`f-body font-black truncate transition-colors ${index === selectedIndex ? 'text-[#fbbf24]' : 'text-[#ffffff]'}`}>{product.title}</div>
                        <div className="f-small text-brand-muted/50 text-[10px] laptop:text-[11px] font-black truncate">{product.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-4">
            <button 
              onClick={toggleSearch}
              className={`flex items-center justify-center w-12 h-12 rounded border transition-all duration-300 active:scale-90 ${
                isSearchVisible 
                  ? 'bg-[#fbbf24] border-[#fbbf24] text-[#0a0a0a] shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-brand-muted hover:border-brand-gold/50'
              }`}
            >
              {isSearchVisible ? <X size={24} strokeWidth={3} /> : <Search size={24} />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center justify-center w-12 h-12 rounded border transition-all duration-300 active:scale-90 ${
                isMenuOpen ? 'border-brand-gold bg-brand-gold/15 text-[#fbbf24]' : 'border-[#2a2a2a] bg-[#1a1a1a] text-brand-muted'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isSearchVisible && (
          <div className="fixed top-20 left-0 right-0 bg-[#1a1a1a] border-b border-[#2a2a2a] p-6 sm:hidden z-[60] animate-in fade-in slide-in-from-top-5 duration-300 shadow-2xl">
            <div className="relative" ref={searchRef}>
              <div className="flex items-stretch bg-[#1a1a1a] border border-[#fbbf24]/40 rounded-sm focus-within:border-brand-gold transition-all overflow-hidden">
                <div className="flex items-center justify-center w-14 shrink-0 bg-brand-gold/5 text-[#fbbf24] border-r border-brand-gold/20">
                  <Search size={24} strokeWidth={2.5} />
                </div>
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Search technical notes..."
                  className="w-full bg-transparent border-none py-5 px-6 text-[#ffffff] f-body focus:ring-0 appearance-none"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  autoComplete="off"
                />
              </div>
              
              {filteredProducts.length > 0 && (
                <div className="mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded shadow-[0_35px_70px_rgba(0,0,0,0.5)] overflow-hidden max-h-[60vh] overflow-y-auto">
                  {filteredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      className={`w-full px-6 py-6 text-left border-b border-[#2a2a2a] last:border-0 flex items-center gap-5 ${
                        index === selectedIndex ? 'bg-[#fbbf24]/10' : ''
                      }`}
                      onClick={() => handleSelect(product)}
                    >
                      <div className="w-16 h-16 rounded-sm bg-[#1a1a1a] overflow-hidden shrink-0 border border-[#2a2a2a]">
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="f-body font-black text-[#ffffff] truncate">{product.title}</div>
                        <div className="f-small text-brand-muted/50 text-[11px] font-black truncate">{product.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`lg:hidden fixed left-0 right-0 top-20 z-50 overflow-hidden transition-all duration-500 ease-in-out bg-[#1a1a1a] border-b border-[#2a2a2a] ${isMenuOpen ? 'max-h-80 opacity-100 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        </div>
      </nav>
      
      {(isMenuOpen || (isSearchVisible && searchQuery.length > 0)) && (
        <div 
          className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-md lg:hidden animate-in fade-in duration-400" 
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchVisible(false);
          }}
        ></div>
      )}
    </>
  );
};