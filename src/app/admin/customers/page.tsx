'use client';

import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, ShoppingBag, Search, ExternalLink } from 'lucide-react';
import { dataService } from '@/lib/services/dataService';
import { Order } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const o = await dataService.getOrders();
      setOrders(o);
      setLoading(false);
    }
    load();
  }, []);

  // Aggregate customers by phone number
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    address: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: string;
    lastOrderNumber: string;
  }>();

  orders.forEach((ord) => {
    const phone = ord.customer_phone?.trim() || 'No Phone';
    const existing = customerMap.get(phone);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += ord.total_amount || 0;
      if (new Date(ord.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.created_at;
        existing.lastOrderNumber = ord.order_number;
        existing.address = ord.shipping_address;
      }
    } else {
      customerMap.set(phone, {
        name: ord.customer_name,
        phone: ord.customer_phone,
        address: ord.shipping_address,
        ordersCount: 1,
        totalSpent: ord.total_amount || 0,
        lastOrderDate: ord.created_at,
        lastOrderNumber: ord.order_number,
      });
    }
  });

  const customers = Array.from(customerMap.values()).filter((c) => {
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.phone.toLowerCase().includes(s) ||
      c.address.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customers Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer details, order history, and contact numbers generated from orders.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or phone..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F5921F]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F5921F] border-t-transparent"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            {search ? 'No matching customers found.' : 'No customers found yet. Customer profiles appear when orders are placed.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.phone} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-[#F5921F] font-black flex items-center justify-center shrink-0">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Last: {c.lastOrderNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <a href={`tel:${c.phone}`} className="hover:text-[#F5921F] flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={c.address}>
                      {c.address}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-slate-100 text-slate-800 font-black px-2.5 py-1 rounded-full text-[11px]">
                        {c.ordersCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#F5921F]">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/880${c.phone.replace(/\D/g, '').replace(/^880/, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
