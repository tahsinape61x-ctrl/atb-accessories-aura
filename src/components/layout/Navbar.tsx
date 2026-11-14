'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Flame } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category } from '@/lib/supabase/types';

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const cats = await dataService.getCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  return (
    <nav className="bg-white text-slate-800 border-b border-slate-200 shadow-sm w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-11 sm:h-12 gap-2">
          
          {/* All Categories Dropdown button */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#F5921F] hover:bg-[#d97d13] text-white font-extrabold text-xs uppercase px-3.5 h-11 sm:h-12 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#F5921F] hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable Categories List */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1 flex-1">
            <Link
              href="/offers"
              className="flex items-center space-x-1 text-xs font-extrabold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
              <span>Hot Deals</span>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-xs font-extrabold text-slate-700 hover:text-[#F5921F] px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 font-medium hidden md:block shrink-0">
            <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-bold">
              Fast Dhaka Delivery
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}
