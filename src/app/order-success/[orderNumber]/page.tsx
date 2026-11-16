'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Phone, ArrowRight, Home } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import * as fpixel from '@/lib/fpixel';
import { Order } from '@/lib/supabase/types';
import { ATB_LOGO } from '@/lib/logoData';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    try {
      const saved = localStorage.getItem(`order_${orderNumber}`);
      if (saved) {
        const parsedOrder = JSON.parse(saved);
        setOrder(parsedOrder);

        // Fire Meta Pixel Purchase event
        fpixel.event('Purchase', {
          content_type: 'product',
          content_ids: parsedOrder.items?.map((it: any) => it.product_id) || [],
          value: parsedOrder.total_amount || 0,
          currency: 'BDT',
          num_items: parsedOrder.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || 1,
        });
      } else {
        // Fallback Purchase event with minimum default if not in localStorage
        fpixel.event('Purchase', {
          content_type: 'product',
          currency: 'BDT',
          content_ids: [orderNumber],
        });
      }
    } catch (err) {
      console.error('Error reading order for purchase pixel:', err);
    }
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 text-center">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-sm animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="bg-orange-100 text-[#F5921F] text-xs font-extrabold uppercase px-3 py-1 rounded-full">
        Order Received Successfully
      </span>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
        Your order has been recorded. Our team will verify and dispatch your package shortly.
      </p>

      {/* Order Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mt-8 text-left shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0b474d] border border-slate-200 shadow-2xs shrink-0">
              <img src={ATB_LOGO} alt="ATB Accessories Aura" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Number</p>
              <p className="text-xl font-extrabold text-[#F5921F]">{orderNumber || 'ATB-ORDER'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Payment Method</p>
            <p className="text-sm font-bold text-slate-800 uppercase">
              {order?.payment_method === 'cod' ? 'Cash on Delivery' : order?.payment_method || 'Cash on Delivery'}
            </p>
          </div>
        </div>

        {order && (
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Customer Name:</span>
              <span className="font-bold text-slate-900">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number:</span>
              <span className="font-bold text-slate-900">{order.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="font-bold text-slate-900 text-right max-w-xs">{order.shipping_address}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-sm sm:text-base font-extrabold text-slate-900">
              <span>Total Payable Amount:</span>
              <span className="text-[#F5921F]">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3 text-xs text-slate-600 mt-4">
          <Phone className="w-4 h-4 text-[#F5921F] shrink-0" />
          <span>
            Need urgent assistance or order confirmation? Call our Hotline: <strong>01706-312594</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <Link
          href="/track-order"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full text-xs sm:text-sm border border-slate-200 transition-colors"
        >
          <PackageCheck className="w-4 h-4 text-[#F5921F]" />
          <span>Track Your Order</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#F5921F] hover:bg-[#d97d13] text-white font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all transform hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
