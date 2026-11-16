'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Star,
  Filter,
  ArrowLeft,
  AlertCircle,
  SlidersHorizontal,
  X,
  Check,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Product, Subcategory, Brand } from '@/lib/supabase/types';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allStoreProducts, setAllStoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      setLoading(true);

      const [allCats, allBds, allProds] = await Promise.all([
        dataService.getCategories(),
        dataService.getBrands(),
        dataService.getProducts(),
      ]);

      setAllCategories(allCats);
      setBrands(allBds);
      setAllStoreProducts(allProds);

      const foundCat = allCats.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id.toLowerCase() === slug.toLowerCase()
      );
      setCategory(foundCat || null);

      if (foundCat) {
        const [subCats, catProducts] = await Promise.all([
          dataService.getSubcategories(foundCat.id),
          dataService.getProducts({ categorySlug: foundCat.slug }),
        ]);
        setSubcategories(subCats);
        setProducts(catProducts);
      } else {
        // Fallback: match products by slug or load all
        const matched = allProds.filter(
          (p) => p.category?.slug?.toLowerCase() === slug.toLowerCase() || p.category_id === slug
        );
        setProducts(matched.length > 0 ? matched : allProds);
      }

      setLoading(false);
    }

    loadCategoryData();
  }, [slug]);

  // Price range helper
  const matchesPrice = (price: number, range: string | null) => {
    if (!range) return true;
    if (range === 'under-500') return price < 500;
    if (range === '500-1500') return price >= 500 && price <= 1500;
    if (range === '1500-3000') return price > 1500 && price <= 3000;
    if (range === '3000-plus') return price > 3000;
    return true;
  };

  // Filtered & Sorted Products
  const displayedProducts = useMemo(() => {
    let result = [...products];

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory_id === selectedSubcategory);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand_id === selectedBrand);
    }
    if (selectedPriceRange) {
      result = result.filter((p) => {
        const pPrice = p.discount_price || p.price;
        return matchesPrice(pPrice, selectedPriceRange);
      });
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, selectedSubcategory, selectedBrand, selectedPriceRange, inStockOnly, sortBy]);

  const activeFiltersCount =
    (selectedSubcategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedSubcategory(null);
    setSelectedBrand(null);
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#F5921F] border-t-transparent mb-3"></div>
        <p className="text-slate-600 font-bold text-sm">Loading category products...</p>
      </div>
    );
  }

  const categoryName = category ? category.name : slug;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 font-sans">
      {/* 1. COMPACT BREADCRUMB & CATEGORY HEADER */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-[#F5921F] transition-colors flex items-center">
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Categories</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-bold capitalize">{categoryName}</span>
            </div>

            {/* Category Title & Badge */}
            <div className="flex items-center space-x-3 pt-1">
              {category?.image_url && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={category.image_url} alt={categoryName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {categoryName}
                  </h1>
                  <span className="bg-orange-50 text-[#F5921F] border border-orange-200 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    {displayedProducts.length} {displayedProducts.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                  {category?.description || 'Authentic gadgets and genuine accessories with official brand warranty.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Toolbar: Sort By & Mobile Filter Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F5921F]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#F5921F] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#F5921F] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN LAYOUT (SIDEBAR + PRODUCT CATALOG) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* DESKTOP SIDEBAR (col-span-3) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
          {/* Categories Navigation Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-[#F5921F]" />
                <span>All Categories</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{allCategories.length}</span>
            </h3>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {allCategories.map((cat) => {
                const isActive = cat.slug.toLowerCase() === slug.toLowerCase();
                const count = allStoreProducts.filter(
                  (p) => p.category_id === cat.id || p.category?.slug === cat.slug
                ).length;

                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-[#F5921F] font-black border border-orange-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#F5921F] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if available) */}
          {subcategories.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Subcategories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedSubcategory === null
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Subcategories
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedSubcategory === sub.id
                        ? 'bg-[#F5921F] text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Price Range
            </h3>
            <div className="space-y-1 text-xs font-bold text-slate-700">
              {[
                { label: 'All Prices', val: null },
                { label: 'Under ৳500', val: 'under-500' },
                { label: '৳500 – ৳1,500', val: '500-1500' },
                { label: '৳1,500 – ৳3,000', val: '1500-3000' },
                { label: 'Above ৳3,000', val: '3000-plus' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedPriceRange(item.val)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
                    selectedPriceRange === item.val
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Brands
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedBrand === null
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      selectedBrand === b.id
                        ? 'bg-[#F5921F] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filter Clear Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters ({activeFiltersCount})</span>
            </button>
          )}

          {/* Help Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black">Need Help Choosing?</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Not sure which charger or AirPods fit your device? Chat with our experts!
            </p>
            <a
              href="https://wa.me/8801706312594"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
            >
              WhatsApp Us ➔
            </a>
          </div>
        </aside>

        {/* MOBILE FILTERS DRAWER */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
            />

            {/* Slide-in Card */}
            <div className="relative ml-auto w-80 max-w-full bg-white h-full shadow-2xl p-5 overflow-y-auto space-y-5 z-10 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#F5921F]" />
                    <span>Filter Products</span>
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Price Range</h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { label: 'All', val: null },
                      { label: '< ৳500', val: 'under-500' },
                      { label: '৳500 - ৳1.5k', val: '500-1500' },
                      { label: '৳1.5k - ৳3k', val: '1500-3000' },
                      { label: '৳3,000+', val: '3000-plus' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setSelectedPriceRange(item.val)}
                        className={`p-2 rounded-xl text-center font-bold text-xs ${
                          selectedPriceRange === item.val
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Brands</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedBrand(null)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                        selectedBrand === null ? 'bg-slate-900 text-white' : 'bg-slate-100'
                      }`}
                    >
                      All
                    </button>
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBrand(b.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                          selectedBrand === b.id ? 'bg-[#F5921F] text-white' : 'bg-slate-100'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#F5921F] text-white py-3 rounded-xl font-bold text-xs"
                >
                  Apply Filters ({displayedProducts.length} Results)
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 text-rose-600 text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: PRODUCT CATALOG GRID (col-span-9) */}
        <main className="lg:col-span-9">
          {displayedProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xs space-y-4">
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-[#F5921F]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing the applied filters or browse our other top gadget categories.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  href="/"
                  className="w-full sm:w-auto px-4 py-2 bg-[#F5921F] text-white rounded-xl text-xs font-bold"
                >
                  Browse Storefront
                </Link>
              </div>
            </div>
          ) : (
            /* Responsive Product Grid */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              {displayedProducts.map((product) => {
                const discountPct = calculateDiscountPercentage(product.price, product.discount_price);
                const currentPrice = product.discount_price || product.price;
                const hasDiscount = !!product.discount_price && product.discount_price < product.price;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-slate-200/90 hover:border-[#F5921F]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg group"
                  >
                    {/* Top Image Container */}
                    <Link href={`/product/${product.slug}`} className="block relative">
                      <div className="relative aspect-square w-full bg-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        {/* Discount Badge */}
                        {discountPct && (
                          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                            -{discountPct}% OFF
                          </span>
                        )}

                        {/* New Badge */}
                        {product.is_new_arrival && (
                          <span className="absolute top-2.5 right-2.5 bg-[#F5921F] text-white font-black text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                            NEW
                          </span>
                        )}

                        {/* Product Image */}
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'}
                          alt={product.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Product Details & Actions */}
                    <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between space-y-3">
                      <div>
                        {/* Brand or Category Pill */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-[#F5921F] uppercase tracking-wider">
                            {product.brand?.name || 'ATB Genuine'}
                          </span>
                          <div className="flex items-center text-amber-400 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            <span>4.9</span>
                          </div>
                        </div>

                        {/* Title */}
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#F5921F] transition-colors line-clamp-2 leading-snug">
                            {product.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Pricing */}
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm sm:text-base font-black text-slate-900">
                            {formatPrice(currentPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart & Buy Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            alert(`Added "${product.title}" to cart!`);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-[#F5921F]" />
                          <span>Cart</span>
                        </button>
                        <Link
                          href={`/product/${product.slug}`}
                          className="bg-[#F5921F] hover:bg-[#d97d13] text-white py-2 rounded-xl text-xs font-black text-center transition-all shadow-2xs hover:shadow-sm"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
