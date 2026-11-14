'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await dataService.getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const manualPayments = orders.filter((o) => o.payment_method !== 'cod');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Payments & Verification</h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify bKash, Nagad, and Rocket Send Money transactions submitted by customers
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading payments...</div>
        ) : manualPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No digital mobile banking transactions recorded yet. (Cash on Delivery orders are tracked in Orders).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manualPayments.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{ord.order_number}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{ord.customer_name}</p>
                      <p className="text-slate-500 text-[11px]">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[#F5921F]">{ord.payment_method}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatPrice(ord.total_amount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                        Pending Verification
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
