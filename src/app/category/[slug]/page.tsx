'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Filter, ArrowLeft, AlertCircle } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Category, Product, Subcategory, Brand } from '@/lib/supabase/types';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      setLoading(true);

      const [allCats, allBrands] = await Promise.all([
        dataService.getCategories(),
        dataService.getBrands(),
      ]);

      const foundCat = allCats.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      setCategory(foundCat || null);
      setBrands(allBrands);

      if (foundCat) {
        const [subCats, catProducts] = await Promise.all([
          dataService.getSubcategories(foundCat.id),
          dataService.getProducts({ categorySlug: foundCat.slug }),
        ]);
        setSubcategories(subCats);
        setProducts(catProducts);
        setFilteredProducts(catProducts);
      } else {
        // Fallback: load all products if category not matched
        const allProds = await dataService.getProducts();
        setProducts(allProds);
        setFilteredProducts(allProds);
      }

      setLoading(false);
    }

    loadCategoryData();
  }, [slug]);

  // Handle local filtering by subcategory or brand
  useEffect(() => {
    let result = [...products];
    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory_id === selectedSubcategory);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand_id === selectedBrand);
    }
    setFilteredProducts(result);
  }, [selectedSubcategory, selectedBrand, products]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent mb-3"></div>
        <p className="text-slate-500 text-sm">Loading category products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs text-[#F5921F] font-bold">
            <Link href="/" className="hover:underline flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>All Categories</span>
            </Link>
            <span>/</span>
            <span className="text-white">{category ? category.name : slug}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {category ? category.name : `Products in ${slug}`}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            {category?.description || 'Authentic gadgets and genuine accessories with official brand warranty.'}
          </p>
        </div>
      </div>

      {/* Filter Tabs (Subcategories & Brands) */}
      {(subcategories.length > 0 || brands.length > 0) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          {subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-500 shrink-0">Subcategories:</span>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  selectedSubcategory === null
                    ? 'bg-[#F5921F] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                    selectedSubcategory === sub.id
                      ? 'bg-[#F5921F] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {brands.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-2.5">
              <span className="font-bold text-slate-500 shrink-0">Brand:</span>
              <button
                onClick={() => setSelectedBrand(null)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  selectedBrand === null
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                    selectedBrand === b.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Showing <span className="text-[#F5921F]">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products available in this selection</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try changing the filter options or explore other categories.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#F5921F] text-white px-5 py-2 rounded-full font-bold text-xs"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
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
        )}
      </div>
    </div>
  );
}
