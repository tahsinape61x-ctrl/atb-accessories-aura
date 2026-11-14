'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ShoppingCart, Home, ChevronRight, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Product } from '@/lib/supabase/types';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import * as fpixel from '@/lib/fpixel';

export default function OffersPage() {
  const { addToCart } = useCart();
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      const allProducts = await dataService.getProducts();
      // Filter products that have discount_price or are featured/deal products
      const deals = allProducts.filter(
        (p) => p.discount_price && p.discount_price < p.price
      );
      setDealProducts(deals.length > 0 ? deals : allProducts);
      setLoading(false);
    }
    loadDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#F5921F] flex items-center space-x-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-bold">Hot Deals & Exclusive Offers</span>
      </nav>

      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-[#F5921F] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-white" />
            <span>Limited Time Mega Savings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hot Deals & Special Discounts
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
            Grab genuine Anker, Apple, Samsung & Baseus accessories at exclusive discounted prices with 100% official warranty.
          </p>
        </div>
        <div className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-extrabold text-xs shadow-md text-center shrink-0">
          <span className="text-rose-600 text-lg sm:text-xl block font-black">Up to 25% OFF</span>
          <span className="text-slate-500 text-[10px] uppercase font-bold">Fast Delivery in BD</span>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="w-8 h-8 border-4 border-[#F5921F] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Loading hottest deals...</p>
        </div>
      ) : dealProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-2 shadow-sm">
          <p className="text-sm font-bold text-slate-900">No active discount offers right now.</p>
          <p className="text-xs text-slate-500">Check back soon for new flash deals!</p>
          <Link href="/" className="inline-block bg-[#F5921F] text-white font-bold px-5 py-2.5 rounded-xl text-xs mt-2">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {dealProducts.map((product) => {
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
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow-sm flex items-center space-x-1">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>-{discountPct}% OFF</span>
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
                        fpixel.event('AddToCart', {
                          content_name: product.title,
                          content_ids: [product.id],
                          content_type: 'product',
                          value: currentPrice,
                          currency: 'BDT',
                        });
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
      )}
    </div>
  );
}
