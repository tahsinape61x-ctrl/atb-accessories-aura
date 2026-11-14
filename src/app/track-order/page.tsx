'use client';

import React, { useState } from 'react';
import { Search, PackageCheck, Phone, CheckCircle, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function TrackOrderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const allOrders = await dataService.getOrders();
      const term = searchTerm.trim().toLowerCase();

      let found = allOrders.find(
        (o) =>
          (o.order_number ? o.order_number.toLowerCase() === term : false) ||
          (o.customer_phone ? o.customer_phone.replace(/\D/g, '').includes(term.replace(/\D/g, '')) : false)
      );

      if (!found && typeof window !== 'undefined') {
        try {
          const direct = localStorage.getItem(`order_${searchTerm.trim().toUpperCase()}`);
          if (direct) {
            found = JSON.parse(direct);
          }
        } catch (e) {}
      }

      setOrder(found || null);
    } catch (err) {
      console.error('Error tracking order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'new':
      case 'payment_pending':
        return 1;
      case 'confirmed':
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-orange-50 text-[#F5921F] rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-100">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number (e.g. ATB-7482) or Phone Number used during checkout to check live status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order ID (e.g. ATB-1234) or Phone Number"
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-full border border-slate-300 focus:outline-none focus:border-[#F5921F] focus:ring-1 focus:ring-[#F5921F] shadow-xs"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F5921F] hover:bg-[#d97d13] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {/* Result Display */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {order ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Number</span>
                  <h3 className="text-xl font-extrabold text-[#F5921F]">{order.order_number}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                  <p className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-orange-100 text-[#F5921F] w-max sm:ml-auto">
                    {order.status.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                {[
                  { step: 1, label: 'Placed' },
                  { step: 2, label: 'Confirmed' },
                  { step: 3, label: 'Shipped' },
                  { step: 4, label: 'Delivered' },
                ].map((s) => {
                  const currentStep = getStatusStep(order.status);
                  const isDone = currentStep >= s.step;
                  return (
                    <div key={s.step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                          isDone ? 'bg-[#F5921F] text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : s.step}
                      </div>
                      <span className={`text-[11px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-bold">{order.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-bold text-right max-w-xs">{order.shipping_address}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-extrabold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-[#F5921F] text-sm">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Have questions about this package? Hotline: <strong className="text-slate-900">01706-312594</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching order found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please double check the order number or phone number entered. If you just placed the order or need assistance, call us at <strong className="text-slate-800">01706-312594</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
