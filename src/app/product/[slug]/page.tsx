'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, Star, Plus, Minus, ArrowLeft } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Product } from '@/lib/supabase/types';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import * as fpixel from '@/lib/fpixel';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);

      const found = await dataService.getProductBySlug(slug);
      setProduct(found);

      if (found) {
        setSelectedImage(found.images[0] || '');

        // Fire Meta Pixel ViewContent
        fpixel.event('ViewContent', {
          content_name: found.title,
          content_ids: [found.id],
          content_type: 'product',
          value: found.discount_price || found.price,
          currency: 'BDT',
        });

        // Load related products
        const all = await dataService.getProducts();
        const related = all.filter((p) => p.id !== found.id && p.category_id === found.category_id);
        setRelatedProducts(related.slice(0, 4));
      }
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent mb-3"></div>
        <p className="text-slate-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-[#F5921F] text-white px-6 py-2.5 rounded-full font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    );
  }

  const discountPct = calculateDiscountPercentage(product.price, product.discount_price);
  const currentPrice = product.discount_price || product.price;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-[#F5921F]">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-[#F5921F]">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center p-6 shadow-sm">
            {discountPct && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full z-10 shadow-sm">
                -{discountPct}% OFF
              </span>
            )}
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                priority
                className="object-contain p-4"
              />
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-white shrink-0 p-1 transition-all ${
                    selectedImage === img ? 'border-[#F5921F] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-orange-100 text-[#F5921F] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Warranty
              </span>
              {product.brand && (
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Brand: {product.brand.name}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
              <span>SKU: <strong className="text-slate-800">{product.sku}</strong></span>
              {product.model_no && (
                <span>Model: <strong className="text-slate-800">{product.model_no}</strong></span>
              )}
              <span className="text-emerald-600 font-bold">● In Stock</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#F7F8FA] border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-baseline space-x-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatPrice(currentPrice)}
            </span>
            {product.discount_price && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {discountPct && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Save {formatPrice(product.price - product.discount_price)}
              </span>
            )}
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  alert(`Added ${quantity} item(s) to cart!`);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-200 transition-colors shadow-xs"
              >
                <ShoppingCart className="w-4 h-4 text-[#F5921F]" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#F5921F] hover:bg-[#d97d13] text-white py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Order Now (Buy Now)</span>
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center space-x-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>100% Authentic Product</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <Truck className="w-5 h-5 text-[#F5921F] shrink-0" />
              <span>Fast Express Delivery</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <RefreshCw className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Official Warranty Support</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-4 space-y-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Product Description
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Related Gadgets You May Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((rel) => {
              const relPrice = rel.discount_price || rel.price;
              return (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden p-3 group transition-all"
                >
                  <div className="relative aspect-square w-full bg-slate-50 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                    <Image src={rel.images[0]} alt={rel.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#F5921F] mb-1">
                    {rel.title}
                  </h3>
                  <span className="text-sm font-extrabold text-[#F5921F]">{formatPrice(relPrice)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
