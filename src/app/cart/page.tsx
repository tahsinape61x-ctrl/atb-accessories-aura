'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#F5921F] border border-orange-100 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
          Looks like you haven&apos;t added any gadgets or accessories to your cart yet. Discover our genuine products today!
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = item.product.discount_price || item.product.price;
            const lineTotal = price * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow w-full space-y-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-bold text-slate-900 hover:text-[#F5921F] text-sm sm:text-base line-clamp-2 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-slate-400">SKU: {item.product.sku}</p>
                  <div className="text-sm font-extrabold text-[#F5921F]">
                    {formatPrice(price)}
                    {item.product.discount_price && (
                      <span className="text-xs text-slate-400 line-through font-normal ml-2">
                        {formatPrice(item.product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-l transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-r transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right sm:text-center">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                      {formatPrice(lineTotal)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline inline-flex items-center space-x-1 mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#F5921F]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Delivery</span>
              <span className="text-xs text-slate-500">Calculated at checkout</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-slate-900 text-base">
              <span>Subtotal Amount</span>
              <span className="text-[#F5921F] text-lg">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/60 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-orange-900">Standard Delivery Notice:</p>
            <p>• Inside Dhaka: ৳70 (24-48 Hours)</p>
            <p>• Outside Dhaka: ৳130 (2-4 Days)</p>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-[#F5921F] hover:bg-[#d97d13] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
