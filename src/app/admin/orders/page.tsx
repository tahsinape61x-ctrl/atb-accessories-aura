'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await dataService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      (o.order_number ? o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (o.customer_name ? o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (o.customer_phone ? o.customer_phone.includes(searchTerm) : false)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track, process, and update status of customer orders</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Name, Phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#F5921F]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">Total: {filtered.length} Orders</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Shipping Address</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-[#F5921F]">{ord.order_number}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{ord.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{ord.shipping_address}</td>
                    <td className="py-3 px-4 uppercase text-slate-700 font-semibold">{ord.payment_method}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{formatPrice(ord.total_amount)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-[#F5921F]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
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
