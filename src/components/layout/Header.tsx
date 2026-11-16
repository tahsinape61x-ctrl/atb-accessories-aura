'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { dataService } from '@/lib/services/dataService';
import { Product } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';
import { ATB_LOGO } from '@/lib/logoData';

export default function Header() {
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAllProducts() {
      const prods = await dataService.getProducts();
      setAllProducts(prods);
    }
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.model_no?.toLowerCase().includes(q)
      );
      setSearchResults(filtered.slice(0, 5));
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, allProducts]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white text-slate-900 sticky top-0 z-50 shadow-sm border-b border-slate-200 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden shadow-xs border border-slate-200 group-hover:scale-105 transition-transform bg-[#0b474d] shrink-0">
              <img src={ATB_LOGO} alt="ATB ACCESSORIES AURA" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-[#F5921F] transition-colors">
                ATB <span className="text-[#F5921F]">AURA</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
                Accessories
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search chargers, AirPods, cables, power banks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F8FA] text-slate-900 placeholder-slate-400 border border-slate-300 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-[#F5921F] focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all shadow-inner font-medium"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#F5921F] hover:bg-[#d97d13] text-white p-2 rounded-full transition-colors shadow-sm cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Search Dropdown Results */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-2 divide-y divide-slate-100">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={() => setIsSearching(false)}
                      className="flex items-center space-x-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <div className="w-10 h-10 relative bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                        <div className="text-xs font-extrabold text-[#F5921F]">
                          {formatPrice(p.discount_price || p.price)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#F5921F] bg-slate-100 rounded-full border border-slate-200 transition-colors"
              aria-label="Toggle Search"
            >
              {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="flex items-center space-x-1.5 sm:space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-extrabold text-xs shadow-md transition-all transform hover:scale-105"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline">Cart ({cartCount})</span>
            </Link>
          </div>

        </div>

        {/* Mobile Search Input Row */}
        {isMobileSearchOpen && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 md:hidden">
            <input
              type="text"
              placeholder="Search gadgets & accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-slate-300 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#F5921F]"
            />
          </div>
        )}
      </div>
    </header>
  );
}
