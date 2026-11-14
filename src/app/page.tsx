'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    async function loadData() {
      const [sData, cData, bData, pData] = await Promise.all([
        dataService.getSliders(),
        dataService.getCategories(),
        dataService.getBrands(),
        dataService.getProducts({ featuredOnly: true }),
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

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 sm:pb-16 w-full max-w-full overflow-x-hidden">
      
      {/* Top Notice */}
      <div className="bg-gradient-to-r from-slate-100 via-orange-50 to-slate-100 border-b border-slate-200 py-2 sm:py-2.5 px-3 sm:px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center space-x-2 text-[#F5921F] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>ATB ACCESSORIES AURA — Official Phone & Gadget Accessories Store Bangladesh</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700 font-semibold">
            <span className="flex items-center space-x-1 bg-white px-2.5 py-0.5 rounded border border-slate-300 text-[10px] sm:text-[11px]">
              <span>Official Warranty Stock</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner Slider */}
      {sliders.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-1">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 aspect-[16/9] sm:aspect-[21/9] min-h-[220px] sm:min-h-[360px] md:min-h-[420px] w-full">
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
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex flex-col justify-center px-6 md:px-16 text-white space-y-2 sm:space-y-3">
                  <span className="inline-block bg-[#F5921F] text-slate-950 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full w-max">
                    Featured Launch
                  </span>
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold max-w-xl leading-tight tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-slate-300 text-xs md:text-base max-w-lg font-normal drop-shadow">
                    {slide.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={slide.link || '/category/charger'}
                      className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                      <span>Explore Gear</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Arrows */}
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#F5921F] text-slate-800 hover:text-white p-1.5 sm:p-2.5 rounded-full z-20 transition-all border border-slate-300 backdrop-blur-sm shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % sliders.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#F5921F] text-slate-800 hover:text-white p-1.5 sm:p-2.5 rounded-full z-20 transition-all border border-slate-300 backdrop-blur-sm shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5 sm:space-x-2">
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

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-1 sm:pt-2">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5921F] fill-[#F5921F]" />
              <span>Explore Categories</span>
            </h2>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Browse gadgets by authentic product categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-[#F5921F]/50 rounded-2xl p-3 text-center transition-all duration-200 group flex flex-col items-center shadow-xs hover:shadow-md"
            >
              <div className="w-16 h-16 relative rounded-full overflow-hidden mb-2.5 bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#F5921F] font-bold text-lg">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#F5921F] line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-1 sm:pt-2">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
              <span>Trending & Exclusive Gear</span>
            </h2>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Hand-picked premium accessories with official warranty</p>
          </div>
          <Link
            href="/offers"
            className="text-xs font-bold text-[#F5921F] hover:underline flex items-center space-x-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map((product) => {
            const discountPct = calculateDiscountPercentage(product.price, product.discount_price);
            const currentPrice = product.discount_price || product.price;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md group"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square w-full bg-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {discountPct && (
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                        -{discountPct}% OFF
                      </span>
                    )}
                    {product.is_new_arrival && (
                      <span className="absolute top-2.5 right-2.5 bg-[#F5921F] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                        NEW
                      </span>
                    )}
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#F5921F] uppercase tracking-wider">
                      Official Stock
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F5921F] transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base font-extrabold text-slate-900">
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
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#F5921F]" />
                      <span>Add</span>
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-[#F5921F] hover:bg-[#d97d13] text-white py-2 rounded-xl text-xs font-extrabold text-center transition-all shadow-sm"
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

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-1 sm:pt-2">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-center text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 sm:mb-6">
              Authorized Bangladesh Reseller For Top Brands
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 items-center">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#F7F8FA] border border-slate-200 hover:border-[#F5921F]/40 p-2.5 rounded-xl text-center font-bold text-xs text-slate-700 hover:text-[#F5921F] transition-colors"
                >
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
