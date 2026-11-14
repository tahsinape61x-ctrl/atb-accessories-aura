'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShoppingCart,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  RefreshCw,
  Flame,
  Phone,
  CheckCircle,
  Sparkles,
  Award,
} from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Product, Slider, Brand } from '@/lib/supabase/types';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const [sData, cData, bData, pData] = await Promise.all([
        dataService.getSliders(),
        dataService.getCategories(),
        dataService.getBrands(),
        dataService.getProducts(),
      ]);
      setSliders(sData);
      setCategories(cData);
      setBrands(bData);
      setFeaturedProducts(pData);
    }
    loadData();
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (sliders.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders]);

  // Tab filtering
  const displayedProducts =
    selectedCategoryTab === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category?.slug === selectedCategoryTab);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 w-full max-w-full overflow-x-hidden font-sans">
      {/* 1. TOP ANNOUNCEMENT RIBBON */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white py-2 px-3 text-center border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-orange-400 font-bold">100% Genuine Gadgets & Official Warranty</span>
            <span className="hidden md:inline text-slate-400">— Nationwide Delivery in 24-48 Hours</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 text-[10px]">
              Cash on Delivery & bKash
            </span>
            <a
              href="https://wa.me/8801706312594"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Hotline: 01706-312594</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. HERO BANNER SLIDER */}
      {sliders.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200 aspect-[16/9] sm:aspect-[21/9] min-h-[240px] sm:min-h-[380px] md:min-h-[440px] w-full">
            {sliders.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={slide.image_url}
                  alt={slide.title || 'Banner'}
                  fill
                  priority={index === 0}
                  className="object-cover object-center brightness-75 hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent flex flex-col justify-center px-6 md:px-16 text-white space-y-2 sm:space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#F5921F] text-slate-950 text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                      Official Stock 2026
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                      Best BD Pricing
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl md:text-5xl font-black max-w-xl leading-tight tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-lg font-medium drop-shadow">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 flex items-center space-x-3">
                    <Link
                      href={slide.link || '/category/charger'}
                      className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white font-black text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                      <span>Explore Gear</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/offers"
                      className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full border border-white/20 transition-colors"
                    >
                      <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Hot Deals</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Controls */}
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#F5921F] text-slate-900 hover:text-white p-2 rounded-full z-20 transition-all border border-slate-300 backdrop-blur-sm shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % sliders.length)}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#F5921F] text-slate-900 hover:text-white p-2 rounded-full z-20 transition-all border border-slate-300 backdrop-blur-sm shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide ? 'w-8 bg-[#F5921F]' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. VALUE PROPOSITION FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs hover:border-[#F5921F]/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 text-[#F5921F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">100% Authentic</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Official Brand Warranty</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs hover:border-[#F5921F]/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Express Delivery</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Dhaka 24h, Nationwide 48h</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs hover:border-[#F5921F]/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">COD & Mobile Banking</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">bKash, Nagad, Rocket</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs hover:border-[#F5921F]/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">7 Days Replacement</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hassle-Free Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F5921F] fill-[#F5921F]" />
              <span>Explore Top Categories</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Find high performance phone and audio accessories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white hover:bg-orange-50/40 border border-slate-200 hover:border-[#F5921F] rounded-2xl p-4 text-center transition-all duration-300 group flex flex-col items-center shadow-xs hover:shadow-md transform hover:-translate-y-1"
            >
              <div className="w-18 h-18 relative rounded-full overflow-hidden mb-3 bg-slate-100 border-2 border-slate-200 group-hover:border-[#F5921F] group-hover:scale-105 transition-all">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#F5921F] font-black text-xl">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#F5921F] line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Explore ➔</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FLASH SALE / HOT DEALS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-[#F5921F] rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 fill-white animate-bounce" />
                <span>Special Flash Deals</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black">Mega Discount Deals — Limited Time</h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                Save big on premium chargers, cables & true wireless earbuds
              </p>
            </div>
            <Link
              href="/offers"
              className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-full font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center space-x-1.5"
            >
              <span>View All Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Flash Deals Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
            {featuredProducts.slice(0, 4).map((prod) => {
              const discountPct = calculateDiscountPercentage(prod.price, prod.discount_price);
              const currentPrice = prod.discount_price || prod.price;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden p-3.5 text-slate-900 flex flex-col justify-between shadow-md group hover:shadow-xl transition-all"
                >
                  <Link href={`/product/${prod.slug}`}>
                    <div className="relative aspect-square w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                      {discountPct && (
                        <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                          -{discountPct}% OFF
                        </span>
                      )}
                      <Image
                        src={prod.images[0]}
                        alt={prod.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#F5921F] mb-1">
                      {prod.title}
                    </h3>
                  </Link>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {formatPrice(currentPrice)}
                      </span>
                      {prod.discount_price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(prod.price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(prod, 1);
                        alert(`Added "${prod.title}" to cart!`);
                      }}
                      className="w-full mt-2 bg-[#F5921F] hover:bg-[#d97d13] text-white py-1.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS & FEATURED CATALOG WITH TABS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Best Selling Gadgets & Accessories</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Top-rated genuine gear backed by warranty</p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-4 py-2 rounded-full transition-all shrink-0 ${
                selectedCategoryTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Products
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.slug)}
                className={`px-4 py-2 rounded-full transition-all shrink-0 ${
                  selectedCategoryTab === cat.slug
                    ? 'bg-[#F5921F] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {displayedProducts.map((product) => {
            const discountPct = calculateDiscountPercentage(product.price, product.discount_price);
            const currentPrice = product.discount_price || product.price;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg group"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square w-full bg-[#F7F8FA] p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {discountPct && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow-sm">
                        -{discountPct}% OFF
                      </span>
                    )}
                    {product.is_new_arrival && (
                      <span className="absolute top-3 right-3 bg-[#F5921F] text-white font-black text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow-sm">
                        NEW
                      </span>
                    )}
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-1 text-[11px] text-amber-500 font-bold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>5.0</span>
                      <span className="text-slate-400 font-normal">(Verified Stock)</span>
                    </div>

                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#F5921F] transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {formatPrice(currentPrice)}
                      </span>
                      {product.discount_price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        alert(`Added "${product.title}" to cart!`);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#F5921F]" />
                      <span>Add</span>
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-[#F5921F] hover:bg-[#d97d13] text-white py-2.5 rounded-xl text-xs font-extrabold text-center transition-all shadow-sm"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. WHY CHOOSE ATB ACCESSORIES AURA */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
          <span className="bg-orange-100 text-[#F5921F] text-xs font-black uppercase px-3 py-1 rounded-full">
            Bangladesh&apos;s Trusted Gadget Store
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            Why Shop from ATB ACCESSORIES AURA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8">
            We source 100% brand-original accessories with official distributor warranty, offering direct COD and fast delivery across Bangladesh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Genuine Product Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero duplicates or clone products. All chargers, cables, and audio gear are strictly brand-original.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Rapid Nationwide Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                24 hours express delivery inside Dhaka city and 48 hours for all other 63 districts with real-time tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Dedicated Customer Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct hotline support and WhatsApp assistance at 01706-312594 for orders and warranty claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUTHORIZED BRANDS */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              Authorized Stock For Leading Global Brands
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-center">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#F7F8FA] border border-slate-200 hover:border-[#F5921F] p-3 rounded-2xl text-center font-black text-xs text-slate-800 hover:text-[#F5921F] transition-all"
                >
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. REAL CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">What Our Customers Say</h2>
          <p className="text-xs text-slate-500 mt-1">Verified reviews from satisfied tech enthusiasts across BD</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;Received my Anker 65W GaN charger inside Dhaka within 24 hours. Original QR code verified. Excellent packaging!&quot;
            </p>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-extrabold text-slate-900">Sabbir Hossain</p>
              <p className="text-[10px] text-slate-400">Mirpur, Dhaka — Verified Buyer</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;Best place for genuine iPhone accessories. Ordered AirPods Pro 2 case and cable, arrived in Chittagong in 2 days.&quot;
            </p>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-extrabold text-slate-900">Tanvir Chowdhury</p>
              <p className="text-[10px] text-slate-400">GEC Circle, Chittagong — Verified Buyer</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;Paid via bKash send money, order tracking updated instantly. Great support team and authentic Baseus power bank.&quot;
            </p>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-extrabold text-slate-900">Mahmudul Hasan</p>
              <p className="text-[10px] text-slate-400">Zindabazar, Sylhet — Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/8801706312594"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all transform hover:scale-110 group border-2 border-white"
        title="Chat on WhatsApp (01706-312594)"
      >
        <Phone className="w-6 h-6 fill-white" />
        <span className="hidden group-hover:inline text-xs font-bold pr-1">
          WhatsApp: 01706-312594
        </span>
      </a>
    </div>
  );
}
